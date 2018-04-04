const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line

module.exports = {
    entry: {
        app: './src/client/index.js',
        vendor: [
            'three',
            'jquery',
            'd3'
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/',
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['babel-preset-env'],
                plugins: ['angularjs-annotate'],
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
            loader: 'url-loader?publicPath=/static/dist/&limit=100000',
        }, {
            test: /\.jpg$/,
            loader: 'file-loader',
        }, {
            test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
            loader: 'url-loader',
        }],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.ProvidePlugin({
            'THREE': 'three',
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            exclude: /\/server/,
            compress: {
                dead_code: true, // eslint-disable-line
                drop_debugger: true, // eslint-disable-line
                conditionals: true,
                comparisons: true,
                booleans: true,
                unused: true,
                toplevel: true,
                if_return: true, // eslint-disable-line
                join_vars: true, // eslint-disable-line
                cascade: true,
                collapse_vars: true, // eslint-disable-line
                reduce_vars: true, // eslint-disable-line
                warnings: false,
                drop_console: true, // eslint-disable-line
                passes: 2,
            },
            mangle: true,
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
};
