# the api for local lens

### create user 
```javascript
export const createUser = (dispatch) => {
  axios.defaults.headers.common['Authorization'] = '';
  const url = 'https://locallensapp.com/api/create-user/';
  //const url = 'https://httpbin.org/post'
  let deviceUUID = returnUUID();
  axios.post(url, {
    deviceUUID: deviceUUID
  }).then(function (response) {
    const token = response.data.token;
    console.log(response.data);
    AsyncStorage.setItem('user_uuid', response.data.user_uuid);
    AsyncStorage.setItem('username', response.data.username);
    AsyncStorage.setItem('authtoken', token);
    AsyncStorage.setItem('created', response.data.created.toString());
    dispatch({ type: LOGIN_USER_SUCCESS, payload: response.data });
    getPhotosWithAction(dispatch, token, 1);
  }).catch(function (error) {
    console.log(error);
  });
};
```

### get photos  
```javascript
xport const getPhotos = (dispatch, token, page) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      //const lat = 12.11111111111111;
      //const lon = 12.11111111111111111;
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      axios.defaults.headers.common.Authorization = `Token ${token}`;
      const url = `https://locallensapp.com/api/photos/${lat}/${lon}/${page}/`;
      axios.get(url)
       .then(function (response) {

        dispatch({ type: PHOTOS, payload: response.data, p: page });
        dispatch({ type: LOADING_FALSE });
        dispatch({ type: REFRESHING_FALSE });
     })
   .catch(function (error) {
     console.log(error.message);
   });
    },
    (error) => console.log(error.message)
  );
 };


```

### create account
```javascript
export const CreateAccount = (username, email, password, token) => {
    return (dispatch) => {
      dispatch({ type: LOADING });
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      //const url = 'https://httpbin.org/post'
      const url = 'https://locallensapp.com/api/change-username/';
      axios.post(url, {
        isanon: 'False',
        newusername: username,
        newpassword: password,
        newemail: email
      }).then(function (response) {
        const mytoken = response.data.token;
        AsyncStorage.setItem('user_uuid', response.data.user_uuid);
        AsyncStorage.setItem('username', response.data.username);
        AsyncStorage.setItem('authtoken', mytoken);
        AsyncStorage.setItem('created', response.data.created.toString());

        dispatch({ type: LOGIN_USER_SUCCESS, payload: response.data });
        getPhotosWithAction(dispatch, mytoken, 1);
      })
      .catch(function (error) {
        dispatch({ type: UPDATE_ERROR, payload: 'username or email already taken' });
        console.log(error.message);
      });
    }
};
```

### switch between anon and username 
```javascript
export const isanonSwitch = (uuid, token) => {
  return (dispatch) => {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    axios.post('https://locallensapp.com/api/isanonSwitch/', {
      user_uuid: uuid
    })
    .then(function (response) {
      dispatch({ type: ISANON, payload: response.data });
    })
    .catch(function (error) {
      console.log(error);
    });
  };
};
```

### log in
```javascript
export const logInUser = (username, password, token) => {
  return (dispatch) => {
    dispatch({ type: LOADING });
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    const url = 'https://locallensapp.com/api/login/';
    //const url = 'https://httpbin.org/post';
    axios.post(url, {
      username: username,
      password: password
    })
    .then(function (response) {
      const token = response.data.token;
      AsyncStorage.setItem('user_uuid', response.data.user_uuid);
      AsyncStorage.setItem('username', response.data.username);
      AsyncStorage.setItem('authtoken', response.data.token);
      AsyncStorage.setItem('created', response.data.created.toString());
      dispatch({ type: LOGIN_USER_SUCCESS, payload: response.data });
      getPhotosWithAction(dispatch, token, 1);
    })
    .catch(function (error) {
      console.log(error);
      dispatch({ type: UPDATE_LOGIN_ERROR, payload: 'username or password incorrect' });
    });
  };
};
```

### log out
```javascript
export const logOutUser = (token) => {
  return (dispatch) => {
      dispatch({ type: LOADING });
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      const url = 'https://locallensapp.com/api/auth/logout/';
      //const url = 'https://httpbin.org/post'
      axios.post(url).then(function () {
        AsyncStorage.removeItem('user_uuid');
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('authtoken');
        AsyncStorage.removeItem('created');
        createUser(dispatch);
      }).catch(function (error) {
        AsyncStorage.removeItem('user_uuid');
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('authtoken');
        AsyncStorage.removeItem('created');
        createUser(dispatch);
      });
  };
};
```

