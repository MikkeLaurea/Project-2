const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const response = await fetch('http://www.finnkino.fi/xml/TheatreAreas/');
    const data = await response.text();
    return {
      statusCode: 200,
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
