const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    appformer: "./src/appformer/index.ts",
    "showcase/showcase-components": "./src/showcase-components/index.jsx",
    "showcase/showcase": "./src/showcase/index.ts"
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
    contentBase: path.join(__dirname, "./dist/showcase"),
    compress: true,
    port: 9000,
    historyApiFallback: {
      index: "/showcase/index.html"
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
      filename: "showcase/index.html",
      chunks: ["showcase/showcase"],
      template: "./src/showcase/index.template.html"
    })
  ]
};
