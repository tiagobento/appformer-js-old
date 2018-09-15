const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    "appformer-core": "./src/index.ts",
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "all"
  },
  devtool: "inline-source-map",
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
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    modules: [path.resolve("./node_modules"), path.resolve("./src")],
    alias: {
        javaWrappers: path.resolve(__dirname, 'src/java-wrappers/')
    }
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
  ]
};
