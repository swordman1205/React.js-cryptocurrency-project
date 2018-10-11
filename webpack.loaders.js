module.exports = [
	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components|public)/,
		loaders: ['react-hot-loader/webpack']
	},
	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components|public)/,
		loader: 'babel-loader',
		query: {
		  presets: ['es2015', 'react'],
		  plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
		}
	},
	{
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		loader: "file-loader"
	},
	{
		test: /\.(woff|woff2)$/,
		loader: "url-loader?prefix=font/&limit=5000"
	},
	{
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		loader: "url-loader?limit=10000&mimetype=application/octet-stream"
	},
	{
		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
		loader: "url-loader?limit=10000&mimetype=image/svg+xml"
	},
	{
		test: /\.gif/,
		loader: "url-loader?limit=10000&mimetype=image/gif"
	},
	{
		test: /\.jpg/,
		loader: "url-loader?limit=10000&mimetype=image/jpg"
	},
	{
		test: /\.png/,
		loader: "url-loader?limit=10000&mimetype=image/png"
	},
	{
		test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		loader: "url-loader"
	},
];
