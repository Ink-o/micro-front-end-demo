const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const { getConfig } = require('../config')

class DevServer {
  async setup() {
    await this.startServer()
  }
  async startServer() {
    const config = getConfig()
    // 创建一个 webpack
    const compiler = webpack(config)
    // 启动 webpackDevServer
    this.server = new WebpackDevServer(config.devServer, compiler)
    this.server.start()
  }
}
module.exports = new DevServer()