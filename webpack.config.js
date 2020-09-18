// node用于处理文件路径的模块
const path = require('path')
// 清空文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
// html
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 压缩js插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// 图片压缩插件
// const imageminMozjpeg = require('imagemin-mozjpeg')
// const imageminPngquant = require('imagemin-pngquant')
// var ImageminPlugin = require('imagemin-webpack-plugin').default
// 提取css到单独文件的插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 复制资源---放在HtmlWebpackPlugin下面
const CopyWebpackPlugin = require('copy-webpack-plugin')

const title = 'by：动壹科技' + '\n' + 'author：铭' + '\n' + 'E-mail：834777406@qq.com' + '\n' + `Date：` + new Date().toLocaleDateString()

// 接收NODE_ENV变量
const isProduction = process.env.NODE_ENV === 'production'
console.log('NODE_ENV：', process.env.NODE_ENV, isProduction)

module.exports = {
  // 入口
  entry: {
    main: './src/js/main.js'
  },
  // 出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    // [name]key值，[chunkhash]哈希值
    filename: 'js/[name].js'
    // 绝对路径，会替换path
    // publicPath:'https://cdn.com/'
    // __dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录
  },
  module: {
    rules: [
      // 提取img并更正引用地址
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              // name: '[path][name].[ext]',
              // publicPath: 'assets/',
              // 输出路径
              outputPath: 'img/',
              // 是否生成文件
              emitFile: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 一定要放在HtmlWebpackPlugin文件前面
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin(title),
    // new HtmlWebpackPlugin({
    //   // 标题配置--使用：<%=HtmlWebpackPlugin .options.title%>
    //   // title:'title',
    //   // 生成到页面顶部，body
    //   // injectL'head',
    //   // 输出文件，dist生成的html文件
    //   // filename: 'index.html',
    //   // 输入文件，获取的html文件
    //   // template: './src/index3.html',
    //   minify: {
    //     // 是否去掉注释
    //     removeComments: isProduction,
    //     // 是否去掉空格
    //     collapseWhitespace: isProduction
    //   }
    // }),

    // 分离js中的css
    new MiniCssExtractPlugin({
      // 提到css目录中
      filename: './css/[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    }),
    new CopyWebpackPlugin([
      {
        // 打包的静态资源目录地址
        from: path.resolve(__dirname, 'src'),
        // 打包到dist文件夹
        to: path.resolve(__dirname, 'dist'),
        // 忽略文件
        ignore: ['main.js']
      }
    ])
  ],
  devServer: {
    // 在哪一个目录启动服务，需要和output.path名称一致
    contentBase: path.join(__dirname, 'dist'),
    // 是否压缩文件
    compress: true,
    // 启动的端口
    port: 8080,
    // 自动打开浏览器，访问地址http://localhost:8080/
    open: false,
    // 服务器代理配置项
    proxy: {

    }
  },
  optimization: {
    minimizer: [new TerserPlugin({
      exclude: /(node_modules|bower_components)/,
      terserOptions: {
        compress: {
          drop_debugger: isProduction,
          // 生产环境自动删除console
          drop_console: isProduction,
          pure_funcs: isProduction ? ['console.log'] : ''
        },
        warnings: false,
        ie8: false
      },
      extractComments: false,
      sourceMap: false,
      // 使用多进程并行运行来提高构建速度
      parallel: true
    })]
  },
  // 解决Child html-webpack-plugin for "index.html"
  stats: { children: false },
  // 声明开发模式
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'none' : 'cheap-module-eval-source-map'
}
