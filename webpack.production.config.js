const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.jsx',
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
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        function () {
            this.plugin('done', function (stats) {
                const
                    fs = require('fs'),
                    bundleName = stats.toJson().assetsByChunkName.main;
                let htmlContents = fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf8');
                htmlContents = htmlContents.replace('__JS_BUNDLE_NAME__', bundleName);
                fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), htmlContents);
            });
        },
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};
