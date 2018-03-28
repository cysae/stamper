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

import PropTypes from 'prop-types';
import Router from 'components/Router/index';
import Amplify, { I18n } from 'aws-amplify';
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
I18n.setLanguage('es');

class App extends React.Component {
  render() {
    const { authState } = this.props;
    if (authState === 'signedIn') {
      return (
        <div>
          <Router />
        </div>
      );
    }
    return null;
  }
}

App.propTypes = {
  authState: PropTypes.string,
};

export default withAuthenticator(App, false, [
  <SignIn />,
  <ConfirmSignIn />,
  <VerifyContact />,
  <SignUp />,
  <ConfirmSignUp />,
  <ForgotPassword />,
]);

