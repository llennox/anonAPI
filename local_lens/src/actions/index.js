import axios from 'axios';
export const HELLO_WORLD = 'HELLO_WORLD'
export const RESET = 'RESET'
export const PHOTOS = 'PHOTOS'
export const LOADING_FALSE = 'LOADING_FALSE'
export const LOADING = 'LOADING'


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
  axios.defaults.withCredentials = true;
  const url = `https://locallensapp.com/api/photos-by-newest/`;
  axios.post(url, {
    page: thePage
  }).then(function (response) {
    console.log(response);
    dispatch({ type: PHOTOS, payload: response.data });
    dispatch({ type: LOADING_FALSE })
  });
  }
}
