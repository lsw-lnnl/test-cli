interface ComponentFile {
    path: string;
    content: string;
}
export declare function downloadComponent(gitUrl: string, componentPath: string): Promise<ComponentFile[]>;
export {};
