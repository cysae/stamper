import React from 'react';
/**
 *
 * Router
 *
 */

// import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import layoutHOC from '../../components/Layout/index';
import DocumentList from '../../components/DocumentList/Loadable';
import DocumentStamper from '../../components/DocumentStamper/index';
import DocumentVerifier from '../../components/DocumentVerifier/index';
import NotFoundPage from '../../containers/NotFoundPage/Loadable';
import NormalLoginForm from '../../containers/HomePage/index';


function Router() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={DocumentList} />
        <Route exact path="/stamp" component={DocumentStamper} />
        <Route exact path="/verify" component={DocumentVerifier} />
        <Route exact path="/test" component={NormalLoginForm} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

Router.propTypes = {

};

export default layoutHOC(Router);
