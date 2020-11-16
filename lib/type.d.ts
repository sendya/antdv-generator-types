/// <reference types="node" />
import { PathLike } from 'fs';
export declare type VueSlot = {
    name: string;
    description: string;
};
export declare type VueEventArgument = {
    name: string;
    type: string;
};
export declare type VueEvent = {
    name: string;
    description?: string;
    arguments?: VueEventArgument[];
};
export declare type VueAttribute = {
    name: string;
    default: string;
    description: string;
    value: {
        kind: 'expression';
        type: string;
    };
};
export declare type VueTag = {
    name: string;
    slots?: VueSlot[];
    events?: VueEvent[];
    attributes?: VueAttribute[];
    description?: string;
};
export declare type VeturTag = {
    description?: string;
    attributes: string[];
};
export declare type VeturTags = Record<string, VeturTag>;
export declare type VeturAttribute = {
    type: string;
    description: string;
};
export declare type VeturAttributes = Record<string, VeturAttribute>;
export declare type VeturResult = {
    tags: VeturTags;
    attributes: VeturAttributes;
};
export declare type Options = {
    name: string;
    path: PathLike;
    test: RegExp;
    version: string;
    outputDir?: string;
    tagPrefix?: string;
};
