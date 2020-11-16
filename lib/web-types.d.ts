import { VueTag, Options } from './type';
export declare function genWebTypes(tags: VueTag[], options: Options): {
    $schema: string;
    framework: string;
    name: string;
    version: string;
    contributions: {
        html: {
            tags: VueTag[];
            attributes: never[];
            'types-syntax': string;
        };
    };
};
