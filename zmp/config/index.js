const path = require('path')
const WebpackChain = require('webpack-chain')
const htmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

function processDefault(empConfig) {
  // remote 8001，host 8002
  const devServer = empConfig.server || {}
  // webpack 配置中没有server这个选项，所以要去掉？
  delete empConfig.server
  // 创建模块联邦选项对象
  const mfOptions = {
    filename: 'emp.js', // 指定当前容器对了对外提供模块联邦的服务，生成的单独的文件emp.js
    ...empConfig.empShare
  }
  delete empConfig.empShare
  // 现在用的是 webpack-chain 的配置文件，不是真正的webpack配置文件，所以说写法跟webpack不太一样
  return {
    context: process.cwd(), // 项目根目录
    mode: 'development', // 指定开发模式
    devtool: false,
    devServer,
    plugin: {
      html: {
        plugin: htmlWebpackPlugin, // 插件的构造函数
        args: [
          {
            template: path.join(__dirname, '../template/index.html')
          }
        ]
      },
      mf: {
        plugin: webpack.container.ModuleFederationPlugin,
        args: [mfOptions]
      }
    },
    module: {
      rule: {
        compile: {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: {
            'babel-loader': {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  require.resolve('@babel/preset-env'),
                  require.resolve('@babel/preset-react'),
                ]
              }
            }
          }
        }
      }
    },
    ...empConfig
  }
}

exports.getConfig = () => {
  // webpack 链式调用
  const Config = new WebpackChain()
  const empConfigPath = path.resolve(process.cwd(), 'emp-config.js')
  const empConfig = require(empConfigPath)
  const afterConfig = processDefault(empConfig)
  Config.merge(afterConfig)
  // 把 chain 对象转成一个 webpack 配置对象
  console.log('Config.toString', Config.toConfig());
  return Config.toConfig()
}

// EMP的核心功能就是帮你配了一套webpack配置文件