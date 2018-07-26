import { injectGlobal } from 'styled-components';

// Ant Design
import 'antd/dist/antd.css';


/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  input[name="phone_number"] {
    display: none !important;
  }


  .amplify-error-section {
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: 22px;

    // /* remove after 5 seconds */
    // -moz-animation: cssAnimation 0s ease-in 5s forwards;
    // /* Firefox */
    // -webkit-animation: cssAnimation 0s ease-in 5s forwards;
    // /* Safari and Chrome */
    // -o-animation: cssAnimation 0s ease-in 5s forwards;
    // /* Opera */
    // animation: cssAnimation 0s ease-in 5s forwards;
    // -webkit-animation-fill-mode: forwards;
    // animation-fill-mode: forwards;
  }

  @keyframes cssAnimation {
    to {
        width:0;
        height:0;
        overflow:hidden;
    }
  }
  @-webkit-keyframes cssAnimation {
    to {
        width:0;
        height:0;
        visibility:hidden;
    }
  }

  .amplify-error-section-content div {
    text-align: center;
    height: 70px;
    line-height: 70px;
    min-height: 0 !important;
  }

  .ant-table-column-sorter span {
    height: 8px;
  }
  .ant-table-column-sorter span i {
    font-size: 20px !important;
  }
`;
