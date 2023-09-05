const { defineConfig } = require('@vue/cli-service')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: '4001'
  },
  configureWebpack: {
    mode: 'development',
    plugins: [
      new ModuleFederationPlugin({
        name: 'consumer',
        filename: 'vuehost.js',
        remotes: {
          vue2HelloWorld: 'vue2HelloWorld@http://localhost:4000/vue2HelloWorld.js',
        },
        shared: require('./package.json').dependencies
      })
    ],
  }
})
