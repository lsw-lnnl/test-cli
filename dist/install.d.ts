interface ComponentFile {
    path: string;
    content: string;
}
export declare function installComponent(files: ComponentFile[], targetDir: string): Promise<void>;
export {};
