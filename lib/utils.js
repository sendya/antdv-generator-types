"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePath = exports.getComponentName = exports.formatType = exports.removeVersion = exports.toKebabCase = void 0;
// myName -> my-name
function toKebabCase(input) {
    return input.replace(/[A-Z]/g, (val, index) => (index === 0 ? '' : '-') + val.toLowerCase());
}
exports.toKebabCase = toKebabCase;
// name `v2.0.0` -> name
function removeVersion(str) {
    return str.replace(/`(\w|\.)+`/g, '').trim();
}
exports.removeVersion = removeVersion;
// *boolean* -> boolean
// _boolean_ -> boolean
function formatType(type) {
    return type
        .replace(/(^(\*|_))|((\*|_)$)/g, '')
        .replace('\\', '')
        .replace('\\', '');
}
exports.formatType = formatType;
function getComponentName(name) {
    let title = name
        .split('-')
        .map((it) => it.substring(0, 1) + it.substring(1))
        .join('');
    return title.substring(0, 1).toUpperCase() + title.substring(1);
}
exports.getComponentName = getComponentName;
function normalizePath(path) {
    return path.replace(/\\/g, '/');
}
exports.normalizePath = normalizePath;
