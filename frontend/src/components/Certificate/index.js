import React, { Component } from 'react';
import { Document } from '@react-pdf/dom'
import { Page, Text, Image, Link, View, StyleSheet } from '@react-pdf/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';
import axios from 'axios'

const backend = axios.create({
  baseURL: 'https://zsua3vner4.execute-api.eu-west-1.amazonaws.com/dev',
  tiemout: 1000
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
    console.log('test')
    backend.get(`/certificate?id=5b2a612680e0190004bcccc8`)
      .then(res => console.log(res))
      .catch(err => console.log(err))

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

  render() {
    const { time, hash, receipts, id} = this.props;
    const { isLoading, pdfBase64 } = this.state;

    if(isLoading) return "Loading..."

    return (
      <Container>
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
