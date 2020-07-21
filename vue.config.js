const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve(dir) {
  return path.join(__dirname, dir)
}

/**
 * check production or preview(pro.loacg.com only)
 * @returns {boolean}
 */
function isProd() {
  return process.env.NODE_ENV === 'production'
  // return process.env.NODE_ENV === 'http://jleco.jl-shgroup.com'
}

const assetsCDN = {
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// webpack build externals
const prodExternals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios'
}
let host = ''
// vue.config.js
const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    // if prod is on, add externals
    externals: isProd() ? prodExternals : {}
  },

  chainWebpack: (config) => {
    console.log(config)
    if (process.env.NODE_ENV === 'production') {
      if (process.env.VUE_APP_TITLE === 'test') {
        host = process.env.VUE_APP_SERVER_URL
        console.log(111)
        console.log(process.env.VUE_APP_SERVER_URL)
      } else if (process.env.VUE_APP_TITLE === 'prod') {
        host = process.env.VUE_APP_SERVER_URL
        console.log(222)
        console.log(process.env.VUE_APP_SERVER_URL)
      } else if (process.env.VUE_APP_TITLE === 'local') {
        host = process.env.VUE_APP_SERVER_URL
        console.log(333)
        console.log(process.env.VUE_APP_SERVER_URL)
      } else {
        host = process.env.VUE_APP_SERVER_URL
        console.log(444)
        console.log(process.env.VUE_APP_SERVER_URL)
      }
    }
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    if (isProd()) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          'primary-color': '#00ccff',
          'link-color': '#00ccff',
          'border-radius-base': '4px'
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/server': {            //这里的key就是axios的baseURL
        // target: 'http://demo-jleco-river.jl-shgroup.com/server/',    //访问域名http://www.qfii.club
        target: host + '/server/',    //访问域名http://www.qfii.club
        changeOrigin: true,            //开启跨域
        pathRewrite: {  // 路径重写，
          '^/server': ''  // 替换target中的请求地址
        }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
