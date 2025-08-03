const axios = require('axios');
const { Constants } = require('../constants');

function setQuery(userQueryRequest) {

  return {
    model: "llama-3.2-1b-instruct", // adjust based on your model name
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: userQueryRequest,
      },
    ],
    temperature: 0.7,
    max_tokens: 200
  }
}

async function getQueryResponse(message, res) {
  try {

    console.log("got request ping");
    return axios.post(
      Constants.MODEL_URL,
      {
        model: 'llama-3.2-1b-instruct',
        stream: true,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error making request:', error.message);
    return res.status(500).send('Error making request to the model');
  }
}

module.exports = { setQuery, getQueryResponse }