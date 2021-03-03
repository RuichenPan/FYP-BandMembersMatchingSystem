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
    default:
      state.a = true;
      break;
  }
  return state;
};

const UserContentProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, {});

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
      const info = await HttpHelper.apiPost('/user/signin', data);
      dispatch({ type: ConstTypeMap.USER_SING_UP, payload: info });
      return info;
    } catch (ex) {
      dispatch({ type: ConstTypeMap.USER_ERROR, payload: ex.message || ex });
    }
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

  return <UserContext.Provider value={{ userInfo: state, signUp, signIn, updateProfile }}>{props.children}</UserContext.Provider>;
};

export default UserContentProvider;
