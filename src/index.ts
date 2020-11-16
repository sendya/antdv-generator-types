import glob from 'fast-glob';
import { join, dirname, basename } from 'path';
import { mdParser } from './parser';
import { formatter } from './formatter';
import { genWebTypes } from './web-types';
import { readFileSync, outputFileSync } from 'fs-extra';
import { Options, VueTag } from './type';
import { normalizePath, getComponentName } from './utils';
import { genVeturTags, genVeturAttributes } from './vetur';

async function readMarkdown(options: Options) {
  console.log('fetch docs path', normalizePath(`${options.path}/**/*.md`));
  const mds = await glob(normalizePath(`${options.path}/**/*.md`));
  return mds
    .filter(md => options.test.test(md))  
    .map(path => {
      const docPath = dirname(path);
      const componentName = docPath.substring(docPath.lastIndexOf('/') + 1);
      return {
        componentName: getComponentName(componentName || ''),
        md: readFileSync(path, 'utf-8')
      }
    });
}

export async function parseAndWrite(options: Options) {
  if (!options.outputDir) {
    throw new Error('outputDir can not be empty.');
  }

  const docs = await readMarkdown(options);
  // console.log('doc[0]', docs[0]);

  // const doc = docs[0];
  // const parsered = mdParser(doc.md);
  // console.log('parsered', JSON.stringify(parsered, null, 4));
  // const formattered = formatter(parsered, doc.componentName, options.tagPrefix);
  // console.log('formattered', formattered);

  const datas = docs
    .map(doc => formatter(mdParser(doc.md), doc.componentName, options.tagPrefix))
    .filter(item => !!item) as VueTag[];

  const webTypes = genWebTypes(datas, options);
  const veturTags = genVeturTags(datas);
  const veturAttributes = genVeturAttributes(datas);

  outputFileSync(
    join(options.outputDir, 'tags.json'),
    JSON.stringify(veturTags, null, 2)
  );
  outputFileSync(
    join(options.outputDir, 'attributes.json'),
    JSON.stringify(veturAttributes, null, 2)
  );
  outputFileSync(
    join(options.outputDir, 'web-types.json'),
    JSON.stringify(webTypes, null, 2)
  );
}

export default { parseAndWrite };
