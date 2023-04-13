module.exports = {
  webpack: (config) => {
    config.output.libraryTarget = 'umd' // 设置打包的格式为 umd
    config.output.library = 'm-react'

    return config
  },
  devServer: (config) => {
    config.headers = {
      'Access-control-Allow-Origin': '*'
    }
    return config
  }
}