const rules = require("./webpack.rules");
const isDevelopment = process.env.NODE_ENV === "development";
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

rules.push({
	test: /\.css$/,
	use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
	// Put your normal webpack config below here
	module: {
		rules,
	},
	plugins: [
		isDevelopment &&
			new ReactRefreshWebpackPlugin({
				overlay: {
					sockIntegration: "whm",
				},
			}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.join(__dirname, "/src/reconciliationService"),
					to: "../main/rec",
				},
			],
		}),
	],
};
