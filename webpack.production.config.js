const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/index.jsx',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node-modules/,
                include: path.join(__dirname, 'src'),
                loader: require.resolve('babel-loader'),
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
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
    plugins: [
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
