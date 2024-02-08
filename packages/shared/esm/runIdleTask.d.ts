type TaskCallback = () => void;
export declare const requestIdleCallback: ((callback: IdleRequestCallback, options?: IdleRequestOptions | undefined) => number) & typeof globalThis.requestIdleCallback;
export declare const runIdleTask: (task: TaskCallback) => void;
export {};
