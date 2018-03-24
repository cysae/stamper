import React from 'react';
/**
*
* DocumentList
*
*/

// import styled from 'styled-components';
import ReactTable from 'react-table';
import Amplify, { Storage, API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import Stampery from 'stampery';
import Promise from 'bluebird';
import 'react-table/react-table.css';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
const stampery = new Stampery('abad3702-839f-4e60-a8a4-6456a27f0cad');
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
        console.log(files);
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
      Header: 'Name',
      accessor: 'name',
    }, {
      Header: 'Stamped on',
      accessor: 'stampedOn',
      Cell: (props) => <span className="number">{props.value}</span>,
    }, {
      Header: 'Hash',
      accessor: 'hash',
    }, {
      Header: 'Actions',
      accessor: 'fileId',
      Cell: (props) => <span>
        <button onClick={() => this.deletePrivateDocument(props.value)}>
          Delete
        </button>
        <button onClick={() => this.downloadPrivateDocument(props.value)}>
          Download
        </button>
      </span>,
    }];

    if (error) {
      return <div>Error</div>;
    }
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <ReactTable className="-striped" data={files} columns={columns} />
      </div>
    );
  }
}

DocumentList.propTypes = {

};

export default withAuthenticator(DocumentList, { withGreetings: true });
