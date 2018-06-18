import React from 'react';
/**
 *
 * Router
 *
 */

// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import layoutHOC from '../components/Layout/index';
import DocumentList from '../components/DocumentList/index.js';
import DocumentStamper from '../components/DocumentStamper/index';
import DocumentVerifier from '../components/DocumentVerifier/index';
import NotFoundPage from '../containers/NotFoundPage/Loadable';
import Certificate from '../components/certificate.js'

function Router(props) {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={DocumentList} />
        <Route exact path="/stamp" render={() => <DocumentStamper authState={props.authState} />} />
        <Route exact path="/verify" render={() => <DocumentVerifier authState={props.authState} />} />
        <Route exact path="/certificate" component={Certificate} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

Router.propTypes = {
  authState: PropTypes.string,
};

export default layoutHOC(Router);
