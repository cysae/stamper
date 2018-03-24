import React from 'react';
/**
*
* DocumentStamper
*
*/

// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import Promise from 'bluebird';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import Stampery from 'stampery';
import Amplify, { Storage, API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import messages from './messages';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
Storage.configure({
  level: 'private',
  contentDisposition: 'attachment',
});
const stampery = new Stampery('abad3702-839f-4e60-a8a4-6456a27f0cad');

class DocumentStamper extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      isLoading: false,
      hasError: false,
    };

    this.onDrop = this.onDrop.bind(this);
    this.stampFile = this.stampFile.bind(this);
    this.stampUploadAndSaveFile = this.stampUploadAndSaveFile.bind(this);
  }

  onDrop(files) {
    this.setState({ isLoading: true });

    const promises = files.map((file) => this.stampUploadAndSaveFile(file));

    Promise.all(promises)
      .then((droppedFiles) => {
        this.setState({
          isLoading: false,
          files: droppedFiles,
        });
      })
      .catch((err) => {
        this.setState({ hasError: true })
      });
  }

  getBufferFromBlobUrl(url) {
    return axios({
      method: 'get',
      url,
      responseType: 'blob',
    }).then((response) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(response.data);

      return new Promise((resolve, reject) => {
        reader.onloadend = () => { resolve(new Buffer(reader.result).toString('hex')); };
        reader.onerror = () => { reject('file loader error'); };
      });
    });
  }

  stampUploadAndSaveFile(file) {
    const droppedFile = file;
    droppedFile.uuid = uuidv4();
    return this.stampFile(file)
      .then((stampedFile) => this.uploadFileToS3(stampedFile))
      .then(() => this.saveFileToDynamoDB(droppedFile))
      .then(() => droppedFile);
  }

  saveFileToDynamoDB(file) {
    const newFile = {
      name: file.name,
      hash: file.hash,
      fileId: file.uuid,
      stampedOn: file.stampedOn,
      stamperyId: file.stamperyId,
    };
    return API.post('filesCRUD', '/files', { body: newFile });
  }

  stampFile(file) {
    const droppedFile = file;
    return this.getBufferFromBlobUrl(file.preview).then((buffer) => {
      droppedFile.binaryHash = stampery.hash(buffer);
      return stampery.stamp(droppedFile.binaryHash);
    })
      .then((stamp) => {
        droppedFile.stamperyid = stamp.id;
        droppedFile.hash = stamp.hash;
        droppedFile.stampedon = stamp.time;
        return droppedFile;
      })
      .catch((err) => {
        if (err.statusCode === 409) {
          return stampery.getByHash(droppedFile.binaryHash)
            .then((stampList) => {
              const stamp = stampList[0];
              droppedFile.stamperyid = stamp.id;
              droppedFile.hash = stamp.hash;
              droppedFile.stampedon = stamp.time;
              console.log(droppedFile);
              this.uploadFileToS3(droppedFile);
            })
            .then(() => this.saveFileToDynamoDB(droppedFile))
            .then(() => droppedFile);
        }
        throw err;
      });
  }

  uploadFileToS3(file) {
    return Storage.put(file.uuid, file, {
      contentDisposition: `attachment; filename=${file.name}`,
    });
  }

  render() {
    const { isLoading, hasError, files } = this.state;

    if (hasError) { return <div>Error...</div>; }
    if (isLoading) { return <div>isLoading...</div>; }

    const stampedDocumentList = files.map((file) => <li key={file.fileId}>{file.name}</li>);

    return (
      <div>
        <Dropzone onDrop={this.onDrop}>
          <FormattedMessage {...messages.header} />
        </Dropzone>
        <ul>
          {stampedDocumentList}
        </ul>
      </div>
    );
  }
}

DocumentStamper.propTypes = {

};

export default withAuthenticator(DocumentStamper, { withGreeting: true });
