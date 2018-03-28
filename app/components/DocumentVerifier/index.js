import React from 'react';
/**
*
* VerifyDocument
*
*/

// import styled from 'styled-components';
import { Icon, Modal, Spin } from 'antd';
import Stampery from 'stampery';
import axios from 'axios';
import Amplify from 'aws-amplify';
import Dropzone from 'react-dropzone';
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
    }).then((isVerified) => {
      if (isVerified) {
        Modal.success({
          title: 'El Documento es Original!',
          content: 'Hemos encontrado el hash te tu documento en la Blockchain.',
        });
      } else {
        Modal.error({
          title: 'El Documento es Falso!',
          content: 'Aun no hemos encontrado el hash te tu documento en la Blockchain. Si acabas de subir un fichero necesitamos hasta algunas ahora para anclar el hash en la blockchain.',
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
        return isVerified;
      });
  }

  render() {
    const { isLoading, hasError } = this.state;

    if (isLoading) { return <Spin size="large" />; }
    if (hasError) { return <div>Error...</div>; }

    return (
      <div>
        <Dropzone onDrop={this.onDrop} multiple={false} style={{ width: '100%', border: 'dashed', height: '70vh' }}>
          <div style={{ margin: '0', position: 'relative', top: '50%', transform: 'translate(0%, -50%)' }}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" style={{ fontSize: '100px' }} />
            </p>
            <p className="ant-upload-text" style={{ fontSize: '30px' }}>Haga clic o arrastre aquí para verificar un documento.</p>
          </div>
        </Dropzone>
      </div>
    );
  }
}

VerifyDocument.propTypes = {

};

export default VerifyDocument;
