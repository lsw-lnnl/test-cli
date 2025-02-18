import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
export async function installComponent(files, targetDir) {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);
    // Install each file
    for (const file of files) {
        const targetPath = path.join(targetDir, file.path);
        // Create parent directories if needed
        await fs.ensureDir(path.dirname(targetPath));
        // Write file
        await fs.writeFile(targetPath, file.content);
        console.log(chalk.green(`Installed: ${targetPath}`));
    }
}
