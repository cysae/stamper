import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Icon, Spin, Input} from 'antd';
import Stampery from 'stampery';
import axios from 'axios';
import Amplify from 'aws-amplify';
import Dropzone from 'react-dropzone';
import awsExports from '../aws-exports';
import { validate, displayValidationModal } from '../utils/validate.js'
Amplify.configure(awsExports);
const stampery = new Stampery('abad3702-839f-4e60-a8a4-6456a27f0cad');

const HashInput = styled(Input.Search)`
  margin-top: 20px !important;
`;

class VerifyDocument extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasError: false,
    };
    this.onDrop = this.onDrop.bind(this);
    this.verifyHash = this.verifyHash.bind(this);
  }

  onDrop(files) {
    this.setState({ isLoading: true });

    const file = files[0];
    this.getBufferFromBlobUrl(file.preview).then((buffer) => {
      const hash = stampery.hash(buffer);
      return validate(hash);
    }).then(([isVerified, stampList]) => {
      displayValidationModal(isVerified, stampList);
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

  verifyHash(hash) {
    validate(hash).then(([isVerified, stampList]) => {
      displayValidationModal(isVerified, stampList);
      this.setState({
        isLoading: false,
      });
    });
  }

  render() {
    const { isLoading, hasError } = this.state;
    const { authState } = this.props;

    if (isLoading) { return <Spin size="large" />; }
    if (hasError) { return <div>Error...</div>; }

    let dropzoneStyle = { width: '100%', border: 'dashed', height: '60vh' };
    let dropzoneIconStyle = { fontSize: '100px' };
    let dropzoneDivStyle = { margin: '0', position: 'relative', top: '50%', transform: 'translate(0%, -50%)' };
    if (authState !== 'signedIn') {
      dropzoneStyle = { width: '100%', border: 'dashed', height: '22vh' };
      dropzoneIconStyle = { fontSize: '50px' };
      dropzoneDivStyle = { paddingTop: '2%', textAlign: 'center' };
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
       <HashInput placeholder="Verificar con hash" enterButton="Verificar Hash" size="large" onSearch={this.verifyHash} />
      </div>
    );
  }
}

VerifyDocument.propTypes = {
  authState: PropTypes.string,
};

export default VerifyDocument;
