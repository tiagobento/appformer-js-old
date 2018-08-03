const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        "core": './src/core/index.ts',
        "examples/examples": './src/examples/index.jsx'
    },
    externals: {
        // 'core': "core",
        // 'react': "react",
        // 'react-dom': "react-dom"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        library: 'all'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, './dist/examples'),
        compress: true,
        port: 9000,
        historyApiFallback: {
            index: '/examples/index.html'
        }
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }, {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        }]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./src/'),
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'AppFormer.js :: Examples',
            filename: 'examples/index.html',
            chunks: ['examples/examples'],
            template: "./src/examples/index.template.html",
        })
    ]
};