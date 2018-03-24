import React from 'react';
/**
*
* BurgerMenu
*
*/

// import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { stack as Menu } from 'react-burger-menu';

const styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '30px',
    left: '36px',
    top: '20px',
  },
  bmBurgerBars: {
    background: '#373a47',
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
  },
  bmCross: {
    background: '#bdc3c7',
  },
  bmMenu: {
    background: 'white',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
  },
  bmMorphShape: {
    fill: '#373a47',
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)',
  },
};

class BurgerMenu extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { isMenuOpen: false };
    this.closeMenu = this.closeMenu.bind(this);
  }

  closeMenu() {
    this.setState({ isMenuOpen: false });
  }

  render() {
    const { isMenuOpen } = this.state;

    return (
      <Menu isOpen={isMenuOpen} styles={styles}>
        <Link to="/" onClick={this.closeMenu}>My Documents</Link>
        <Link to="/stamp" onClick={this.closeMenu}>Stamper</Link>
        <Link to="/verify" onClick={this.closeMenu}>Verifier</Link>
      </Menu>
    );
  }
}

BurgerMenu.propTypes = {

};

export default BurgerMenu;
