const { parseAndWrite } = require('./lib/index.js')

parseAndWrite({
  version: '1.0.0',
  name: 'types',
  path: '/home/sendya/projects/vueComponent/v2-doc/src/docs',
  test: /zh-CN\.md/,
  outputDir: './types',
  tagPrefix: 'a-',
})
