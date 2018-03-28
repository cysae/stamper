import React from 'react';
/**
*
* Header
*
*/

import styled from 'styled-components';
import Amplify, { Auth } from 'aws-amplify';
import { Layout, Button } from 'antd';
import awsExports from '../../aws-exports';
const { Header } = Layout;
Amplify.configure(awsExports);

const Right = styled.div`
  position: absolute;
  right: 16px;
`;

const Greeting = styled.p`
  margin-right: 20px;
  display: inline;
  font-size: 16px;
`;

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
      .then(() => location.reload())
      .catch(() => location.reload());
  }

  render() {
    const { username } = this.state;

    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        <Right>
          <Greeting>Hola, {username}</Greeting>
          <Button type="primary" icon="poweroff" loading={this.isLogoutLoading} onClick={this.signOut}>
            Desconectar
          </Button>
        </Right>
      </Header>
    );
  }
}

Header.propTypes = {

};

export default CustomHeader;
