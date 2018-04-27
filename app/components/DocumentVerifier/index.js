import React from 'react';
/**
*
* VerifyDocument
*
*/

// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Icon, Modal, Spin } from 'antd';
import Stampery from 'stampery';
import axios from 'axios';
import Amplify from 'aws-amplify';
import Dropzone from 'react-dropzone';
import Certificate from '../Certificate/index'
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
const stampery = new Stampery('abad3702-839f-4e60-a8a4-6456a27f0cad');

class VerifyDocument extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasError: false,
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    this.setState({ isLoading: true });

    const file = files[0];
    this.getBufferFromBlobUrl(file.preview).then((buffer) => {
      const hash = stampery.hash(buffer);
      return this.verify(hash);
    }).then(([isVerified, stampList]) => {
      console.log(stampList);
      if (isVerified) {
        Modal.success({
          title: 'El documento se encuentra en la Blockchain.',
          content: (
            <div>
              <p>Hemos encontrado el hash de tu documento en la Blockchain.</p>
              <Certificate {...stampList} />
            </div>
          ),
          width: '90%',
        });
      } else {
        Modal.error({
          title: 'El documento no se encuentra en la Blockchain.',
          content: 'Tenga en cuenta que el proceso de sellado en la Blockchain no es inmediato, necesitaremos un plazo de tiempo para su estampación.',
        });
      }
      this.setState({
        isLoading: false,
      });
    }).catch(() => this.setState({ hasError: true }));
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

  verify(hash) {
    return stampery.getByHash(hash)
      .then((stampList) => {
        const stamp = stampList[0];
        const isVerified = (stamp === undefined) ? false : stampery.prove(stamp.receipts);
        return [isVerified, stampList[0]];
      });
  }

  render() {
    const { isLoading, hasError } = this.state;
    const { authState } = this.props;

    if (isLoading) { return <Spin size="large" />; }
    if (hasError) { return <div>Error...</div>; }

    let dropzoneStyle = { width: '100%', border: 'dashed', height: '70vh' };
    let dropzoneIconStyle = { fontSize: '100px' };
    let dropzoneDivStyle = { margin: '0', position: 'relative', top: '50%', transform: 'translate(0%, -50%)' };
    if (authState !== 'signedIn') {
      dropzoneStyle = { width: '100%', border: 'dashed', height: '25vh' };
      dropzoneIconStyle = { fontSize: '50px' };
      dropzoneDivStyle = { paddingTop: '5%', textAlign: 'center' };
    }

    return (
      <div>
        <Dropzone onDrop={this.onDrop} multiple={false} style={dropzoneStyle}>
          <div style={dropzoneDivStyle}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" style={dropzoneIconStyle} />
            </p>
            <p className="ant-upload-text" style={{ fontSize: '22px', margin: 25 }}>
              Haga clic aquí o arrastre para verificar si el documento se encuentra en Blockchain.
            </p>
          </div>
        </Dropzone>
      </div>
    );
  }
}

VerifyDocument.propTypes = {
  authState: PropTypes.string,
};

export default VerifyDocument;
