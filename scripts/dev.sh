
# Start Webpack dev server and Golang server at the same time

trap "kill 0" SIGINT
( webpack-dev-server --content-base client/ --config client/webpack.config.js ) &
( go run api/main.go ) &
wait
