import React from 'react';
/**
*
* VerifyDocument
*
*/

// import styled from 'styled-components';
import Stampery from 'stampery';
import axios from 'axios';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
const stampery = new Stampery('abad3702-839f-4e60-a8a4-6456a27f0cad');

class VerifyDocument extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      isVerified: undefined,
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
    }).then((isVerified) => this.setState({
      isVerified,
      isLoading: false,
    })).catch(() => this.setState({ hasError: true }));
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
        console.log(stamp);
        const isVerified = (stamp === undefined) ? false : stampery.prove(stamp.receipts);
        return isVerified;
      });
  }

  render() {
    const { isLoading, hasError, isVerified } = this.state;

    if (isLoading) { return <div>Loading...</div>; }
    if (hasError) { return <div>Error...</div>; }

    if (isVerified !== undefined) {
      if (isVerified) {
        return <h1>Verified</h1>;
      }
      if (!isVerified) {
        return <h1>Falsified</h1>;
      }
    }

    return (
      <div>
        <Dropzone onDrop={this.onDrop} multiple={false}>
          <FormattedMessage {...messages.header} />
        </Dropzone>
        <button onClick={this.verify}>Verify</button>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

VerifyDocument.propTypes = {

};

export default withAuthenticator(VerifyDocument);
