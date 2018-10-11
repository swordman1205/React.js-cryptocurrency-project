
const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

// local css modules
loaders.push({
    test: /[\/\\]src[\/\\].*\.css/,
    exclude: /(node_modules|bower_components|static)/,
    loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader']),
});

// local scss modules
loaders.push({
    test: /[\/\\]src[\/\\].*\.scss/,
    exclude: /(node_modules|bower_components|static)/,
    loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'sass-loader']),
});
// global css files
loaders.push({
    test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
    loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader']),
});

module.exports = {
    entry: [
        './src/index.js',
    ],
    output: {
        path: path.join(__dirname, 'static/dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        loaders,
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                drop_console: true,
                drop_debugger: true,
            },
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin('styles.css'),
		new HtmlWebpackPlugin({
			template: './src/template.html'
		}),
    ],
};
