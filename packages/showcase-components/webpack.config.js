const path = require("path");
const merge = require("webpack-merge");
const common = require("../../webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = merge(common, {
  entry: {
    index: "./src/index.ts"
  },
  externals: {
    "appformer-js": {
      commonjs: "appformer-js",
      commonjs2: "appformer-js",
      amd: "appformer-js",
      root: "AppFormer" // indicates global variable
    }
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "ShowcaseComponents",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new CircularDependencyPlugin({
      exclude: /node_modules/, // exclude detection of files based on a RegExp
      failOnError: true, // add errors to webpack instead of warnings
      cwd: process.cwd() // set the current working directory for displaying module paths
    })
  ]
});
