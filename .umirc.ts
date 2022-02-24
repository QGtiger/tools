import { defineConfig } from 'dumi';

export default defineConfig({
  title: '@lightfish/tools',
  favicon:
    'http://qnpic.top/favicon.png',
  logo: 'http://qnpic.top/favicon.png',
  outputPath: 'docs-dist',
  mode: 'site',
  // more config: https://d.umijs.org/config，
  define: {
    PACKAGENAME: '@lightfish/tools'
  },
  dynamicImport: false, // 是否按需加载
  externals: {}, // 那些模块不被打包
  metas: [
    {
      nmae: 'keywords',
      content: 'tools @lightfish, dumi'
    },
    {
      name: 'description',
      content: '工具'
    }
  ],
  base: process.env.NODE_ENV === 'production' ? '/tools' : '/', //
  publicPath: process.env.NODE_ENV === 'production' ? '/tools/' : '/'
});
