
var webpack = require('webpack');
var path = require('path');

var conf = require('../conf.json');
var inlined = {}
for (var key of Object.keys(conf)) {
    inlined[key] = JSON.stringify(conf[key]);
}

var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

var mode = process.env.DBPEDIA_ENV || 'development';

// use MiniCssExtractPlugin in production
var styleLoader;
if (mode === 'production') {
    styleLoader = MiniCssExtractPlugin.loader;
} else {
    styleLoader = 'style-loader';
}

module.exports = {
    mode: mode,

    context: path.resolve(__dirname, 'src'),

    entry: 'index.js',

    devtool: 'source-map',

    output: {
        path: path.resolve(__dirname, '../static'),
        filename: 'bundle.js',
        publicPath: '/',
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        'env',
                        'react'
                    ],
                    plugins: [
                        'transform-object-rest-spread',
                    ],
                    babelrc: false,
                },
                include: __dirname,
                resolve: {
                    extensions: ['.js', '.jsx', '.sass'],
                },
            },
            {
                test: /\.sass$/,
                use: [
                    styleLoader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    styleLoader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
            {
                test: /\.md$/,
                use: 'raw-loader',
            },
        ],
    },

    resolve: {
        modules: [
            'node_modules',
            '.',
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: path.resolve(__dirname, '../static/index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.DefinePlugin(inlined),
    ],

    devServer: {
        historyApiFallback: true,
        publicPath: path.resolve(__dirname, '/'),
        proxy: {
            '/api': 'http://localhost:8004',
        },
        open: true,
        overlay: true,
    },
};
