import React from 'react';
import "regenerator-runtime/runtime";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './configureStore';
import App from './app'
import './global-styles';
import Instagram from './utils/authenticatorTheme.js';
import { Analytics } from 'aws-amplify'
// Google Analytics
import ReactGA from 'react-ga';
ReactGA.initialize('UA-122816864-1');
ReactGA.pageview(window.location.pathname + window.location.search);
// Pinpoint
Analytics.disable()

const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App theme={Instagram} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();
