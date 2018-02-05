const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // eslint-disable-line

module.exports = {
    entry: {
        app: './src/client/index.js',
        vendor: [
            'three',
            'jquery',
            'd3',
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/',
    },
    devServer: {
        host: '127.0.0.1',
        port: 5000,
    },
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['babel-preset-env'],
            },
        }, {
            test: /\.html$/,
            loader: 'html-loader',
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
        }, {
            test: /\.scss$/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
            }, {
                loader: 'postcss-loader', // Run post css actions
                options: {
                    plugins() { // post css plugins, can be exported to postcss.config.js
                        return [
                            require('precss'),
                            require('autoprefixer'),
                        ];
                    },
                },
            }, {
                loader: 'sass-loader',
            }],
        }, {
            test: /\.png$|\?|\.gif($|\?)/,
            loader: 'url-loader?publicPath=dist/&limit=100000',
        }, {
            test: /\.jpg$/,
            loader: 'file-loader',
        }, {
            test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
            loader: 'url-loader',
        }],
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': 'development',
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
        }),
        new webpack.ProvidePlugin({
            'THREE': 'three',
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NamedModulesPlugin(),
    ],
};
