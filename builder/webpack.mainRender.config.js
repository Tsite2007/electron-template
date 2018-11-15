/*
Tip:    主进程打包配置
Author: tengma
Data:   2018-04-09
 */
const path=require('path');
const webpack = require('webpack');
const BabiliWebpackPlugin = require('babili-webpack-plugin');
const { dependencies } = require('../package.json');
module.exports = {
    mode:"development",
    entry: {
        main: ['./src/main.js']
    },
    output: {
        path: path.join(__dirname, '../app/'),
        libraryTarget: 'commonjs2',
        filename: './[name].js'
    },
    node: {
        fs: 'empty',
        __dirname:false
    },
    module: {
        rules: [    
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(gif|ico|jpe?g|png|svg)(\?\S*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 2048,/* * 【改动】：图片小于2kb的按base64打包 */
                        name: './images/[name].[ext]'
                    }
                }],
            },
            {
                test: /\.node$/,
                // use: [{
                //     loader: path.resolve(__dirname, 'nodeLoader.js'),
                //     options: {
                //         name: './nodejs/[name].[ext]',
                //     }
                // }]
            }]
    },
    externals: [
      ...Object.keys(dependencies || {})
    ],
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, "../src"),
            '@images': path.resolve(__dirname, "../src/assets/images")
        }
    },
    plugins:[],
    target:"electron-main"
};
