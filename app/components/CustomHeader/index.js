import React from 'react';
/**
*
* Header
*
*/

import styled from 'styled-components';
import Amplify, { Auth, Storage, API } from 'aws-amplify';
import { Layout, Row, Col, Button, Input, Spin, message } from 'antd';
import awsExports from '../../aws-exports';
const { Header } = Layout;
const Search = Input.Search;
Amplify.configure(awsExports);
Storage.configure({ level: 'private' });

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
      error: false,
      isLoading: true,
      files: [],
    };

    this.signOut = this.signOut.bind(this);
    this.getPrivateDocuments = this.getPrivateDocuments.bind(this);
    this.downloadPrivateDocument = this.downloadPrivateDocument.bind(this);
    this.searchPrivateDocumentsForHash = this.searchPrivateDocumentsForHash.bind(this);
  }

  componentDidMount() {
    const newState = this.state;
    Auth.currentAuthenticatedUser()
      .then((result) => {
        newState.username = result.username;
        newState.isLoggedIn = true;
        return this.getPrivateDocuments();
      })
      .then((files) => {
        this.setState({
          files,
          isLoading: false,
          error: false,
        });
      })
      .catch(() => this.setState({
        error: true,
        username: null,
        isLoggedIn: false,
      }));
  }

  getPrivateDocuments() {
    const state = this.state;
    return API.get('filesCRUD', '/files')
      .then((files) => {
        state.files = files;
        return files;
        /* const stamperyFiles = files.filter((file) => file.stamperyId);
         * const promises = stamperyFiles.map((file) => stampery.getById(file.stamperyId));
         * return Promise.all(promises); */
      })
      .catch((err) => console.error(err));
    /* .then((stamps) => {
     *   console.log(state.files);
     *   console.log(stamps);
     * }); */
  }

  downloadPrivateDocument(fileId) {
    Storage.get(fileId)
      .then((fileUrl) => {
        window.location = fileUrl;
        message.success('Tu fichero esta descargando.');
      })
      .catch((error) => {
        message.error('Ha occurido un error.')
      });
  }

  signOut() {
    this.setState({ isLogoutLoading: true });
    Auth.signOut()
      .then(() => location.reload())
      .catch(() => location.reload());
  }

  searchPrivateDocumentsForHash(hash) {
    for (const file of this.state.files) {
      if (file.hash === hash) {
        this.downloadPrivateDocument(file.fileId);
        return;
      }
    };
    message.error('No hemos encontrado ningun fichero con este hash.');
  }

  render() {
    const { username, isLoading, error } = this.state;

    if (error) {
      return <div>Error</div>;
    }
    if (isLoading) {
      return <Spin size="large" />;
    }

    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        <HeaderRow>
          <Col span={12}>
            <Search
              placeholder="Buscar con tu hash aqui."
              onSearch={this.searchPrivateDocumentsForHash}
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
