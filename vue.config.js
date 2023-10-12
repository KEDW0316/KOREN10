const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: '/sneat/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://61.252.59.31:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
});
