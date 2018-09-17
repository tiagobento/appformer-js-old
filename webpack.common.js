const path = require("path");

module.exports = {
  mode: "development",
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },
  output: {
    filename: "index.js",
    library: "all"
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
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    modules: [path.resolve("./node_modules"), path.resolve("./src")]
  }
};
