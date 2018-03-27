import React from 'react';
/**
*
* DocumentList
*
*/

// import styled from 'styled-components';
import ReactTable from 'react-table';
import { Table, Icon, Divider } from 'antd';
import Amplify, { Storage, API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import 'react-table/react-table.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
Storage.configure({ level: 'private' });



class DocumentList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      isLoading: true,
      error: false,
    };

    this.getPrivateDocuments = this.getPrivateDocuments.bind(this);
    this.deletePrivateDocument = this.deletePrivateDocument.bind(this);
  }

  componentDidMount() {
    this.getPrivateDocuments()
      .then((files) => {
        this.setState({
          files,
          isLoading: false,
          error: false,
        });
      }).catch(() => this.setState({ error: true }));
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

  deletePrivateDocument(fileId) {
    this.setState({ isLoading: true });

    return Storage.remove(fileId).then(() => API.del('filesCRUD', `/files/object/${fileId}`))
      .then(() => {
        const files = this.state.files.filter((file) => file.fileId !== fileId);

        this.setState({
          files,
          isLoading: false,
        });
      });
  }

  downloadPrivateDocument(fileId) {
    Storage.get(fileId)
      .then((fileUrl) => window.location = fileUrl)
      .catch((err) => console.log(err));
  }

  render() {
    const { isLoading, error, files } = this.state;

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="#">{text}</a>,
    }, {
      title: 'Stamped on',
      dataIndex: 'stampedOn',
      key: 'stampedOn',
    }, {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
    }, {
      title: 'Action',
      key: 'action',
      render: (file) => (
        <span>
          <button onClick={() => this.downloadPrivateDocument(file.fileId)}>Download</button>
          <Divider type="vertical" />
          <button onClick={() => this.deletePrivateDocument(file.fileId)}>Delete</button>
        </span>
      ),
    }];

    if (error) {
      return <div>Error</div>;
    }
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <Table columns={columns} dataSource={files} />
        {/* <ReactTable className="-striped" data={files} columns={columns} /> */}
      </div>
    );
  }
}

DocumentList.propTypes = {

};

export default withAuthenticator(DocumentList);
