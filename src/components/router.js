import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import layoutHOC from '../components/Layout/index';
import DocumentList from './documentList.js';
import DocumentStamper from '../components/DocumentStamper/index';
import DocumentVerifier from '../components/DocumentVerifier/index';
import NotFoundPage from '../containers/NotFoundPage/Loadable';

function Router(props) {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={DocumentList} />
        <Route exact path="/stamp" render={() => <DocumentStamper authState={props.authState} />} />
        <Route exact path="/verify" render={() => <DocumentVerifier authState={props.authState} />} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

Router.propTypes = {
  authState: PropTypes.string,
};

export default layoutHOC(Router);
