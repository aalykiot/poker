import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './redux/reducers';
import SocketConnection from './util/socket';
import Lobby from './modules/lobby/container';
import './stylesheets/index.css';
import './stylesheets/app.css';
import './stylesheets/cards.css';

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
// const store = createStore(reducers);

SocketConnection.open('http://localhost:8080', store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
