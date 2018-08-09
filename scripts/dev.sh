
# Start Webpack dev server and Golang server at the same time
webpack-dev-server --content-base client/ --config client/webpack.config.js && go run api/main.go
