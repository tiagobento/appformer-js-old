const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    core: "./src/appformer/index.ts",
    "core-screens/screens": "./src/core-screens/index.jsx",
    "core-examples/examples": "./src/core-examples/index.ts"
  },
  externals: {
    // 'core': "core", //FIXME: Do we want to exclude core from the build?
    react: "React",
    "react-dom": "ReactDOM"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    library: "all"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "./dist/core-examples"),
    compress: true,
    port: 9000,
    historyApiFallback: {
      index: "/core-examples/index.html"
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /-?[Pp]erspective\.(html)$/,
        use: ["html-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    modules: [path.resolve("./node_modules"), path.resolve("./src/")]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "AppFormer.js :: Core Screens",
      filename: "core-examples/index.html",
      chunks: ["core-examples/examples"],
      template: "./src/core-examples/index.template.html"
    })
  ]
};
