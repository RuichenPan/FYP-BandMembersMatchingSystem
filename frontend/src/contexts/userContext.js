import React, { useReducer, createContext } from 'react';
import ConstTypeMap from './typeMap';
import HttpHelper from '../api/httpHelper';

export const UserContext = createContext(null);

const reducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case ConstTypeMap.USER_SING_UP:
      state.userInfo = payload;
      break;
    case ConstTypeMap.USER_SING_IN:
      state.userInfo = payload;
      break;
    case ConstTypeMap.USER_ERROR:
      state.error = payload;
      break;
    case ConstTypeMap.USER_CONFIG_MUSIC_STYLE:
      state.musicStyles = payload;
      break;
    case ConstTypeMap.USER_CONFIG_I_AM_A:
      state.IAmA = payload;
      break;
    case ConstTypeMap.USER_FAVORITES:
      state.favorites = true;
      break;
    case ConstTypeMap.USER_LOGOUT:
      Object.keys(state).forEach((fieldName) => {
        delete state[fieldName];
      });
      break;
    default:
      state.a = true;
      break;
  }
  return state;
};

const UserContentProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, {});

  const switchPage = (url, params) => {
    const query = HttpHelper.getQuery();
    props.history.push(query ? `${url}?${query}` : url, params);
  };

  const alertMsg = (msg) => {
    if (!msg) {
      return;
    }
    window.alert(msg);
  };

  /**
   * user signUp
   *
   * @param {*} data
   * @returns
   */
  const signUp = async (data) => {
    try {
      const bodyData = HttpHelper.clone(data);
      bodyData.password = HttpHelper.md5(bodyData.password);
      const info = await HttpHelper.apiPost('/user/signup', bodyData);
      dispatch({ type: ConstTypeMap.USER_SING_UP, payload: info });
      alertMsg('successful');
      switchPage('login');
      return info;
    } catch (ex) {
      dispatch({ type: ConstTypeMap.USER_ERROR, payload: ex.message || ex });
    }
  };

  /**
   * user sing in
   *
   * @param {*} data
   * @returns
   */
  const signIn = async (data) => {
    try {
      const bodyData = HttpHelper.clone(data);
      bodyData.password = HttpHelper.md5(bodyData.password);
      const info = await HttpHelper.apiPost('/user/signin', bodyData);
      dispatch({ type: ConstTypeMap.USER_SING_UP, payload: info });
      //save token and userInfo  to localstorage
      const { token } = info;
      HttpHelper.token = token;
      HttpHelper.userInfo = info;
      switchPage('profile');
    } catch (ex) {
      dispatch({ type: ConstTypeMap.USER_ERROR, payload: ex.message || ex });
    }
  };

  /**
   * check email
   *
   * @param {*} data
   */
  const checkEmail = async (data) => {
    await HttpHelper.apiPut('/user/checkEmail', {}, data);
    dispatch({ type: ConstTypeMap.USER_CHECK_EMAIL, payload: {} });
  };

  /**
   * logout
   */
  const onLogout = () => {
    HttpHelper.token = null;
    HttpHelper.userInfo = null;
    dispatch({ type: ConstTypeMap.USER_LOGOUT });
    switchPage('/login');
  };

  /***
   * get music style record
   */
  const musicStyle = async () => {
    const info = await HttpHelper.apiGet('/open/config/music_style');
    dispatch({ type: ConstTypeMap.USER_CONFIG_MUSIC_STYLE, payload: info });
    return info;
  };

  /**
   * get i am a record
   */
  const i_am_a = async () => {
    const info = await HttpHelper.apiGet('/open/config/i_am_a');
    dispatch({ type: ConstTypeMap.USER_CONFIG_I_AM_A, payload: info });
    return info;
  };

  const getConfigInfo = async () => {
    await musicStyle();
    await i_am_a();
  };

  const updateProfile = async (data) => {
    try {
      const info = await HttpHelper.apiPut('/user/profile', data);
      dispatch({ type: ConstTypeMap.USER_SING_UP, payload: info });
      return info;
    } catch (ex) {
      dispatch({ type: ConstTypeMap.USER_ERROR, payload: ex.message || ex });
    }
  };

  const onFavorites = async (data) => {
    dispatch({ type: ConstTypeMap.USER_FAVORITES, payload: data });
  };

  return (
    <UserContext.Provider value={{ ...props, state, checkEmail, onFavorites, switchPage, onLogout, musicStyle, i_am_a, getConfigInfo, signUp, signIn, updateProfile }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContentProvider;
