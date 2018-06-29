import { combineReducers } from 'redux';
import {
  LOADING,
  LOADING_FALSE,
  HELLO_WORLD,
  RESET,
  PHOTOS,
  USER_SEARCH,
  LOADING_SWITCH,
  UPDATE_CENTER,
  USER_SEARCH_ERROR,
  PHOTOS_FOR,
  CLOSE_MODAL,
  MODAL_POINTER,
  AUTH_MODAL_CHANGE_STATE
} from './../actions';


let initialState = {
  singlePhoto: {},
  modalState: false,
  mapLoading: false,
  photosForUsername: 'everyone',
  userSearchError: '' ,
  center: [48.750906, -122.480607],
  message: 'Hello',
  photos: { 'objects': [] },
  loading: true,
  userList: [{label: "connell-gough", value: "connell-gough"}],
  modalPointer: 0,
  loginModalState: false,
  logoutModalState: false,
  registerModalState: false
}

const helloWorld = (state=initialState, action) => {
  switch (action.type) {
    case LOADING_SWITCH:
      return {...state, loading: action.payload}
    case USER_SEARCH:
      const obj = JSON.parse(action.payload);
      return {...state, userList: obj.objects }
    case HELLO_WORLD:
      return Object.assign({}, state, { message: 'Hello, World!' })
    case RESET:
    	return state = initialState
    case LOADING:
      return {...state, mapLoading: true }
    case LOADING_FALSE:
      return {...state, mapLoading: false }
    case PHOTOS:
      const x = action.payload.objects
      const first = x[0]
      return {...state, photos: action.payload, center: [first.lat, first.lon] }
    case UPDATE_CENTER:
      return {...state, center: action.payload }
    case USER_SEARCH_ERROR:
      return {...state, userSearchError: action.payload }
    case PHOTOS_FOR:
      return {...state, photosForUsername: action.payload }
    case CLOSE_MODAL:
      return {...state, modalState: false }
    case AUTH_MODAL_CHANGE_STATE:
      if (action.payload === 'login') {
        return {...state, loginModalState: true, logoutModalState: false, registerModalState: false }
      } else if (action.payload === 'register') {
        return {...state, loginModalState: false, logoutModalState: false, registerModalState: true }
      } else if (action.payload === 'logout') {
        return {...state, loginModalState: false, logoutModalState: true, registerModalState: false }
      } else {
        return state
      }
      console.log(action.payload)
      return {...state, liloModalState: action.payload }
    case MODAL_POINTER:
      return Object.assign({}, state, {modalPointer: action.payload, modalState: true})
    default:
      return state
  }
}

const helloReducer = combineReducers({
  def: helloWorld
})

export default helloReducer
