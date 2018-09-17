const path = require("path");
const merge = require("webpack-merge");
const common = require("../webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = merge(common, {
  entry: {
    "showcase_components": "./src/index.ts"
  },

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "appformer-core": "AppFormer"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "showcase_components.js"
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
