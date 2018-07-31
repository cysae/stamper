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
    data: null,
    isLoading: true,
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { id } = this.props
    this.setCertificate(id)
  }

  async setCertificate(id) {
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
    this.setState({
      data: `data:application/pdf;base64,${base64Str}`,
      isLoading: false,
    })
  }

  render() {
    const { isLoading, data } = this.state;

    if(isLoading) return "Loading..."

    return (
      <Container>
        <object id="certificate" type="application/pdf" data={data}>
         Certificate.pdf
        </object>

        <a download="certificate.pdf" href={data} title="Download certificate">
          <Button style={{width: '100%'}} type="primary">Descargar</Button>
        </a>
      </Container>
    )
  }
}

Certificate.propTypes = {
  hash: PropTypes.string,
  time: PropTypes.string,
};

export default Certificate;
