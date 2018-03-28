import React from 'react';
/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import { Switch, Route } from 'react-router-dom';
import DocumentList from 'components/DocumentList/Loadable';
import DocumentStamper from 'components/DocumentStamper/index';
import DocumentVerifier from 'components/DocumentVerifier/index';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import NormalLoginForm from 'containers/HomePage/index';
import layoutHOC from 'components/Layout/index';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

function App() {
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

export default withAuthenticator(layoutHOC(App));
