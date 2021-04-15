const isDevelopment = process.env.NODE_ENV === "development";

module.exports = [
	// Add support for native node modules
	{
		test: /\.node$/,
		use: "node-loader",
	},
	{
		test: /\.(m?js|node)$/,
		parser: { amd: false },
		use: [
			{
				loader: "@vercel/webpack-asset-relocator-loader",
				options: {
					outputAssetBase: "native_modules",
				},
			},
		],
	},
	// Put your webpack loader rules in this array.  This is where you would put
	// your ts-loader configuration for instance:
	/**
	 * Typescript Example:
	 *
	 * {
	 *   test: /\.tsx?$/,
	 *   exclude: /(node_modules|.webpack)/,
	 *   loaders: [{
	 *     loader: 'ts-loader',
	 *     options: {
	 *       transpileOnly: true
	 *     }
	 *   }]
	 * }
	 */
	{
		test: /\.jsx?$/,
		exclude: /node_modules/,
		use: [
			{
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-react"],
				},
			},
		],
	},
	{
		test: /\.svg$/,
		use: ["@svgr/webpack"],
	},
];
