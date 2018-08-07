const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        "core": './src/core/index.ts',
        "core-screens/screens": './src/core-screens/index.jsx'
    },
    externals: {
        // 'core': "core",
        'react': "React",
        'react-dom': "ReactDOM"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        library: 'all'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, './dist/core-screens'),
        compress: true,
        port: 9000,
        historyApiFallback: {
            index: '/core-screens/index.html'
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
            title: 'AppFormer.js :: Core Screens',
            filename: 'core-screens/index.html',
            chunks: ['core-screens/screens'],
            template: "./src/core-screens/index.template.html",
        })
    ]
};