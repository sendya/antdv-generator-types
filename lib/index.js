"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAndWrite = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = require("path");
const parser_1 = require("./parser");
const formatter_1 = require("./formatter");
const web_types_1 = require("./web-types");
const fs_extra_1 = require("fs-extra");
const utils_1 = require("./utils");
const vetur_1 = require("./vetur");
async function readMarkdown(options) {
    // const mds = await glob(normalizePath(`${options.path}/**/*.md`))
    const mds = await fast_glob_1.default(utils_1.normalizePath(`${options.path}/**/*.md`));
    return mds
        .filter((md) => options.test.test(md))
        .map((path) => {
        const docPath = path_1.dirname(path);
        const componentName = docPath.substring(docPath.lastIndexOf('/') + 1);
        return {
            componentName: utils_1.getComponentName(componentName || ''),
            md: fs_extra_1.readFileSync(path, 'utf-8'),
        };
    });
}
async function parseAndWrite(options) {
    if (!options.outputDir) {
        throw new Error('outputDir can not be empty.');
    }
    const docs = await readMarkdown(options);
    const datas = docs
        .map((doc) => formatter_1.formatter(parser_1.mdParser(doc.md), doc.componentName, options.tagPrefix))
        .filter((item) => item);
    const tags = [];
    datas.forEach((arr) => {
        tags.push(...arr);
    });
    const webTypes = web_types_1.genWebTypes(tags, options);
    const veturTags = vetur_1.genVeturTags(tags);
    const veturAttributes = vetur_1.genVeturAttributes(tags);
    fs_extra_1.outputFileSync(path_1.join(options.outputDir, 'tags.json'), JSON.stringify(veturTags, null, 2));
    fs_extra_1.outputFileSync(path_1.join(options.outputDir, 'attributes.json'), JSON.stringify(veturAttributes, null, 2));
    fs_extra_1.outputFileSync(path_1.join(options.outputDir, 'web-types.json'), JSON.stringify(webTypes, null, 2));
}
exports.parseAndWrite = parseAndWrite;
exports.default = { parseAndWrite };
