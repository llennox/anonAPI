import axios from 'axios';
export const HELLO_WORLD = 'HELLO_WORLD';
export const RESET = 'RESET';
export const PHOTOS = 'PHOTOS';
export const LOADING_FALSE = 'LOADING_FALSE';
export const LOADING = 'LOADING';
export const USER_SEARCH = 'USER_SEARCH';
export const LOADING_SWITCH = 'LOADING_SWITCH';
export const UPDATE_CENTER = 'UPDATE_CENTER';
export const USER_SEARCH_ERROR = 'USER_SEARCH_ERROR';
export const PHOTOS_FOR = 'PHOTOS_FOR';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const OPEN_MODAL = 'OPEN_MODAL';
export const MODAL_POINTER = 'MODAL_POINTER';


export const userSearch = (search) => {
  return (dispatch) => {
    dispatch({type: USER_SEARCH, payload: search});

  }
}

export const changePhoto = (i, photos) => {
  return (dispatch) => {
    dispatch({type: MODAL_POINTER, payload: i})
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

export const closeModal = (photos, i) => {
  return (dispatch) => {
    dispatch({type: UPDATE_CENTER, payload: [photos.objects[i].lat, photos.objects[i].lon] });
    dispatch({type: CLOSE_MODAL})
  }
}


export const photosByNewest = () => {
  return (dispatch) => {
  dispatch({ type: LOADING });
  axios.defaults.headers.common.Authorization = 'Token d28fe2e37bd3adc6dca2cd024b80a30a8782bcfa3bb9e130101973007ad6a921';
  axios.defaults.withCredentials = true;

  //const url = `http://localhost:8000/api/photos-by-newest/`;

  const url = `https://locallensapp.com/api/photos-by-newest/`;
  axios.post(url).then(function (response) {
    console.log(response);
    dispatch({type: USER_SEARCH_ERROR, payload: ''})
    dispatch({ type: PHOTOS, payload: response.data });
    dispatch({type: PHOTOS_FOR, payload: 'everyone'})
    dispatch({ type: LOADING_FALSE })
  });
  }
}

export const photosByUser = (x) => {
  return (dispatch) => {
  dispatch({ type: LOADING });
  axios.defaults.headers.common.Authorization = 'Token d28fe2e37bd3adc6dca2cd024b80a30a8782bcfa3bb9e130101973007ad6a921';
  axios.defaults.withCredentials = true;
  //const url = 'http://httpbin.org/post'

  //const url = `http://localhost:8000/api/photos-by-newest/`;
  const url = `https://locallensapp.com/api/photos-by-newest/`;
  axios.post(url, {
    username: x
  }).then(function (response) {
    console.log(response.data.objects.length);
    if (response.data.objects.length === 0) {
      dispatch({ type: USER_SEARCH_ERROR, payload: 'that user has not posted yet'})
      dispatch({ type: LOADING_FALSE })
    } else {
      dispatch({ type: PHOTOS, payload: response.data });
      dispatch({type: PHOTOS_FOR, payload: x})
      dispatch({ type: USER_SEARCH_ERROR, payload: ''})
    dispatch({ type: LOADING_FALSE })
  }
  });
  }
}
