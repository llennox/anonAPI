import { combineReducers } from 'redux';
import {
  LOADING,
  LOADING_FALSE,
  HELLO_WORLD,
  RESET,
  PHOTOS
} from './../actions';


let initialState = { message: 'Hello', photos: {}, loading: false }

const helloWorld = (state=initialState, action) => {
  switch (action.type) {
    case HELLO_WORLD:
      return Object.assign({}, state, { message: 'Hello, World!' })
    case RESET:
    	return state = initialState
    case LOADING:
      return {...state, loading: true }
    case LOADING_FALSE:
      return {...state, loading: false }
    case PHOTOS:
      return {...state, photos: action.payload }
    default:
      return state
  }
}

const helloReducer = combineReducers({
  def: helloWorld
})

export default helloReducer
