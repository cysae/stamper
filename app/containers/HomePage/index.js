import React from 'react';
/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import { FormattedMessage } from 'react-intl';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import messages from './messages';
import DocumentStamper from '../../components/DocumentStamper/index';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <DocumentStamper />
      </div>
    );
  }
}

export default withAuthenticator(HomePage, { withGreeting: true });
