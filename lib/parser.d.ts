declare type TableContent = {
    head: string[];
    body: string[][];
};
export declare type Artical = {
    type: string;
    content?: string;
    table?: TableContent;
    level?: number;
};
export declare type Articals = Artical[];
export declare function mdParser(input: string): Articals;
export {};
