/*
Tip:    构建整个项目
Author: tengma
Data:   2018-04-09
 */

const os = require('os');
const path = require('path');
const fs = require('fs');
const stat = fs.stat;
const chalk = require("chalk");
const webpack = require('webpack');
const nodeCmd = require('node-cmd');
const build = require("electron-builder");
const mainRenderConfig = require('./webpack.mainRender.config.js');
const viewRenderConfig = require('./webpack.viewRender.config.js')("production");
const FsWebpackPlugin = require("./fsWebpackPlugin.js")
var filePlus=new FsWebpackPlugin(path.join(process.cwd(),"./"));
require("del")(["./app/main.js"]); //删除历史打包数据
require("del")(["./app/views/*"]); //删除历史打包数据

process.env.NODE_ENV = 'production'; //'development';//

function mainRenderBuild() {
  return new Promise((resolve, reject) => {
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

function viewRenderBuild() {
  return new Promise((resolve, reject) => {
    console.log("打包APP渲染进程......");
    let log = "";
    var routers = require("../src/views/router.js");
    const viewRenderCompiler = webpack(viewRenderConfig);
    viewRenderCompiler.run((err, stats) => {
      if (err) {
        console.log("打包APP渲染进程遇到Error！");
        reject(chalk.red(err));
      } else {

        stats.compilation.errors.forEach(key => {
          log += chalk.red(`${key}:${stats.compilation.errors[key]}`) + "\n";
        })

        stats.compilation.warnings.forEach(key => {
          log += chalk.yellow(key) + "\n";
        })

        Object.keys(stats.compilation.assets).forEach(key => {
          log += chalk.blue(key) + "\n";
        })
        console.log(stats.compilation.errors,stats.compilation.warnings);
        var outputPath = viewRenderConfig.output.path;
        var indexPath = path.join(outputPath, "index.html");
        var indexFile = filePlus.readFile(indexPath, "utf-8",true);
        routers.forEach(item => {
          var s = filePlus.writeFile(path.join(outputPath, item.path), indexFile,true);
        })
        log += chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + "\n";
        console.log("打包APP渲染进程完毕！");
        resolve(log);
      }
    })
  })
}

Promise.all([mainRenderBuild(), viewRenderBuild()]).then(resolve => {
    resolve.forEach(res => {
      console.log(res);
    })

  build.build();
}).catch(err => {
  console.log(err);
  process.exit();
})
