"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatter = void 0;
const utils_1 = require("./utils");
function getComponentName(name, tagPrefix) {
    if (name) {
        return tagPrefix + utils_1.toKebabCase(name.split(' ')[0]);
    }
    return '';
}
function formatter(articals, componentName, tagPrefix = '') {
    if (!articals.length) {
        return;
    }
    const tag = {
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
                    tag.slots.push({
                        name: utils_1.removeVersion(name),
                        description: desc,
                    });
                }
                tag.attributes.push({
                    name: utils_1.removeVersion(name),
                    default: defaultVal,
                    description: desc,
                    value: {
                        type: utils_1.formatType(type),
                        kind: 'expression',
                    },
                });
            });
            return;
        }
        if (tableTitle.includes('事件')) {
            table.body.forEach(line => {
                const [name, desc] = line;
                tag.events.push({
                    name: utils_1.removeVersion(name),
                    description: desc,
                });
            });
            return;
        }
    });
    return tag;
}
exports.formatter = formatter;
