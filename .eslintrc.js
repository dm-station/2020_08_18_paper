
// https://eslint.bootcss.com/docs/user-guide/configuring

module.exports = {
  // 此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,

  // 此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
  parser: 'babel-eslint',

  // 指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指模块导入方式
  parserOptions: {
    // ecmaVersion: 11,
    sourceType: 'module'
  },
  //   指定环境的全局变量
  env: {
    browser: true,
    es6: true,
    node: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  // 此项是用来配置标准的js风格
  extends: [
    // 'plugin:vue/essential',
    // 'plugin:vue/recommended',
    'standard'
  ],
  // 此项是用来提供插件的，插件名称省略了eslint-plugin-
  // plugins: ['vue'],
  plugins: ['html'],
  /*
    下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
    主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
    "off" -> 0 关闭规则
    "warn" -> 1 开启警告规则
    "error" -> 2 开启错误规则
    */
  rules: {
    // 'no-tabs': 0,
    'spaced-comment': 2,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  // 绑定全局变量
  globals: {
    App: true,
    Page: true,
    WeixinJSBridge:true,
    $: true,
    JSMpeg: true,
    isPlay:true,
    Swiper:true,
    BHDmp:true,
    wx:true
  }
}
