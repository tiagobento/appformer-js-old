const path = require("path");
const merge = require("webpack-merge");
const common = require("../../webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = merge(common, {
  entry: {
    "appformer-js": "./src/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "appformer.js",
    library: "AppFormer",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: {
    react: {
      root: "React", //indicates global variable
      commonjs: "react",
      commonjs2: "react",
      amd: "react"
    },
    "react-dom": {
      root: "ReactDOM", //indicates global variable
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom"
    }
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new CircularDependencyPlugin({
      exclude: /node_modules/, // exclude detection of files based on a RegExp
      failOnError: false, // add errors to webpack instead of warnings
      cwd: process.cwd() // set the current working directory for displaying module paths
    })
  ]
});
