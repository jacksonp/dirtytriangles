const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.jsx',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'src'),
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.[contenthash].js',
        clean: true
    },
    devServer: {
        port: 8080,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new CopyPlugin({patterns: [
            {from: 'src/favicon.ico'},
            {from: 'src/robots.txt'},
            {from: 'src/img', to: 'img'}
        ]})
    ]
};
