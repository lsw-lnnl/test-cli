interface ComponentFile {
    path: string;
    content: string;
}
export declare function downloadComponent(gitUrl: string, componentPath: string, branch?: string): Promise<ComponentFile[]>;
export {};
