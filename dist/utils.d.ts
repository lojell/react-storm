export declare function decycle(obj: any, stack?: any[]): any;
export declare function compareObjects(a: Object, b: Object): boolean;
export declare function promsify(fn: () => unknown | void): Promise<any>;
export declare function shorid(): string;
export declare function useLock(): (handler: () => void) => void;
