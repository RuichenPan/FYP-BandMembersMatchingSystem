import React, { useReducer, createContext } from 'react';
import ConstTypeMap from './typeMap';
import HttpHelper from '../api/httpHelper';
import UserReducer from './userReducers';
import Util from '../util';

export const UserContext = createContext(null);

const UserContentProvider = (props) => {
  const [state, dispatch] = useReducer(UserReducer, {});

  const switchPage = (url, params) => {
    const query = HttpHelper.getQuery(params);

    props.history.push(query ? `${url}?${query}` : url, params);
  };
  const goBack = () => {
    props.history.goBack();
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

      Util.userNofity.next(info);

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

  /**
   * get config information
   */
  const getConfigInfo = async () => {
    await musicStyle();
    await i_am_a();
  };

  /**
   *
   * @param {*} data
   */
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

  /**
   * get current user information
   */
  const getUserInfo = async () => {
    try {
      const userInfo = await HttpHelper.apiGet('/api/user/info');
      dispatch({ type: ConstTypeMap.USER_INFO, payload: userInfo });
      return userInfo;
    } catch (ex) {
      console.log(ex);
    }
  };

  /**
   * update file
   * @param {*} file
   */
  const onUpload = async (file) => {
    try {
      const fileInfo = await HttpHelper.apiUpload('/api/user/upload', { file });
      return fileInfo;
    } catch (ex) {
      console.log(ex);
    }
  };

  /**
   * get album list
   * @param {*} param0
   */
  const onAlbum = async ({ page = 1, size = 10, user_id }) => {
    const info = await HttpHelper.apiGet(`/api/open/album/${user_id}`, { page, size });
    dispatch({ type: ConstTypeMap.ALBUM_LIST, payload: info });
    return info;
  };

  /**
   * get video list
   * @param {*} param0
   */
  const onVideo = async ({ page = 1, size = 10, user_id }) => {
    const info = await HttpHelper.apiGet(`/api/open/video/${user_id}`, { page, size });
    dispatch({ type: ConstTypeMap.VIDEO_LIST, payload: info });
    return info;
  };

  /**
   * delete resource file
   * @param {*} item
   * @param {*} index
   * @param {*} type
   */
  const onSourceDelete = async (item, index, type) => {
    const { user_id, id } = item;
    const info = await HttpHelper.apiDelete(`/api/source/${user_id}/${id}`);

    dispatch({ type: type === 'video' ? ConstTypeMap.SOURCE_DELETE_VIDEO : ConstTypeMap.SOURCE_DELETE_ALBUM, payload: index });
    return info;
  };

  /**
   * get home data
   * @param {*} param0
   */
  const onHomeData = async ({ page = 1, size = 20, keyworld } = {}) => {
    const info = await HttpHelper.apiGet('/api/open/home', { page, size, keyworld });
    dispatch({ type: ConstTypeMap.HOME_USER_LIST, payload: info });
    return info;
  };

  /**
   * i want you
   * @param {*} id
   */
  const onAddFavorites = async (user_id) => {
    const info = await HttpHelper.apiPost(`/api/favorite/${user_id}`);
    dispatch({ type: ConstTypeMap.I_WANT_YOU, payload: info });
    return info;
  };

  /**
   * delete i want you
   * @param {*} id
   */
  const onDeleteFavorites = async (user_id) => {
    const info = await HttpHelper.apiDelete(`/api/favorite/${user_id}`);
    dispatch({ type: ConstTypeMap.I_WANT_YOU_DELETE, payload: info });
    return info;
  };

  /**
   * get i want you list
   */
  const onGetFavoritesList = async () => {
    const info = await HttpHelper.apiGet('/api/favorite/mine');
    dispatch({ type: ConstTypeMap.FAVORITES_MINE, payload: info });
    return info;
  };

  /**
   * get select person information
   * @param {*} user_id
   */
  const onGetPersonDetail = async (user_id) => {
    const info = await HttpHelper.apiGet('/api/open/person/' + user_id);
    dispatch({ type: ConstTypeMap.HOME_PERSON_DETAIL, payload: info });
    return info;
  };

  /**
   * get map serach address
   *
   * @param {*} q
   * @return {*}
   */
  const onMapSearch = async (q) => {
    if (!q) {
      alertMsg('Please enter keyword');
      return;
    }
    const info = await HttpHelper.apiGet('/api/map/address/detail?q=' + q);
    console.log('serach map result:', info);
    dispatch({ type: ConstTypeMap.MAP_SERACH_ADDRESS, payload: info });
    return info;
  };

  /**
   * reverse lan lon
   *
   * @param {*} { lat, lon }
   * @return {*}
   */
  const onMapReverse = async ({ lat, lon }) => {
    const info = await HttpHelper.apiGet(`/api/map/reverse?lat=${lat}&lon=${lon}`);
    dispatch({ type: ConstTypeMap.MAP_REVERSE_GPS_GET_ADDRESS, payload: info });
    return info;
  };

  /**
   * get commnt list by user id
   *
   * @param {*} { page, size, user_id }
   * @return {*}
   */
  const onGetCommentList = async ({ page, size, user_id }) => {
    const info = await HttpHelper.apiGet('/api/comment/' + user_id, { page, size });
    dispatch({ type: ConstTypeMap.COMMENT_GET_LIST, payload: info });
    return info;
  };

  /**
   * add user comment
   *
   * @param {*} { user_id, content }
   * @return {*}
   */
  const onAddComment = async ({ user_id, content }) => {
    const info = await HttpHelper.apiPost('/api/comment/' + user_id, { content });
    dispatch({ type: ConstTypeMap.COMMENT_ADD, payload: info });
    return info;
  };

  /**
   * reply comment
   *
   * @param {*} { comment_id, content }
   * @return {*}
   */
  const onReplyComment = async ({ comment_id, content }) => {
    const info = await HttpHelper.apiPut('/api/comment/reply/' + comment_id, {}, { content });
    dispatch({ type: ConstTypeMap.COMMENT_REPLY, payload: info });
    return info;
  };

  /**
   * delete comment
   *
   * @param {*} comment_id
   * @return {*}
   */
  const onDeleteComment = async (comment_id) => {
    const info = await HttpHelper.apiDelete('/api/comment/' + comment_id);
    dispatch({ type: ConstTypeMap.COMMENT_Delete, payload: info });
    return info;
  };

  return (
    <UserContext.Provider
      value={{
        ...props,
        state,
        onDeleteComment,
        onReplyComment,
        onGetCommentList,
        onAddComment,
        onMapSearch,
        onMapReverse,
        userInfo: state.userInfo,
        onGetPersonDetail,
        onGetFavoritesList,
        onDeleteFavorites,
        onSourceDelete,
        onAddFavorites,
        onHomeData,
        onUpload,
        onAlbum,
        onVideo,
        checkEmail,
        getUserInfo,
        addFavorites,
        onLogout,
        musicStyle,
        i_am_a,
        getConfigInfo,
        signUp,
        signIn,
        onUpdateProfile,
        alertMsg,
        switchPage,
        goBack,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContentProvider;
