import { combineReducers } from 'redux';
import {
  LOADING,
  LOADING_FALSE,
  HELLO_WORLD,
  RESET,
  PHOTOS,
  USER_SEARCH,
  LOADING_SWITCH,
  UPDATE_CENTER
} from './../actions';


let initialState = { center: [48.750906, -122.480607], message: 'Hello', photos: { 'objects': [] }, loading: true, userList: [{label: "conlloc", value: "conlloc"}] }

const helloWorld = (state=initialState, action) => {
  switch (action.type) {
    case LOADING_SWITCH:
      return {...state, loading: action.payload}
    case USER_SEARCH:
      const obj = JSON.parse(action.payload)
      return {...state, userList: obj.objects }
    case HELLO_WORLD:
      return Object.assign({}, state, { message: 'Hello, World!' })
    case RESET:
    	return state = initialState
    case LOADING:
      return {...state, loading: true }
    case LOADING_FALSE:
      return {...state, loading: false }
    case PHOTOS:
      const x = action.payload.objects
      const first = x[0]
      return {...state, photos: action.payload, center: [first.lat, first.lon] }
    case UPDATE_CENTER:
      console.log(action.payload)
      return {...state, center: action.payload }
    default:
      return state
  }
}

const helloReducer = combineReducers({
  def: helloWorld
})

export default helloReducer
