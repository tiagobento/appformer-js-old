const path = require("path");
const merge = require("webpack-merge");
const common = require("../../webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = merge(common, {
  entry: {
    "spaces-screen": "./src/spaces-screen/index.tsx",
    "home-perspective": "./src/home-perspective/index.tsx",
    "stunner-showcase-home-screen": "./src/stunner-showcase-home-screen/index.tsx",
    "business-central-community-home-screen": "./src/business-central-community-home-screen/index.tsx",
    "business-central-product-home-screen": "./src/business-central-product-home-screen/index.tsx",
    "business-monitoring-community-home-screen": "./src/business-monitoring-community-home-screen/index.tsx",
    "business-monitoring-product-home-screen": "./src/business-monitoring-product-home-screen/index.tsx",
    "drools-wb-home-screen": "./src/drools-wb-home-screen/index.tsx",
    "jbpm-wb-home-screen": "./src/jbpm-wb-home-screen/index.tsx",
    "optaplanner-wb-home-screen": "./src/optaplanner-wb-home-screen/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]-bundle.js",
    library: "WorkbenchScreens",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: {
    'appformer-js': {
      root: 'AppFormer', //indicates global variable
      commonjs: 'appformer-js',
      commonjs2: 'appformer-js',
      amd: 'appformer-js'
    },
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
