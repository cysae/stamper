import React, { Component } from 'react';
import { Document } from '@react-pdf/dom'
import { Page, Text, Image, Link, View, StyleSheet } from '@react-pdf/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Row, Col } from 'antd';

const Wrapper = styled.div`
  display: flex;

  iframe {
  flex: 1;
  height: 80vh;
  }
`

const Container = styled.div`
  background-color: #e9e9e9;
  padding: 10px;
  border-radius: 14px;
`;
const StyledRow = styled(Row)`
  text-align: left;
`;
const LeftCol = styled(Col)`
  font-size: 16px;
`;
const RightCol = styled(Col)`
  font-size: 16px;
`;

// Create styles
const styles = StyleSheet.create({
  container: {
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  col: {
    flexGrowth: 1,
    padding: 10,
  },
  image: {
    width: '200px',
    height: '150px',
    padding: 10
  },
  xs: {
    fontSize: 8,
  },
  s: {
    fontSize: 12
  },
  marginTop: {
    marginTop: 50
  }
});


function displayReceipts(receipts) {
  const output = [];

  if (typeof receipts.btc === 'object') {
    output.push(
      <div key="btc">
        <StyledRow justify="start">
          <LeftCol span={4}>
            Bitcoin Receipt:
          </LeftCol>
          <RightCol span={20}>
            <pre>
              {JSON.stringify(receipts.btc, null, 4)}
            </pre>
          </RightCol>
        </StyledRow>
        <StyledRow justify="start">
          <LeftCol span={4}>
            Bitcoin Dirección:
          </LeftCol>
          <RightCol span={20}>
            <a target="blank_" href={`https://www.blocktrail.com/BTC/tx/${receipts.btc.anchors[0].sourceId}`}>
              {receipts.btc.anchors[0].sourceId}
            </a>
          </RightCol>
        </StyledRow>
      </div>
    );
  }

  if (typeof receipts.eth === 'object') {
    output.push(
      <div key="eth">
        <StyledRow justify="start">
          <LeftCol span={4}>
            Ethereum Recibo:
          </LeftCol>
          <RightCol span={20}>
            <pre>
              {JSON.stringify(receipts.eth, null, 4)}
            </pre>
          </RightCol>
        </StyledRow>
        <StyledRow justify="start">
          <LeftCol span={4}>
            Ethereum Dirección:
          </LeftCol>
          <RightCol span={20}>
            <a target="blank_" href={`https://etherscan.io/tx/${receipts.eth.anchors[0].sourceId}`}>
            {receipts.eth.anchors[0].sourceId}
          </a>
        </RightCol>
      </StyledRow>
      </div>
    );
  }

  return output;
}

function getReceipts(receipts) {
  const output = []
  let receipt = {}
  if (typeof receipts.btc === 'object') {
    receipt = {
      blockchain: 'Bitcoin',
      address: receipts.btc.anchors[0].sourceId,
      addressUrl: `https://www.blocktrail.com/BTC/tx/${receipts.btc.anchors[0].sourceId}`,
      receipt: JSON.stringify(receipts.btc, null, 4),
    }
    output.push(getReceipt(receipt))
  }

  if (typeof receipts.eth === 'object') {
    receipt = {
      blockchain: 'Ethereum',
      address: receipts.eth.anchors[0].sourceId,
      addressUrl: `https://etherscan.io/tx/${receipts.eth.anchors[0].sourceId}`,
      receipt: JSON.stringify(receipts.eth, null, 4),
    }
    output.push(getReceipt(receipt))
  }
  return output
}


function getReceipt(props) {
  const { blockchain, receipt, address, addressUrl } = props
  return (
    <Page key={blockchain} size="A4">
      <View style={styles.row}>
        <View style={styles.col}>
          <Text>
            {blockchain} recibo:
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.xs}>
            {blockchain} dirección: <Link src={addressUrl}>{address}</Link>
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.xs}>
            {receipt}
          </Text>
        </View>
      </View>
    </Page>
  )
}

function getShortReceipts(receipts) {
  const output = []
  let receipt = {}
  if (typeof receipts.btc === 'object') {
    receipt = {
      blockchain: 'Bitcoin',
      address: receipts.btc.anchors[0].sourceId,
      addressUrl: `https://www.blocktrail.com/BTC/tx/${receipts.btc.anchors[0].sourceId}`,
      merkleRoot: receipts.btc.merkleRoot,
    }
    output.push(getShortReceipt(receipt))
  }

  if (typeof receipts.eth === 'object') {
    receipt = {
      blockchain: 'Ethereum',
      address: receipts.eth.anchors[0].sourceId,
      addressUrl: `https://etherscan.io/tx/${receipts.eth.anchors[0].sourceId}`,
      merkleRoot: receipts.eth.merkleRoot,
    }
    output.push(getShortReceipt(receipt))
  }

  return output
}

function getShortReceipt(props) {
  const { blockchain, merkleRoot, address, addressUrl } = props
  return (
    <View style={styles.marginTop}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text>
            {blockchain} recibo:
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.xs}>
            Merkle root: {merkleRoot}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.xs}>
            Dirección: <Link src={addressUrl}>{address}</Link>
          </Text>
        </View>
      </View>
    </View>
  )
}


class Certificate extends Component {
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
    const { time, hash, receipts } = this.props;
    return (
      <Container>
        <Wrapper>
          <Document>
            <Page size="A4" wrap>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Image
                    style={styles.image}
                    src={`${window.location.origin}/static/media/logo.f94dd768.png`}
                  />
                </View>
                <View style={styles.col}>
                  <Text>CYSAE Stamper</Text>
                </View>
              </View>
              <View style={styles.centerRow}>
                <View style={styles.col}>
                  <Text>Sello en blockchain</Text>
                </View>
              </View>

              <View style={styles.container}>
                {/* Date */}
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.s}>
                      Estampado en: {time}
                    </Text>
                  </View>
                </View>

                {/* Hash */}
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.s}>
                      Hash: {hash}
                    </Text>
                  </View>
                </View>

                {/* get short receipt */}
                {getShortReceipts(receipts)}

              </View>

            </Page>
            {/* Receipts */}
            {getReceipts(receipts)}
          </Document>
        </Wrapper>
        <Button onClick={this.download}>Click</Button>
      </Container>
    )
  }
}

Certificate.propTypes = {
  hash: PropTypes.string,
  time: PropTypes.string,
};

export default Certificate;
