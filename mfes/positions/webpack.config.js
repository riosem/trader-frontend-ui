const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        static: path.join(__dirname, 'dist'),
        port: 3000,
        allowedHosts: 'all'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new Dotenv({
            path: './.env',
        }),
        new ModuleFederationPlugin({
            name: 'positions',
            filename: 'remoteEntry.js',
            remotes: process.env.AUTH_SERVICE_URL ? {
                auth: `auth@${process.env.AUTH_SERVICE_URL}/remoteEntry.js`,
            } : {},
            exposes: {
                './App': './src/App.js',
            },
            shared: ['react', 'react-dom'],
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
        }),
        
    ],
};