/*
Tip:    调试主进程（冷更新）
Author: tengma
Data:   2018-04-09
 */
const os = require('os');
const path = require('path');
const webpack = require('webpack');
const {
    spawn
} = require("child_process");
const electron = require("electron");

const chalk = require("chalk");

process.env.NODE_ENV = "development"; //开发模式
const url = "localhost";
const port = 8080;
//打包主进程
const webpackBuildConfig = require('./webpack.mainRender.config.js');
require("del")(["./app/main.js"]); //删除历史打包数据
const compiler = webpack(webpackBuildConfig);
compiler.run((err, stats) => {
    if (err) {
        console.log(chalk.red(err));
    } else {
        Object.keys(stats.compilation.assets).forEach(key => {
            console.log(chalk.blue(key));
        })
        stats.compilation.warnings.forEach(key => {
            console.log(chalk.yellow(key));
        })
        stats.compilation.errors.forEach(key => {
            console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
        })
        console.log(chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`));

        startElectron();
    }
})

function startElectron() {
    let electronProcess = spawn(electron, [path.join(__dirname, '../app/main.js')]);
    //'--inspect=5858',
    electronProcess.stdout.on('data', data => {
        electronLog(data, 'blue')
    })
    electronProcess.stderr.on('data', data => {
        electronLog(data, 'red')
    })
    electronProcess.on('close', () => {
        process.exit()
    })
}

function electronLog(data, color) {
    let log = ''
    data.toString().split(/\r?\n/).forEach(line => {
        log += `\n${line}`;
    })
    if (/[0-9A-z]+/.test(log)) {
        console.log(
            chalk[color].bold('┏ Electron -------------------') +
            log + "\n"
            chalk[color].bold('┗ ----------------------------')
        )
    }
}
