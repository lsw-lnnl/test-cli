import { simpleGit } from 'simple-git';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { packageJson } from './get-package.js';
export async function downloadComponent(gitUrl, componentPath) {
    // Create temp directory using package name
    const tempDir = path.join(os.tmpdir(), `${packageJson.name}-${Date.now()}`);
    console.log('tempDir', tempDir);
    await fs.ensureDir(tempDir);
    try {
        // Clone repository
        const git = simpleGit();
        await git.clone(gitUrl, tempDir);
        // Get component files
        const componentDir = path.join(tempDir, componentPath);
        const files = await getComponentFiles(componentDir);
        // Cleanup
        await fs.remove(tempDir);
        return files;
    }
    catch (error) {
        // Cleanup on error
        await fs.remove(tempDir);
        throw error;
    }
}
async function getComponentFiles(componentDir) {
    const files = [];
    async function processDirectory(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(componentDir, fullPath);
            if (entry.isDirectory()) {
                await processDirectory(fullPath);
            }
            else {
                const content = await fs.readFile(fullPath, 'utf-8');
                files.push({
                    path: relativePath,
                    content
                });
            }
        }
    }
    await processDirectory(componentDir);
    return files;
}
