import React from 'react';
import "regenerator-runtime/runtime";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import LanguageProvider from './containers/LanguageProvider';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './configureStore';
import App from './containers/App/index.js';

import './global-styles';
import Instagram from './utils/authenticatorTheme.js';

const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App  theme={Instagram} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();
