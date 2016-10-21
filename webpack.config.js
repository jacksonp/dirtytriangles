var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/index.jsx'
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node-modules/,
                include: path.join(__dirname, 'src'),
                loaders: ['babel-loader']
            },
            {
                test: /\.css$/,
                loader: 'style!css!'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.[hash].js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        function () {
            this.plugin('done', function (stats) {
                const
                    fs = require('fs'),
                    bundleName = stats.toJson().assetsByChunkName.main;
                let htmlContents = fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf8');
                console.log(htmlContents);
                htmlContents = htmlContents.replace('__JS_BUNDLE_NAME__', bundleName);
                fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), htmlContents);
            });
        }
    ]
};
