import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const response = await fetch('http://www.finnkino.fi/xml/TheatreAreas/');
    const data = await response.text();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/xml',
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
}
