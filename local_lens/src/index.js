import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import helloReducer from './reducers'
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk';

const store = createStore(
  helloReducer,
  applyMiddleware(thunk)
);// this is store

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </Provider>,
	document.getElementById('root')
);
registerServiceWorker();
