import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'antd';

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


function displayReceipts(receipts) {
  const output = [];

  if (typeof receipts.btc === 'object') {
    output.push(
      <div>
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
          Ethereum Dirección:
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
      <div>
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

function Certificate(props) {
  console.log(props);
  const { time, hash, receipts } = props;
  return (
    <Container>
      <StyledRow justify="start">
        <LeftCol span={4}>
          Estampado en:
        </LeftCol>
        <RightCol span={20}>
          {time}
        </RightCol>
      </StyledRow>
      <StyledRow justify="start">
        <LeftCol span={4}>
          Hash:
        </LeftCol>
        <RightCol span={20}>
          {hash}
        </RightCol>
      </StyledRow>
      {displayReceipts(receipts)}
    </Container>
  );
}

Certificate.propTypes = {
  hash: PropTypes.string,
  time: PropTypes.string,
};

export default Certificate;
