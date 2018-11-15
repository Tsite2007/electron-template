/*
Tip:    调试渲染进程（热更新）
Author: tengma
Data:   2018-04-09
 */
const os = require('os');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./webpack.viewRender.config.js')("development");


const url = "localhost";
const port = 8080;
process.env.NODE_ENV = 'development';
webpackDevConfig.entry.main.unshift("webpack-hot-middleware/client?reload=true&" + `http://${url}:${port}`);
webpackDevConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
webpackDevConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackDevConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
webpackDevConfig.output.path = path.join(__dirname, "./");

const compiler = webpack(webpackDevConfig);
compiler.hooks.done.tap("doneCallback",function(stats){
    var compilation=stats.compilation
    Object.keys(compilation.assets).forEach(key => {
        console.log(chalk.blue(key));
    })
    compilation.warnings.forEach(key => {
        console.log(chalk.yellow(key));
    })
    compilation.errors.forEach(key => {
        console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
    })
    console.log(chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + chalk.white("渲染进程初次调试完毕"));

    var cmd = os.platform() == "win32" ? 'explorer' : 'open';
    require('child_process').exec(`${cmd} "http://${url}:${port}"`);
})
new WebpackDevServer(
    compiler, {
        contentBase: webpackDevConfig.output.path,
        publicPath: webpackDevConfig.output.publicPath,
        inline: true,
        hot: true,
        quiet: true,
        // proxy: {
        //     '**/*.do': {
        //         target: 'http://*.*.com',
        //         secure: false,
        //         changeOrigin: true
        //     }
        // }
        setup(app, ctx) {
            app.use(require('webpack-hot-middleware')(compiler));
            app.use(require('connect-history-api-fallback')());
        }
    }
).listen(8080, url, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Listening at http://${url}:${port}`);
});
