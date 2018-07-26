const {injectBabelPlugin} = require('react-app-rewired')

module.exports = function override (config, env) {
    // Config for react-pdf
    const reactPDFRule = {
        test: /(pdfkit|linebreak|fontkit|unicode|brotli|png-js).*\.js$/,
        loader: 'transform-loader?brfs',
    }
    config.module.rules = [...config.module.rules, reactPDFRule]
    // end of config for react-pdf
    config = injectBabelPlugin(['import', {libraryName: 'antd', libraryDirectory: 'es', style: 'css'}], config)
    return config
}

