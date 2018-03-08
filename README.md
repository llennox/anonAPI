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
### get one photo 
```javascript 
export const grabSinglePhoto = (dispatch, uuid, token) => {
  axios.defaults.headers.common.Authorization = `Token ${token}`;
 const url = `https://locallensapp.com/api/${uuid}`;
 axios.get(url)
 .then(function (response) {
  const x = { x: response.data };
  dispatch({ type: LOADING_FALSE });
  dispatch({ type: REFRESHING_FALSE });
  dispatch({ type: SINGLE_PHOTO, payload: x });
})
.catch(function (error) {
console.log(error.message);
});
};
```

### post comment
```javascript
export const PostComment = (text, token, uuid) => {
   return (dispatch) => {
     axios.defaults.headers.common.Authorization = `Token ${token}`;
   const url = 'https://locallensapp.com/api/comments/';
   axios.post(url, {
     comment: text,
     photouuid: uuid
   }).then(function (response) {
     grabSinglePhoto(dispatch, uuid, token);
   }).catch(function (error) {
     console.log(error.message);
   });
   };
 };
```

### delete photo
```javascript
 export const deletePhoto = (uuid, token) => {
     return (dispatch) => {
       axios.defaults.headers.common.Authorization = `Token ${token}`;
       const url = 'https://locallensapp.com/api/delete-photo/';
       axios.post(url,
         { uuid: uuid
       }).then(function (response) {
         dispatch({ type: DELETE_PHOTO, payload: uuid });
       }).catch(function (error) {
         console.log(error);
       });
     };
};
```

### flag photo 
```javascript
export const flagPhoto = (photouuid, useruuid, token) => {
  return (dispatch) => {
    axios.defaults.headers.common.Authorization = `Token ${token}`;
     const url = 'https://locallensapp.com/api/flag-photo/';
    axios.post(url, {
      photoUUID: photouuid,
      userUUID: useruuid
    }).then(function (response) {
      dispatch({ type: FLAG_PHOTO, payload: photouuid });
    }).catch(function () {
        dispatch({ type: FLAG_PHOTO, payload: photouuid });
    });
  };
};
```

### photos by username
```javascript
export const getPhotosByUser = (poster, token, thepage) => {
  return (dispatch) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //const lat = 12.11111111111111;
        //const lon = 12.11111111111111111;
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        const url = 'https://locallensapp.com/api/user-photos/';
        axios.post(url,  {
          lat: latitude,
          lon: longitude,
          username: poster,
          page: thepage
        })
         .then(function (response) {
          dispatch({ type: USER_PHOTOS, payload: response.data, p: thepage });
          dispatch({ type: LOADING_FALSE });
          dispatch({ type: REFRESHING_FALSE });
          dispatch({ type: ONCE_LOADED_FALSE });
          Actions.PhotoByUserView();
       })
     .catch(function (error) {
       console.log(error.message);
     });
      },
      (error) => console.log(error.message)
    );
  };
};
```

### post photo 
```javascript
export const PostPhoto = (token, uuid, thecaption, themedia) => {

  return (dispatch) => {
   dispatch({ type: REFRESHING });
   dispatch({ type: REF_TEXT, payload: 'uploading photo' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latt = position.coords.latitude;
        const lonn = position.coords.longitude;

    RNFetchBlob.fetch('POST', 'https://locallensapp.com/api/photos/', {
        Authorization: 'Token ' + token,
        'Content-Type': 'multipart/form-data'
      }, [
        { name: 'file',
        filename: 'placeholder.jpg',
        type: 'image/jpg',
        data: RNFetchBlob.wrap(themedia) },
        {
          name: 'lat',
          data: JSON.stringify(
          latt
        ) },
        {
          name: 'lon',
          data: JSON.stringify(
          lonn
        ) },
        {
          name: 'caption',
          data: thecaption
        },
        {
          name: 'isvideo',
          data: 'false'
        }
      ]).then(() => {
        dispatch({ type: REF_TEXT, payload: 'getting photos' });
        getPhotosWithAction(dispatch, token, 1);
      }).catch(() => {
        dispatch({ type: REF_TEXT, payload: 'upload failed, returning photos' });
        getPhotosWithAction(dispatch, token, 1);
      });
    },
    (error) => console.log(error.message)
  );
  };
};
```

### post video 
```javascript
export const PostVideo = (token, uuid, thecaption, themedia) => {
  return (dispatch) => {
  dispatch({ type: REFRESHING });
  dispatch({ type: REF_TEXT, payload: 'uploading video' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latt = position.coords.latitude;
        const lonn = position.coords.longitude;

    RNFetchBlob.fetch('POST', 'https://locallensapp.com/api/photos/', {
        Authorization: 'Token ' + token
        }, [
        { name: 'file',
        filename: 'placeholder.mp4',
        type: 'video/mp4',
        data: RNFetchBlob.wrap(themedia) },
        {
          name: 'lat',
          data: JSON.stringify(
          latt
        ) },
        {
          name: 'lon',
          data: JSON.stringify(
          lonn
        ) },
        {
          name: 'caption',
          data: thecaption
        },
        {
          name: 'isvideo',
          data: 'True'
        }
      ]).then(() => {
        //dispatch({ type: SET_DEFAULT });
        dispatch({ type: REF_TEXT, payload: 'getting photos' });
        getPhotosWithAction(dispatch, token, 1);
      }).catch(() => {
        dispatch({ type: REF_TEXT, payload: 'upload failed, returning photos' });
        getPhotosWithAction(dispatch, token, 1);
      });
    },
    (error) => console.log(error.message)
  );
  };
};
```
