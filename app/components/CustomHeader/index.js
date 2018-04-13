import React from 'react';
/**
*
* Header
*
*/

import styled from 'styled-components';
import Amplify, { Auth } from 'aws-amplify';
import { Layout, Row, Col, Button, Input } from 'antd';
import awsExports from '../../aws-exports';
const { Header } = Layout;
const Search = Input.Search;
Amplify.configure(awsExports);

const HeaderRow = styled(Row)`
  padding: 0 16px 0 16px;
`;
const RightCol = styled(Col)`
  text-align: right;
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
        <HeaderRow>
          <Col span={12}>
            <Search
              placeholder="Buscar con tu hash aqui."
              onSearch={(value) => console.log(value)}
              enterButton
            />
          </Col>
          <RightCol span={12}>
            <Greeting>Hola, {username}</Greeting>
            <Button type="primary" icon="poweroff" loading={this.isLogoutLoading} onClick={this.signOut}>
              Desconectar
            </Button>
          </RightCol>
        </HeaderRow>
      </Header>
    );
  }
}

Header.propTypes = {

};

export default CustomHeader;
