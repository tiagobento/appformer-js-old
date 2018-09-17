const path = require("path");
const merge = require("webpack-merge");
const common = require("../webpack.common");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  entry: {
    showcase: "./src/index.ts"
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "appformer-core": "AppFormer"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "showcase.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: [path.join(__dirname, "./dist"), path.join(__dirname, "../appformer-core/dist")],
    compress: true,
    port: 9000,
    historyApiFallback: {
      index: "/index.html"
    }
  },
  module: {
    rules: [
      {
        test: /-?[Pp]erspective\.(html)$/,
        use: ["html-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "AppFormer.js :: Showcase",
      filename: "index.html",
      chunks: ["showcase"],
      template: "./src/index.template.html"
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/, // exclude detection of files based on a RegExp
      failOnError: true, // add errors to webpack instead of warnings
      cwd: process.cwd() // set the current working directory for displaying module paths
    })
  ]
});
