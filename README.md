# Lambda container for curling a URL

Lambda function for cURLing a URL. Uses a Lambda (Docker) container image to
package the app.

> Note: The handler assumes you are calling the Lambda function directly by
> configuring a Lambda function URL rather than proxying through an API Gateway.

## Debug

Build and run the Docker image:

```console
cd shell-scripts
sh build-image.sh
sh run-container.sh
```

In a separate terminal, run `sh curl-endpoint.sh` to hit the Lambda
endpoint.
