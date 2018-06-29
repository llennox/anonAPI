import axios from 'axios';
import * as Fingerprint2 from 'fingerprintjs2';
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
export const  AUTH_MODAL_CHANGE_STATE = 'AUTH_MODAL_CHANGE_STATE';


let BASE_URL = process.env.BASE_URL

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://locallensapp.com'
} else {
  BASE_URL = 'http://localhost:8000'
}


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

export const authModalChangeState = (string) => {
  return (dispatch) => {
    dispath({type: AUTH_MODAL_CHANGE_STATE, payload: string })
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

export const liloModalChangeState = (io) => {
  return (dispatch) => {
    dispatch({type: CHANGE_STATE_LILO_MODAL, payload: io})
  }
}


export const closeModal = (photos, i) => {
  return (dispatch) => {
    dispatch({type: UPDATE_CENTER, payload: [photos.objects[i].lat, photos.objects[i].lon] });
    dispatch({type: CLOSE_MODAL})
  }
}

export const getAuthToken = () => {
  return (dispatch) => {
  Fingerprint2().get((result) => {
    const url = `${BASE_URL}/api/create-user/`;
    //const url = 'https://httpbin.org/post'
    const deviceUUID = result
    console.log(deviceUUID)
    axios.post(url, {
      deviceUUID: deviceUUID
    }).then(function (response) {
      const token = response.data.token;
      console.log(response.data);
      localStorage.setItem('user_uuid', response.data.user_uuid);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('token', token);
      localStorage.setItem('created', response.data.created.toString());

      console.log(token);
      //axios.defaults.headers.common.Authorization = 'Token d28fe2e37bd3adc6dca2cd024b80a30a8782bcfa3bb9e130101973007ad6a921';
      axios.defaults.headers.common.Authorization = `Token ${token}`;
      axios.defaults.withCredentials = true;
      const url = `${BASE_URL}/api/photos-by-newest/`;
      //const url = `https://locallensapp.com/api/photos-by-newest/`;
      axios.post(url).then(function (response) {
        console.log(response);
        dispatch({type: USER_SEARCH_ERROR, payload: ''})
        dispatch({ type: PHOTOS, payload: response.data });
        dispatch({type: PHOTOS_FOR, payload: 'everyone'})
        dispatch({ type: LOADING_FALSE })
      });
    }).catch(function (error) {
      console.log(error);
    });
   })
 }
}


export const photosByNewest = () => {
  return (dispatch) => {
  dispatch({ type: LOADING });
  const token = localStorage.getItem('token');
  console.log(token);
  //axios.defaults.headers.common.Authorization = 'Token d28fe2e37bd3adc6dca2cd024b80a30a8782bcfa3bb9e130101973007ad6a921';
  axios.defaults.headers.common.Authorization = `Token ${token}`;
  axios.defaults.withCredentials = true;
  const url = `${BASE_URL}/api/photos-by-newest/`;
  //const url = `https://locallensapp.com/api/photos-by-newest/`;
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
  const token = localStorage.getItem('token')
  //axios.defaults.headers.common.Authorization = 'Token d28fe2e37bd3adc6dca2cd024b80a30a8782bcfa3bb9e130101973007ad6a921';
  axios.defaults.headers.common.Authorization = `Token ${token}`;
  axios.defaults.withCredentials = true;
  const url = `${BASE_URL}/api/photos-by-newest/`;
  //const url = `https://locallensapp.com/api/photos-by-newest/`;
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
