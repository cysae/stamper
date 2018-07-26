import React from 'react';
/**
*
* Layout
*
*/

import styled from 'styled-components';
import { Layout } from 'antd';
import Navigation from '../Navigation/index';
import LogoImg from '../../images/logo.png';
import CustomHeader from '../CustomHeader/index';
const { Content, Footer, Sider } = Layout;

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
    <Layout style={{ marginLeft: 200, height: '100vh' }}>
      <CustomHeader />
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
          <WrappedComponent {...props} />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        ©2018 Cysae Severla. Todos los Derechos Reservados.
      </Footer>
    </Layout>
  </Layout>
);

export default layoutHOC;
