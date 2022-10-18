import { APIGatewayEvent } from 'aws-lambda';
import { default as axios } from 'axios';

function call(url: string) {
  console.log('Getting:' + url);
  return axios
    .get(url)
    .then((response: { data: string }) => {
      console.log('Got content for:' + url);
      return {
        statusCode: 200,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
        },
        body: JSON.stringify(response.data),
      };
    })
    .catch((error: Error) => {
      return {
        statusCode: 500,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
        },
        body: 'Some error fetching the content\n' + error.message,
      };
    });
}

const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;

export const handler = (event: APIGatewayEvent) => {
  const body = JSON.parse(event.body!);

  console.log(body);
  console.log(`URL: ${body.url}`);
  console.log(`Type: ${typeof body.url}`);

  if (!body.url || typeof body.url !== 'string') {
    let response = {
      statusCode: 400,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
      body: 'Please provide a URL property with a string value in the request body',
    };
    return Promise.resolve(response);
  } else if (urlRegex.test(body.url) === false) {
    let response = {
      statusCode: 400,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
      body: 'Please provide a valid URL',
    };
    return Promise.resolve(response);
  } else {
    const url = body.url;
    return call(url);
  }
};
