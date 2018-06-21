import axios from 'axios';
export const HELLO_WORLD = 'HELLO_WORLD';
export const RESET = 'RESET';
export const PHOTOS = 'PHOTOS';
export const LOADING_FALSE = 'LOADING_FALSE';
export const LOADING = 'LOADING';
export const USER_SEARCH = 'USER_SEARCH';
export const LOADING_SWITCH = 'LOADING_SWITCH';
export const UPDATE_CENTER = 'UPDATE_CENTER';


export const userSearch = (search) => {
  return (dispatch) => {
    console.log('here', search);
    dispatch({type: USER_SEARCH, payload: search});

  }
}

export const loadingSwitch = (x) => {
  return (dispatch) => {
    dispatch({type: LOADING_SWITCH, payload: x});
  }
}

export const updateCenter = (center, zoom) => {
  return (dispatch) => {
    dispatch({type: UPDATE_CENTER, payload: center });
  }
}

export const helloWorld = () => {
  return {
    type: HELLO_WORLD
  }
}

export const reset = () => {
  return {
    type: RESET
  }
}

export const photosByNewest = (thePage) => {
  return (dispatch) => {
  dispatch({ type: LOADING });
  axios.defaults.headers.common['Authorization'] = 'd73fb67a67988f204fdaf0524247dc38083e750e267b620e9660c5b215e8fe44';
  axios.defaults.withCredentials = true;
  const url = `http://localhost:8000/api/photos-by-newest/`;
  axios.post(url).then(function (response) {
    console.log(response);
    dispatch({ type: PHOTOS, payload: response.data });
    dispatch({ type: LOADING_FALSE })
  });
  }
}
