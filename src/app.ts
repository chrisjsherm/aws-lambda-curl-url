import { APIGatewayEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import { default as axios } from 'axios';
import { urlRegex } from './constants/url.regex';
import { AppRequestBody } from './models/app-request-body.interface';

/**
 * cURL the URL and return the result
 *
 * @param url URL to cURL
 * @returns Result of cURL
 */
function call(url: string) {
  console.log(`cURLing: ${url}.`);

  return axios
    .get(url)
    .then((response: { data: string }) => {
      console.log('Received content.');

      return {
        statusCode: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
        body: JSON.stringify(response.data),
      };
    })
    .catch((error: Error) => {
      console.log('Error fetching content:');
      console.log(error);

      return {
        statusCode: 500,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
        },
        body: 'An error occurred fetching the content:\n' + error.message,
      };
    });
}

/**
 * Parse request body, ensuring it is well-formed
 *
 * @param body Request body
 * @returns Parsed request body
 */
function parseRequestBody(body: string | null): AppRequestBody {
  console.log('Validating request.');

  const badRequest = {
    statusCode: 400,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  };

  if (body === undefined || body === null) {
    throw new Error(
      JSON.stringify({
        ...badRequest,
        body: 'Request body is missing.',
      }),
    );
  }

  const jsonBody = JSON.parse(body) as AppRequestBody;

  if (jsonBody.url === undefined) {
    throw new Error(
      JSON.stringify({
        ...badRequest,
        body: 'Property "url" is missing from the request body.',
      }),
    );
  }

  if (typeof jsonBody.url !== 'string') {
    throw new Error(
      JSON.stringify({
        ...badRequest,
        body: 'Property "url" must be a string.',
      }),
    );
  }

  if (urlRegex.test(jsonBody.url) === false) {
    throw new Error(
      JSON.stringify({
        ...badRequest,
        body: 'Property "url" must be a valid URL.',
      }),
    );
  }

  return jsonBody;
}

/**
 * Handle Lambda Fn request to cURL the target URL.
 *
 * @param event Lambda Function event (via Lambda Function URL)
 * @returns cURL result of the target URL
 */
export const handler = async function handleRequest(
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResultV2> {
  try {
    const jsonBody = parseRequestBody(event.body);
    return call(jsonBody.url);
  } catch (error) {
    const errorResult = JSON.parse((error as Error).message);
    return errorResult;
  }
};
