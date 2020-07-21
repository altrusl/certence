module.exports = {
	publicPath: "./",
	outputDir: "./dist",
	productionSourceMap: false,
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