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
function parserProps(tag, line) {
    const [name, desc, type, defaultVal] = line;
    if (type &&
        (type.includes('v-slot') ||
            type.includes('slot') ||
            type.includes('slots') ||
            type.includes('slot-scoped'))) {
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
            type: utils_1.formatType(type || ''),
            kind: 'expression',
        },
    });
}
function formatter(articals, componentName, tagPrefix = '') {
    if (!articals.length) {
        return;
    }
    const tags = [];
    const tag = {
        name: getComponentName(componentName, tagPrefix),
        slots: [],
        events: [],
        attributes: [],
    };
    tags.push(tag);
    const tables = articals.filter((artical) => artical.type === 'table');
    tables.forEach((item) => {
        const { table } = item;
        const prevIndex = articals.indexOf(item) - 1;
        const prevArtical = articals[prevIndex];
        if (!prevArtical || !prevArtical.content || !table || !table.body) {
            return;
        }
        const tableTitle = prevArtical.content;
        if (tableTitle.includes('API')) {
            table.body.forEach((line) => {
                parserProps(tag, line);
            });
            return;
        }
        if (tableTitle.includes('事件') && !tableTitle.includes(componentName)) {
            table.body.forEach((line) => {
                const [name, desc] = line;
                tag.events.push({
                    name: utils_1.removeVersion(name),
                    description: desc,
                });
            });
            return;
        }
        // 额外的子组件
        if (tableTitle.includes(componentName) && !tableTitle.includes('事件')) {
            const childTag = {
                name: getComponentName(tableTitle.replace('.', ''), tagPrefix),
                slots: [],
                events: [],
                attributes: [],
            };
            table.body.forEach((line) => {
                parserProps(childTag, line);
            });
            tags.push(childTag);
            return;
        }
        // 额外的子组件事件
        if (tableTitle.includes(componentName) && tableTitle.includes('事件')) {
            const childTagName = getComponentName(tableTitle.replace('.', '').replace('事件', ''), tagPrefix);
            const childTag = tags.find((item) => item.name === childTagName.trim());
            if (!childTag) {
                return;
            }
            table.body.forEach((line) => {
                const [name, desc] = line;
                childTag.events.push({
                    name: utils_1.removeVersion(name),
                    description: desc,
                });
            });
            return;
        }
    });
    return tags;
}
exports.formatter = formatter;
