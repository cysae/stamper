import React from 'react';
/**
*
* DocumentStamper
*
*/

/* import styled from 'styled-components'; */
import PropTypes from 'prop-types';
import { Icon, message, Modal, Spin } from 'antd';
import Promise from 'bluebird';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import Stampery from 'stampery';
import Amplify, { Storage, API } from 'aws-amplify';
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
    if (this.props.disabled) {
      message.error('No hemos estampado tu documento. Tienes que acceptar la Política de Privacidad');
    } else {
      this.setState({ isLoading: true });

      // if logged in save stamp doc AND save to S3/ DynamoDB
      // if NOT logged in only stamp
      let promises = [];
      if (this.props.authState === 'signedIn') {
        console.log('save and stamp')
        promises = files.map((file) => this.stampUploadAndSaveFile(file));
      } else {
        promises = files.map((file) => this.notSignedInStampFile(file));
      }

      Promise.all(promises)
        .then((droppedFiles) => {
          const stampedDocumentList = droppedFiles.map((file) => <li key={file.fileId}>{file.name}</li>);
          Modal.success({
            title: 'Hemos sellado tu/s documento/s:',
            content: (
              <div>
                <ul>
                  {stampedDocumentList}
                </ul>
                <p>El proceso de sellado en la Blockchain no es inmediato, necesitaremos un plazo de tiempo para su estampación.</p>
              </div>
            ),
          });
          this.setState({
            isLoading: false,
            files: droppedFiles,
          });
        })
        .catch((err) => {
          console.log(err);
          message.error('Algo ha ido mal.');
          this.setState({ hasError: true });
        });
    }
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
        droppedFile.stamperyId = stamp.id;
        droppedFile.hash = stamp.hash;
        droppedFile.stampedOn = stamp.time;
        return droppedFile;
      })
      .catch((err) => {
        if (err.statusCode === 409) {
          return stampery.getByHash(droppedFile.binaryHash)
            .then((stampList) => {
              const stamp = stampList[0];
              droppedFile.stamperyId = stamp.id;
              droppedFile.hash = stamp.hash;
              droppedFile.stampedOn = stamp.time;
              this.uploadFileToS3(droppedFile);
            })
            .then(() => this.saveFileToDynamoDB(droppedFile))
            .then(() => droppedFile);
        }
        throw err;
      });
  }

  notSignedInStampFile(file) {
    const droppedFile = file;
    return this.getBufferFromBlobUrl(file.preview).then((buffer) => {
      droppedFile.binaryHash = stampery.hash(buffer);
      return stampery.stamp(droppedFile.binaryHash)
        .then(() => droppedFile)
        .catch((err) => {
          if (err.statusCode === 409) {
            return droppedFile;
          }
          throw err;
        });
    });
  }

  uploadFileToS3(file) {
    return Storage.put(file.uuid, file, {
      contentDisposition: `attachment; filename=${encodeURI(file.name)}`,
    });
  }

  render() {
    const { isLoading, hasError } = this.state;
    const { authState } = this.props;

    if (hasError) { return <div>Error...</div>; }
    if (isLoading) { return <Spin size="large" />; }

    let dropboxStyle = { width: '100%', border: 'dashed', height: '70vh' };
    let dropzoneIconStyle = { fontSize: '100px' };
    let dropzoneDivStyle = { margin: '0', position: 'relative', top: '50%', transform: 'translate(0%, -50%)' };
    if (authState !== 'signedIn') {
      dropboxStyle = { width: '100%', border: 'dashed', height: '25vh', marginBottom: '20px' };
      dropzoneIconStyle = { fontSize: '50px' };
      dropzoneDivStyle = { paddingTop: '5%', textAlign: 'center' };
    }

    return (
      <div>
        <Dropzone onDrop={this.onDrop} style={dropboxStyle}>
          <div style={dropzoneDivStyle}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" style={dropzoneIconStyle} />
            </p>
            <p className="ant-upload-text" style={{ fontSize: 22, margin: 25 }}>
              Haga clic aquí o arrastre para estampar un documento en Blockchain.
            </p>
          </div>
        </Dropzone>
      </div>
    );
  }
}

DocumentStamper.propTypes = {
  authState: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DocumentStamper;
