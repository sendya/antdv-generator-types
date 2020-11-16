const { parseAndWrite } = require('./lib/index.js');

parseAndWrite({
    version: '1.0.0',
    name: 'types',
    path: 'D:\\sendya\\vueComponent\\antdv-demo\\docs',
    test: /zh-CN\.md/,
    outputDir: './types',
    tagPrefix: 'a-',
});
