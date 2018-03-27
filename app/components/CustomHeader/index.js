import React from 'react';
/**
*
* Header
*
*/

// import styled from 'styled-components';

import { Auth } from 'aws-amplify';
import { Layout, Button } from 'antd';
const { Header } = Layout;

class CustomHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      isLogoutLoading: false,
      username: null,
      isLoggedIn: false,
    };

    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then((result) => this.setState({
        username: result.username,
        isLoggedIn: true,
      }))
      .catch(() => this.setState({
        username: null,
        isLoggedIn: false,
      }));
  }

  signOut() {
    this.setState({ isLogoutLoading: true });
    Auth.signOut()
      .then(() => this.setState({ isLogoutLoading: false }))
      .catch((err) => console.error(err)); 
  }

  render() {
    const { username } = this.state;

    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        Hello {username}
        <Button type="primary" icon="poweroff" loading={this.isLogoutLoading} onClick={this.signOut}>
          Sign Out
        </Button>
      </Header>
    );
  }
}

Header.propTypes = {

};

export default CustomHeader;
