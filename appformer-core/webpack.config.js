const path = require("path");
const merge = require("webpack-merge");
const common = require("../webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
  entry: {
    "appformer-core": "./src/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist")
  },
  plugins: [new CleanWebpackPlugin(["dist"])]
});
