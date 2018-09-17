const path = require("path");
const merge = require("webpack-merge");
const common = require("../webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
  entry: {
    "showcase-components": "./src/index.tsx"
  },

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "appformer-core": "appformer-core"
  },

  output: {
    path: path.resolve(__dirname, "dist")
  },

  plugins: [new CleanWebpackPlugin(["dist"])]
});
