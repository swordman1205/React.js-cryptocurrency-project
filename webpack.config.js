"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8888";

// global css
loaders.push({
	test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
	loaders: [
		'style-loader?sourceMap',
		'css-loader'
	]
});
// local scss modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.scss/,
	exclude: /(node_modules|bower_components|public)/,
	loaders: [
		'style-loader?sourceMap',
		'css-loader',
		'postcss-loader',
		'sass-loader'
	]
});

// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.css/,
	exclude: /(node_modules|bower_components|public)/,
	loaders: [
		'style-loader?sourceMap',
		'css-loader'
	]
});

module.exports = {
	entry: [
		`webpack-dev-server/client?http://${HOST}:${PORT}`,
		`webpack/hot/only-dev-server`,
		`./src/index.js` // Your appʼs entry point
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
	output: {
		path: path.join(__dirname, 'static/dist'),
		filename: 'bundle.js',
		publicPath: `http://${HOST}:${PORT}/`
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		loaders
	},
	devServer: {
		disableHostCheck: true,
		contentBase: "./static/dist",
		// do not print bundle build stats
		noInfo: true,
		// enable HMR
		hot: true,
		// embed the webpack-dev-server runtime into the bundle
		inline: true,
		// serve index.html in place of 404 responses to allow HTML5 history
		historyApiFallback: true,
		port: PORT,
		host: HOST
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './src/template.html'
		}),
	]
};
