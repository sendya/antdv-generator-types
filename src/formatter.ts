/* eslint-disable no-continue */
import { Artical, Articals } from './parser';
import { formatType, removeVersion, toKebabCase } from './utils';
import { VueTag } from './type';

function getComponentName(name: string, tagPrefix: string) {
  if (name) {
    return tagPrefix + toKebabCase(name.split(' ')[0]);
  }
  return '';
}

export function formatter(articals: Articals, componentName: string, tagPrefix: string = '') {
  if (!articals.length) {
    return;
  }

  const tag: VueTag = {
    name: getComponentName(componentName, tagPrefix),
    slots: [],
    events: [],
    attributes: [],
  };

  const tables = articals.filter(artical => artical.type === 'table');

  tables.forEach(item => {
    const { table } = item;
    const prevIndex = articals.indexOf(item) - 1;
    const prevArtical = articals[prevIndex];

    if (!prevArtical || !prevArtical.content || !table || !table.body) {
      return;
    }

    const tableTitle = prevArtical.content;

    if (tableTitle.includes('API')) {
      table.body.forEach(line => {
        const [name, desc, type, defaultVal] = line;
        if (type.includes('v-slot') || type.includes('slot') || type.includes('slots')) {
          tag.slots!.push({
            name: removeVersion(name),
            description: desc,
          })
        }
        tag.attributes!.push({
          name: removeVersion(name),
          default: defaultVal,
          description: desc,
          value: {
            type: formatType(type),
            kind: 'expression',
          },
        });
      });
      return;
    }

    if (tableTitle.includes('事件')) {
      table.body.forEach(line => {
        const [name, desc] = line;
        tag.events!.push({
          name: removeVersion(name),
          description: desc,
        });
      });
      return;
    }
  });

  return tag;
}
