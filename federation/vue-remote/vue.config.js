const { defineConfig } = require('@vue/cli-service')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin
module.exports = defineConfig({
  publicPath: 'http://localhost:4000',
  transpileDependencies: true,
  devServer: {
    port: '4000'
  },
  configureWebpack: {
    mode: 'development',
    plugins: [
      new ModuleFederationPlugin({
        name: 'vue2HelloWorld',
        filename: 'vue2HelloWorld.js',
        library: {
          type: 'var',
          name: 'vue2HelloWorld'
        },
        exposes: {
          './HelloWorld': './src/components/HelloWorld',
          './MyButton': './src/components/MyButton'
        },
        shared: require('./package.json').dependencies
      })
    ]
  }
})
