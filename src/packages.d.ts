declare module '*.less' {
    const map: Record<string, string>;

    export = map;
}

declare module '@editorjs/*' {
    const Plugin: import('react').ComponentClass;

    export default Plugin;
}
