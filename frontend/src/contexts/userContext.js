import React, { useReducer, createContext } from 'react';
import ConstTypeMap from './typeMap';
import HttpHelper from '../api/httpHelper';

export const UserContext = createContext(null);

const reducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case ConstTypeMap.USER_SING_UP:
      state.signUp = payload;
      break;
    case ConstTypeMap.USER_INFO:
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
    case ConstTypeMap.VIDEO_LIST:
      state.video = payload;
      break;
    case ConstTypeMap.ALBUM_LIST:
      state.album = payload;
      break;
    case ConstTypeMap.SOURCE_DELETE_ALBUM:
      const tmpAlbum = state.album.list;
      tmpAlbum.splice(payload, 1);
      state.album.list = tmpAlbum;
      break;
    case ConstTypeMap.SOURCE_DELETE_VIDEO:
      const tmpVideo = state.video.list;
      tmpVideo.splice(payload, 1);
      state.video.list = tmpVideo;
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

  HttpHelper.initFunction({ switchPage, alertMsg });

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
      const info = await HttpHelper.apiPost('/api/user/signup', bodyData);
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
      const info = await HttpHelper.apiPost('/api/user/signin', bodyData);
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
    await HttpHelper.apiPut('/api/user/checkEmail', {}, data);
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
    const info = await HttpHelper.apiGet('/api/open/config/music_style');
    dispatch({ type: ConstTypeMap.USER_CONFIG_MUSIC_STYLE, payload: info });
    return info;
  };

  /**
   * get i am a record
   */
  const i_am_a = async () => {
    const info = await HttpHelper.apiGet('/api/open/config/i_am_a');
    dispatch({ type: ConstTypeMap.USER_CONFIG_I_AM_A, payload: info });
    return info;
  };

  const getConfigInfo = async () => {
    await musicStyle();
    await i_am_a();
  };

  const onUpdateProfile = async (data) => {
    try {
      const info = await HttpHelper.apiPut('/api/user/profile', {}, data);
      dispatch({ type: ConstTypeMap.USER_SING_UP, payload: info });
      return info;
    } catch (ex) {
      dispatch({ type: ConstTypeMap.USER_ERROR, payload: ex.message || ex });
    }
  };

  const addFavorites = async (data) => {
    dispatch({ type: ConstTypeMap.USER_FAVORITES, payload: data });
  };

  const getUserInfo = async () => {
    try {
      const userInfo = await HttpHelper.apiGet('/api/user/info');
      dispatch({ type: ConstTypeMap.USER_INFO, payload: userInfo });
      return userInfo;
    } catch (ex) {
      console.log(ex);
    }
  };

  const onUpload = async (file) => {
    try {
      const fileInfo = await HttpHelper.apiUpload('/api/user/upload', { file });
      return fileInfo;
    } catch (ex) {
      console.log(ex);
    }
  };

  const onAlbum = async ({ page = 1, size = 10, user_id }) => {
    const info = await HttpHelper.apiGet(`/api/open/album/${user_id}`, { page, size });
    dispatch({ type: ConstTypeMap.ALBUM_LIST, payload: info });
    return info;
  };

  const onVideo = async ({ page = 1, size = 10, user_id }) => {
    const info = await HttpHelper.apiGet(`/api/open/video/${user_id}`, { page, size });
    dispatch({ type: ConstTypeMap.VIDEO_LIST, payload: info });
    return info;
  };

  const onSourceDelete = async (item, index, type) => {
    const { user_id, id } = item;
    const info = await HttpHelper.apiDelete(`/api/source/${user_id}/${id}`);

    dispatch({ type: type === 'video' ? ConstTypeMap.SOURCE_DELETE_VIDEO : ConstTypeMap.SOURCE_DELETE_ALBUM, payload: index });
    return info;
  };

  return (
    <UserContext.Provider
      value={{
        ...props,
        state,
        userInfo: state.userInfo,
        onSourceDelete,
        onUpload,
        onAlbum,
        onVideo,
        checkEmail,
        getUserInfo,
        addFavorites,
        switchPage,
        onLogout,
        musicStyle,
        i_am_a,
        getConfigInfo,
        signUp,
        signIn,
        onUpdateProfile,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContentProvider;
