// ondc-adapter/ondcClient.js

const axios = require('axios');
require('dotenv').config(); // Make sure to have the dotenv package installed.

const ondcClient = axios.create({
  baseURL: process.env.ONDC_API_BASE_URL, // The base URL for ONDC APIs.
});

module.exports = ondcClient;
