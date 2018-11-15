/*
Tip:    构建渲染UI
Author: tengma
Data:   2018-04-09
 */
const os = require('os');
const path = require('path');
const chalk = require("chalk");
const webpack = require('webpack');
const webpackBuildConfig = require('./webpack.viewRender.config.js')("production");

require("del")(["./app/views/*"]); //删除历史打包数据
process.env.NODE_ENV = 'production';
const compiler = webpack(webpackBuildConfig);
compiler.run((err, stats)=>{
    if(err){
        console.log(chalk.red(err));
    }else{
        Object.keys(stats.compilation.assets).forEach(key=>{
            console.log(chalk.blue(key));
        })
        stats.compilation.warnings.forEach(key=>{
            console.log(chalk.yellow(key));
        })
        stats.compilation.errors.forEach(key=>{
            console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
        })
        console.log(chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`));
    }
})
