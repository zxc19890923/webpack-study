/*
  1. 安装webpack
    npm install webpack@5.5.1 webpack-cli@4.2.0 -D // -D安装开发环境
  2. package.json
    script节点下的脚本，可以通过npm run xx来执行，例如：npm run dev
      "scripts": {
        "dev": "webpack"          // 不会执行压缩，只是运行webpack生产文件，打包文件到dist目录
        "dev": "webpack serve"    // webpack自动打包，webpack-dev-server插件(serve)打包生成文件存储在内存中，本地没有打包文件，用做开发启动
        "build": "webpack --mode production" // 项目上线发布，运行该命令，本地生成build文件
        // --mode webpack运行模式 production 生成环境 压缩和性能优化，而且会覆盖webpack.config.js中的mode的值
      }
  3. 默认约定
    默认的打包入口文件为 src -> index.js
    默认的输出文件路径为 dist -> main.js
*/
// html-webpack-plugin插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 打包，先删除dist文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path');                       // node.js中专门操作路径的模块
module.exports = {
  mode: 'development',                              // mode 用来指定构建模式。可选值development | production
  devtool: 'eval-source-map',                       // 开发环境，SourceMap控制台报错行数校验。
  devtool: 'nosources-source-map',                  // 生成环境，为了项目安全，生成环境使用nosources，这样会提供开发代码的报错行，但是console中不会暴露代码。（source-map)暴露代码和错误行
  entry: path.join(__dirname, './src/index.js'),    // 打包入口文件路径
  output: {
    path: path.join(__dirname, './dist'),           // 输出文件的路径
    filename: 'js/index.js'                         // 输出文件名称
  },
  plugins: [
    new HtmlWebpackPlugin({
      template:'./src/index.html',                  // 源文件路径
      filename:'./index.html',                      // 复制、生成虚拟文件路径
      chunks:['main']
    }),
    new CleanWebpackPlugin()
  ],
  devServer: {                                      // webpack-dev-server插件选项配置
    open: true,                                     // 打包以后是否自动启动
    host: 'localhost',                              // 主机地址
    port: 3000,                                     // 启动端口号
  },
  module: {                                         // 所有第三方文件模块匹配规则配置
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader']},                 // 顺序不能颠倒，打包会报错，从后往前面执行的。
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']}, // 顺序不能颠倒，打包会报错，从后往前面执行的。
      // { test: /\.jpg|jpeg|png|gif|bmp$/, use: 'url-loader?limit=10240'},      // 图片地址loader，小图片我们可以给转换为base64，配置参数（limit小于等于10240字节(b),10kb）
      { test: /\.jpg|jpeg|png|gif|bmp$/, use: {
        loader: 'url-loader',
        options: {
          limit: 10240,
          outputPath: 'image'     // 发布打包的时候图片输出到image文件夹中
        }
      }},
      {
        test: /\.js$/,
        exclude: /node_modules/,  // 排除安装包，只转换程序员添加的js文件
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties'] // 插件
          }
        }
      }
    ]
  }
  /*
    4. webpack插件
      1. webpack-dev-server     自动化构建插件 webpack serve 可以启动实时打包的http服务器 localhost:8080访问
        安装：npm install webpack-dev-server@3.11.0 -D
        配置：package.json中 scripts中 "dev": "webpack serve"
        主意：如果不开启自动打包，手动启动会每次替换dist文件，开启实时打包webpack会把生产的文件保存到内存中，默认存储到根目录中，隐藏不可见，但是可以localhost:8080/index.js访问，
            所以需要修改index.html中引入的index.js文件地址 /index.js
      2. html-webpack-plugin    html模板插件
        我们现在访问localhost:8080默认访问的是根目录，所以这个插件可以帮助我们直接访问scr下面的index.html文件。
        安装：npm install html-webpack-plugin@4.5.0 -D
        主意：如果配置完成，启动报错，那么可能是webpack和插件的版本不匹配，webpack写死版本号 5.5.1,删除node_modules重新安装
            index.html头部也不需要自己引入js，插件会自动将js引入到body最后一行。
      3. clean-webpack-plugin 打包自动清理dist目录
        安装：npm install clean-webpack-plugin@3.0.0 -D
  */
  /*
    5. loader：协助webpack处理非.js
      默认webpack只能处理.js文件模块，为了支持其他文件所以需要使用loader加载器处理其他文件
      css-loader     .css
      less-loader    .less
      babel-loader    ES6等高级js语法
      1. css文件loader
        npm i style-loader@2.0.0 css-loader@5.0.1 -D
      2. less文件loader
        npm i less-loader@7.1.0 less@3.12.2 -D
      3. url相关loader
        npm i url-loader@4.1.1 file-loader@6.2.0 -D
      4. ES6语法转换 babel-loader
        npm i babel-loader@8.2.1 @babel/core@7.12.3 @babel/plugin-proposal-class-properties@7.12.1 -D
  */

  /*
    6. 企业项目打包优化
      1. 生成打包报告，根据报告分析具体优化方案
      2. Tree-shaking
      3. 为第三方库启用CDN加载
      4. 配置组件的按需加载
      5. 开启路由懒加载
      6. 定制首页内容，服务器渲染SSR
  */
  /*
    7. Source Map
      定义：信息文件，存储位置信息，代码发布压缩混淆前后对应关系。
      问题：webpack 默认启用SouceMap但是报错行数和开发行数有出入
   */
}