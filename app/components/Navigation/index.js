import React from 'react';
/**
 *
 * Navigation
 *
 */

// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';

class Navigation extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { location } = this.props;
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="folder" />
            <span className="nav-text">Mis Documentos</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/stamp">
          <Link to="/stamp">
            <Icon type="file-add" />
            <span className="nav-text">Sellar</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/verify">
          <Link to="/verify">
            <Icon type="check" />
            <span className="nav-text">Verificar</span>
          </Link>
        </Menu.Item>
      </Menu>
    );
  }
}

Navigation.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Navigation);
