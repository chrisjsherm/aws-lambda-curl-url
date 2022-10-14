# Lambda container for curling a URL

Lambda function for cURLing a URL. Uses a Lambda (Docker) container image to
package the app.

## Debug

Run `sh shell-scripts/build-image.sh` to build the Docker image.

Run `sh shell-scripts/run-container.sh` to start a container using the image.

In a separate terminal, run `sh shell-scripts/curl-endpoint.sh` to hit the Lambda
endpoint.
