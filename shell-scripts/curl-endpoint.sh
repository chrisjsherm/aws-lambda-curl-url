read -p "Lambda function URL: " LAMBDA_FUNCTION_URL
read -p "JSON payload: [{\"url\": \"https://google.com\"}]" JSON_PAYLOAD

JSON_PAYLOAD=${JSON_PAYLOAD:-{\"url\": \"https://google.com\"}}

curl -XPOST "${LAMBDA_FUNCTION_URL}" \
  -H 'Content-Type: application/json' \
  -d "${JSON_PAYLOAD}"
