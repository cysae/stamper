import React from 'react';
/**
*
* Layout
*
*/

import styled from 'styled-components';
import { Layout } from 'antd';
import Navigation from '../Navigation/index';
import LogoImg from '../../images/icon-180x180.png';
const { Header, Content, Footer, Sider } = Layout;

const Logo = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 95%;
  padding: 10px;
`;

const layoutHOC = (WrappedComponent) => (props) => (
  <Layout>
    <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
      <Logo src={LogoImg} alt="Stamper Logo" />
      <Navigation />
    </Sider>
    <Layout style={{ marginLeft: 200 }}>
      <Header style={{ background: '#fff', padding: 0 }} />
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
          <WrappedComponent {...props} />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        footer
      </Footer>
    </Layout>
  </Layout>
);

export default layoutHOC;
