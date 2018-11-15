/*
Tip:    构建APP
Author: tengma
Data:   2018-04-09
 */

const os = require('os');
const path = require('path');
const chalk = require("chalk");
const webpack = require('webpack');
const build = require("electron-builder");
const mainRenderConfig = require('./webpack.mainRender.config.js');

require("del")(["./app/main.js"]); //删除历史打包数据

process.env.NODE_ENV = 'production';

async function mainRenderBuild() {
    return await new Promise((resolve, reject) => {
        console.log("打包APP主进程......");
        let log = "";
        const mainRenderCompiler = webpack(mainRenderConfig);
        mainRenderCompiler.run((err, stats) => {
            if (err) {
                console.log("打包APP主进程遇到Error！");
                reject(chalk.red(err));
            } else {
                Object.keys(stats.compilation.assets).forEach(key => {
                    log += chalk.blue(key) + "\n";
                })
                stats.compilation.warnings.forEach(key => {
                    log += chalk.yellow(key) + "\n";
                })
                stats.compilation.errors.forEach(key => {
                    log += chalk.red(`${key}:${stats.compilation.errors[key]}`) + "\n";
                })
                log += chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + "\n";
                console.log("打包APP主进程完毕！");
                resolve(log);
            }
        })
    })
}

mainRenderBuild().then(resolve => {
    build.build();
}).catch(reject => {
    console.log(reject);
    process.exit();
})
