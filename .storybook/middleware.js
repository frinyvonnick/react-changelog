const proxy = require('http-proxy-middleware')

module.exports = function expressMiddleware (router) {
  router.use('/markdowns', proxy({
  target: 'http://localhost:5000/',
    changeOrigin: true
  }))
}
