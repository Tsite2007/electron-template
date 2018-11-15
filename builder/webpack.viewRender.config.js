/*
Tip:    渲染进程配置
Author: tengma
Data:   2018-04-09
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//https://github.com/shepherdwind/css-hot-loader
//https://github.com/webpack-contrib/mini-css-extract-plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fsWebpackPlugin = new require("./fsWebpackPlugin")();
const { dependencies } = require('../package.json');
const outputPath = path.join(__dirname, '../app/views/');

function getConfig(mode) {
    const devMode = (mode == "development" ? true : false);
    return {
        mode: devMode ? "development" : "production",
        entry: {
            main: ['./src/index.js']
        },
        output: {
            path:  path.join(__dirname, '../app/views/'),
            publicPath: mode == "development" ? '/' : "",
            filename: './js/[name].js',
            chunkFilename: './js/[name].js'
        },
        node: {
            fs: 'empty'
        },
        optimization: {
            runtimeChunk: false,
            minimize: mode != "development",
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: "vendor",
                        minChunks: 1,
                        maxInitialRequests: 5,
                        minSize: 0,
                        chunks: "all"
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            less: (devMode ? ['css-hot-loader'] : []).concat([
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: "css-loader",
                                    options: {
                                        url: true,
                                        minimize: true
                                    }
                                },
                                "less-loader"
                            ]),
                            css: (devMode ? ['css-hot-loader'] : []).concat([
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: "css-loader",
                                    options: {
                                        url: true,
                                        minimize: true
                                    }
                                }
                            ])
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.node$/,
                    // use: [{
                    //     loader: path.resolve(__dirname, 'nodeLoader.js'),
                    //     options: {
                    //         name: './nodejs/[name].[ext]',
                    //         mode:devMode
                    //     }
                    // }]
                },
                {
                    test: /\.css$/,
                    use: (devMode ? ['css-hot-loader'] : []).concat([
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                url: true,
                                minimize: true,
                                sourceMap: true
                            }
                        }
                    ])
                },
                {
                    test: /\.less$/,
                    use: (devMode ? ['css-hot-loader'] : []).concat([
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                url: true,
                                minimize: true,
                                sourceMap: true
                            }
                        },
                        "less-loader"
                    ])
                },
                {
                    test: /\.(gif|ico|jpe?g|png|svg)(\?\S*)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            /* * 【改动】：图片小于2kb的按base64打包 */
                            limit: 2048,
                            name: './images/[name].[ext]'
                        }
                    }],
                },
                {
                    test: /\.(eot|ttf|woff|woff2|otf)(\?\S*)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            /* * 【改动】：图片小于2kb的按base64打包 */
                            limit: 2048,
                            name: './images/[name].[ext]'
                        }
                    }]
                },
                {
                    test: /\.(html|tpl)$/,
                    loader: 'html-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.json', '.vue'],
            alias: {
                '@': path.resolve(__dirname, "../src"),
                '@images': path.resolve(__dirname, "../src/assets/images")
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
            new HtmlWebpackPlugin({
                template: './src/views/index.ejs',
                filename: './index.html',
                title: "",
                favicon: "",
                inject: false,
                hash: true
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': mode == 'development' ? '"development"' : '"production"'
            }),
        ],
        target: "electron-renderer"
    }
}
module.exports = getConfig;
