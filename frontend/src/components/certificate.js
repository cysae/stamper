import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';
import axios from 'axios'

const backend = axios.create({
  baseURL: 'https://nnvrqej24h.execute-api.eu-west-1.amazonaws.com/dev',
})

const Container = styled.div`
  background-color: #e9e9e9;
  padding: 10px;
  border-radius: 14px;
`;

class Certificate extends Component {
  state = {
    isLoading: true,
  }

  constructor(props) {
    super(props)
    console.log('test')
  }

  componentDidMount() {
    const { id } = this.props
    this.setCertificateIframe(id)
    this.setState({ isLoading: false })
  }

  download(event) {
    const blobUrl = document.getElementsByTagName("iframe")[0].src

    var file_path = blobUrl;
    var a = document.createElement('A');
    a.href = file_path;
    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async setCertificateIframe(id) {
    const res = await backend.get('certificate.pdf', {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/pdf'
      },
      params: { id }
    })
    const buffer = Buffer.from(res.data)
    const base64Str = buffer.toString('base64')
    document.getElementById("certificate").data = `data:application/pdf;base64,${base64Str}`
  }

  render() {
    const { isLoading } = this.state;

    if(isLoading) return "Loading..."

    return (
      <Container>
        <object id="certificate" type="application/pdf">
         Certificate.pdf
        </object>

        <Button style={{width: '100%'}} type="primary" onClick={this.download}>Descargar</Button>
      </Container>
    )
  }
}

Certificate.propTypes = {
  hash: PropTypes.string,
  time: PropTypes.string,
};

export default Certificate;
