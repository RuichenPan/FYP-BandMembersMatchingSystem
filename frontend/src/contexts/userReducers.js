import ConstTypeMap from './typeMap';

const UserReducer = (state = {}, action) => {
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
    case ConstTypeMap.HOME_USER_LIST:
      state.home = payload;
      break;

    case ConstTypeMap.HOME_USER_LIST_DETAIL:
      state.userDetail = payload;
      break;
    case ConstTypeMap.I_WANT_YOU:
      state.favorite = payload;
      break;
    case ConstTypeMap.FAVORITES_MINE:
      state.favorite_mine = payload;
      break;

    case ConstTypeMap.HOME_PERSON_DETAIL:
      state.personDetail = payload;
      break;
    case ConstTypeMap.MAP_SERACH_ADDRESS:
      state.mapAddress = payload;
      break;
    case ConstTypeMap.MAP_REVERSE_GPS_GET_ADDRESS:
      state.reverseGpsAddress = payload;
      break;
    case ConstTypeMap.CHAT_USER_MSG_MAP:
      state.userMsgMap = payload;
      break;
    default:
      state.a = true;
      break;
  }
  return state;
};

export default UserReducer;
