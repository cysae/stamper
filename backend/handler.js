'use strict';
require('dotenv').config()
const axios = require('axios')

const stamperyClientId = process.env.STAMPERY_CLIENT_ID
const stamperySecret = process.env.STAMPERY_SECRET

const stampery = axios.create({
  baseURL: 'https://api-prod.stampery.com',
  maxContentLength: 1000000,
  auth: {
    username: stamperyClientId,
    password: stamperySecret
  }
});

module.exports.certificate = (event, context, callback) => {
  const stamperyId = event.queryStringParameters.id;
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type' : 'application/pdf',
      'Content-Disposition': 'inline; filename="certificate.pdf"',
      'Access-Control-Allow-Origin': 'http://localhost:3000'
    },
    isBase64Encoded: true
  };

  stampery.get(`/stamps/${stamperyId}.pdf`, {
    responseType: 'arraybuffer',
  })
    .then(res => {
      const buffer = Buffer.from(res.data)
      const base64Str = buffer.toString('base64')
      response.body = base64Str
      callback(null, response);
    })
    .catch(err => console.log(err))
};