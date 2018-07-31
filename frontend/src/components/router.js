import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import layoutHOC from '../components/Layout/index';
import DocumentList from './documentList.js';
import DocumentStamper from '../components/DocumentStamper/index';
import Verifier from '../components/verifier'
import NotFoundPage from '../containers/NotFoundPage/Loadable';
import Certificate from '../components/certificate.js'

function Router(props) {
  return (
    <div>
      <Certificate id="5b2a612680e0190004bcccc8" />
        <Switch>
          <Route exact path="/" component={DocumentList} />
          <Route exact path="/stamp" render={() => <DocumentStamper authState={props.authState} />} />
          <Route exact path="/verify" render={() => <Verifier authState={props.authState} />} />
          <Route component={NotFoundPage} />
        </Switch>
    </div>
  );
}

Router.propTypes = {
  authState: PropTypes.string,
};

export default layoutHOC(Router);
