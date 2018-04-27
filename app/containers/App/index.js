import React from 'react';
/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import PropTypes from 'prop-types';
import Router from 'components/Router/index';
import DocumentStamper from 'components/DocumentStamper/index';
import DocumentVerifier from 'components/DocumentVerifier/index';
import Amplify, { I18n } from 'aws-amplify';
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';
import { message } from 'antd';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
I18n.setLanguage('es');
const dict = {
  es: {
    'Sign In': 'Acceder',
    'Forgot Password': '¿Has olvidado tu contraseña?',
    'Sign Up': 'Crea un usuario',
    'Resend Code': 'Reenviar codigo',
    'Username cannot be empty': 'Nombre de usario no puede estar vacio',
    'Password cannot be empty': 'test',
    'User does not exist': 'El usuario no existe',
    'Username': 'Nombre de usuario/ email',
  },
};
I18n.putVocabularies(dict);

class App extends React.Component {
  render() {
    const { authState } = this.props;
    if (authState === 'signedIn') {
      return (
        <div>
          <Router authState={this.props.authState} />
        </div>
      );
    }
    return null;
  }
}

App.propTypes = {
  authState: PropTypes.string,
};

class AlwaysOn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedTerms: false,
    };

    this.handleTermsClick = this.handleTermsClick.bind(this);
  }

  handleTermsClick = () => {
    const acceptedTerms = !this.state.acceptedTerms;
    this.setState({ acceptedTerms });
  }

  render() {
    return (
      <div style={{ display: 'inline-block', width: '40%', verticalAlign: 'middle' }}>
        <p>
          A través de esta sencilla herramienta puedes estampar de forma gratuita cualquier archivo en blockchain y comprobar que su hash, o cualquier otro hash, existen en dicha blockchain. Puedes hacerlo directamente sin registrarte, bajo estas líneas, o bien registrarte de forma segura en la parte izquierda de la pantalla y poder gestionar de forma privada todos los archivos que subes a blockchain.
        </p>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontSize: 16 }}>
            <input onClick={this.handleTermsClick} type="checkbox" style={{ marginRight: '10px' }}/>
            <a target="_blank" href="https://cysae.a.docxpresso.com/documents/preview/45?timestamp=1520972633&uniqid=5aa83359543e5964824212&APIKEY=ab24f3256f37815b1a05b26308e61e2d098c43c9&options=e30,&track=1" >
              Acepto la Política de Privacidad
            </a>
          </label>
        </div>

        <DocumentStamper disabled={!this.state.acceptedTerms} {...this.props} />
        <DocumentVerifier />
      </div>
    );
  }
};

class CustomSignUp extends SignUp {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      acceptedTerms: false,
    };

    this.handleTermsClick = this.handleTermsClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  handleTermsClick = () => {
    const acceptedTerms = !this.state.acceptedTerms;
    this.setState({ acceptedTerms });
  }

  handleInputChange = (e) => {
    const newState = this.state;
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  signUp() {
    if (this.state.acceptedTerms) {
      const { username, email, password } = this.state;
      Amplify.Auth.signUp(username, password, email, '')
        .then(() => this.changeState('confirmSignUp', username))
        .catch((err) => this.error(err));
    } else {
      message.error('Tienes que acceptar la Política de Privacidad');
      document.getElementById('terms').focus();
    }
  }

  render() {
    const { authState } = this.props;

    if (authState !== 'signUp') {
      return null;
    }

    return (
      <div className="amplify-form-container" style={{ textAlign: 'center', paddingTop: 77, width: '50%', display: 'inline-block' }}>
        <div className="amplify-form-section" style={{ margin: '0px 0px 10px', color: 'rgb(38, 38, 38)', backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(230, 230, 230)', borderRadius: 1, textAlign: 'center', width: 350, display: 'inline-block', verticalAlign: 'middle' }}>

          {/* header */}
          <div className="amplify-section-header" style={{ margin: '22px auto 8px', overflow: 'hidden' }}>
            <span className="amplify-section-header-content" style={{ height: 205, width: 250, display: 'inline-block', textIndent: '110%', whiteSpace: 'nowrap', marginBottom: 40, backgroundImage: 'url("/7d9cece6d0315f145ae462d692aebe46.png")' }}>
              Sign In Account
            </span>
          </div>

          {/* body */}
          <div className="amplify-section-body" style={{ padding: 0, margin: 0, borderBottom: '1px solid rgb(230, 230, 230)', minHeight: 150 }}>
            <div className="amplify-form-row" style={{ margin: '0px 40px 6px', textAlign: 'left' }}>
              <input onChange={this.handleInputChange} placeholder="Nombre de usario" name="username" className="amplify-input" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', display: 'block', width: '100%', background: 'rgb(250, 250, 250)', padding: '9px 0px 7px 8px', border: '1px solid rgb(239, 239, 239)', borderRadius: 3, fontSize: 14, lineHeight: '18px', boxSizing: 'border-box' }} />
            </div>
            <div className="amplify-form-row" style={{ margin: '0px 40px 6px', textAlign: 'left' }}>
              <input onChange={this.handleInputChange} placeholder="Email" name="email" className="amplify-input" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', display: 'block', width: '100%', background: 'rgb(250, 250, 250)', padding: '9px 0px 7px 8px', border: '1px solid rgb(239, 239, 239)', borderRadius: 3, fontSize: 14, lineHeight: '18px', boxSizing: 'border-box' }} />
            </div>
            <div className="amplify-form-row" style={{ margin: '0px 40px 6px', textAlign: 'left' }}>
              <input onChange={this.handleInputChange} placeholder="Contraseña" type="password" name="password" className="amplify-input" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', display: 'block', width: '100%', background: 'rgb(250, 250, 250)', padding: '9px 0px 7px 8px', border: '1px solid rgb(239, 239, 239)', borderRadius: 3, fontSize: 14, lineHeight: '18px', boxSizing: 'border-box' }} />
            </div>
            <div className="amplify-form-row" style={{ margin: '0px 40px 6px', textAlign: 'left' }}>
              <label style={{ padding: '9px 0px 7px 8px' }}>
                <input id="terms" onClick={this.handleTermsClick} type="checkbox" className="amplify-input" style={{ float: 'left', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', background: 'rgb(250, 250, 250)', border: '1px solid rgb(239, 239, 239)', borderRadius: 3, fontSize: 14, lineHeight: '18px', boxSizing: 'border-box' }} />
                <a target="_blank" href="https://cysae.a.docxpresso.com/documents/preview/45?timestamp=1520972633&uniqid=5aa83359543e5964824212&APIKEY=ab24f3256f37815b1a05b26308e61e2d098c43c9&options=e30,&track=1" >
                  Acepto la Política de Privacidad
                </a>
              </label>
            </div>
            <p>
              Para verificar tu email vas a recibir un email con un codigo que tienes que poner en la siguente pantalla.
            </p>
            <div className="amplify-action-row" style={{ margin: '0px 40px 6px' }}>
              <button onClick={this.signUp} className="amplify-button" style={{ display: 'inline-block', fontSize: 14, fontWeight: 600, lineHeight: '26px', padding: '0px 8px', marginTop: 8, marginBottom: 8, border: '1px solid rgb(56, 151, 240)', borderRadius: 3, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(56, 151, 240)', width: '100%' }}>
                <span className="amplify-button-content">
                  Crea un usario
                </span>
              </button>
            </div>
          </div>

          {/* footer */}
          <div className="amplify-section-footer" style={{ fontSize: 14, textAlign: 'left', backgroundColor: 'rgb(255, 255, 255)', margin: '10px 1px', padding: '20px 15px 10px', boxSizing: 'border-box', borderTop: '1px solid rgb(230, 230, 230)' }}>
            <span className="amplify-section-footer-content">
              <div style={{ display: 'inline-block', width: '50%' }}>
                <a onClick={() => this.changeState('confirmSignUp')} className="amplify-a" style={{ color: 'rgb(56, 151, 240)' }}>Confirmar un código</a>
              </div>
              <div style={{ textAlign: 'right', display: 'inline-block', width: '50%' }}>
                <a onClick={() => this.changeState('signIn')} className="amplify-a" style={{ color: 'rgb(56, 151, 240)' }}>Acceder</a>
              </div>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App, false, [
  <SignIn />,
  <ConfirmSignIn />,
  <VerifyContact />,
  <CustomSignUp />,
  <ConfirmSignUp />,
  <ForgotPassword />,
  <AlwaysOn />,
]);

