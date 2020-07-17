module.exports = {
	publicPath: "./",
	outputDir: "./dist",
	css: {
		extract: false,
		sourceMap: true
	},
	devServer: {
		// clientLogLevel: 'info',
		watchOptions: {
			poll: true
		}
	}
};