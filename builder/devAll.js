/*
Tip:    调试UI进程及APP进程
Author: tengma
Data:   2018-04-09
 */
const os = require('os');
const path = require('path');
const http = require('http')
const repl = require('repl');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const allRouter= require('../src/views/router.js');
const {spawn} = require("child_process");
const electron = require("electron");

const chalk = require("chalk");

process.env.NODE_ENV = "development"; //开发模式
const url = "localhost";
const port = 8080;
let electronProcess = null;

function getIndex(res){
    http.get(`http://${url}:${port}`, function(response) {
        var Data = '';
        response.on('data', function(data) { //加载到内存
            Data += data;
        }).on('end', function() { //加载完
            res.send(Data)
        })
    })
}
//构建渲染代码
function devRenderer() {
    return new Promise((resolve, reject) => {
        console.log("启动渲染进程调试......");
        const webpackDevConfig = require('./webpack.viewRender.config.js')("development");
        webpackDevConfig.entry.main.unshift("webpack-hot-middleware/client?reload=true&" + `http://${url}:${port}`);
        webpackDevConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
        webpackDevConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        webpackDevConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
        webpackDevConfig.output.path = path.join(__dirname, "./");

        const compiler = webpack(webpackDevConfig);
        compiler.hooks.done.tap("doneCallback", function(stats) {
            var compilation = stats.compilation
            Object.keys(compilation.assets).forEach(key => {
                console.log(chalk.blue(key));
            })
            compilation.warnings.forEach(key => {
                console.log(chalk.yellow(key));
            })
            compilation.errors.forEach(key => {
                console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
            })
            console.log(chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + chalk.white("渲染进程调试完毕"));
            resolve("");
        })
        const server = new WebpackDevServer(
            compiler, {
                contentBase: webpackDevConfig.output.path,
                publicPath: webpackDevConfig.output.publicPath,
                inline: true,
                hot: true,
                quiet: true,
                setup(app, ctx) {
                    app.use(require('webpack-hot-middleware')(compiler));
                    app.use(require('connect-history-api-fallback')());
                    allRouter.forEach(item=>{
                        console.log(item.path);
                        app.get(item.path, (req, res, next) => {
                            getIndex(res);
                        })
                    });
                }
            }
        ).listen(8080, url, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`Listening at http://${url}:${port}`);
        });
    })
}

//打包主进程
function buildMainRender() {
    return new Promise((resolve, reject) => {
        console.log("启动主进程渲染......");
        const webpackBuildConfig = require('./webpack.mainRender.config.js');
        require("del")(["./app/main.js"]); //删除历史打包数据
        const compiler = webpack(webpackBuildConfig);
        compiler.run((err, stats) => {
            if (err) {
                console.log(chalk.red(err));
                reject();
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
                console.log(chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s  `) + chalk.white("主进程打包完毕"));
                resolve();
            }
        })
    });
}

function build() {
    let results = "";

    Promise.all([devRenderer(), buildMainRender()]).then(msg => {
        startElectron();
    }).catch(err => {
        console.log("=======>", err);
        process.exit();
    })
}

function startElectron() {
    electronProcess = spawn(electron, [path.join(__dirname, '../app/main.js')]);
    //'--inspect=5858',
    electronProcess.stdout.on('data', data => {
        electronLog(data, 'blue')
    })
    electronProcess.stderr.on('data', data => {
        electronLog(data, 'red')
    })
    electronProcess.on('close', () => {
        //process.exit()
        callRepl("Electron Closed");
    })
}

//调出交互模块
function callRepl(tipText) {
    var tip = `${tipText}，reStart?(${chalk.green("Y")}/n)`;
    const r = repl.start({
        prompt: tip,
        eval: (cmd, context, filename, callback) => {
            if (cmd == "" || cmd == "\n" || cmd == "Y\n" || cmd == "y\n") {
                console.log("\n重新进行APP调试...");
                r.close();
                reBuildApp();
            } else {
                process.exit();
            }
            callback(null);
        }
    });
}

function reBuildApp() {
    buildMainRender().then(ok => {
        startElectron();
    }).catch(err => {
        callRepl(err);
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
            log +
            chalk[color].bold('┗ ----------------------------')
        )
    }
}
build();
