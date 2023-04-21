#! /usr/bin/env node
// 启动实例：zmp -t https://static.zhufengpeixun.com/template_1680930323773.json

// 使用 node 来执行这段脚本
// 课上笔记：http://zhufengpeixun.com/strong/html/163.emp.html#t163.1%20%E5%AE%89%E8%A3%85%E4%BE%9D%E8%B5%96

// 引入 commander 用来处理命令行参数和选项 --help
const program = require('commander')
const pkg = require('../package.json')
const cli = require('../cli')

// 设置当前脚手架版本号
program
  .version(pkg.version, '-v,--version')
  .usage('<command> [options]') // 使用命令行+选项的方式

// 创建一个 init 命令
program
  .command('init')
  .description('创建项目')
  .option('-t,--template [template]', 'JSON数据 HTTP地址或者是文件的相对或绝对路径')
  .action((options) => {
    console.log('options: ', options);
    cli.exec('init', options)
  })

// 创建一个 dev 命令
// 这个命令是在子应用里面执行的
program
  .command('dev')
  .description('启动开发服务器')
  .option('-t, --template [template]', 'JSON数据 HTTP的地址或者是文件的相对或绝对路径')
  .action((options => {
    cli.exec('dev', options)
  }))
program.parse(process.argv)