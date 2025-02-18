import fs from 'fs-extra'
import path from 'node:path'
import chalk from 'chalk'

interface ComponentFile {
  path: string
  content: string
}

export async function installComponent(files: ComponentFile[], targetDir: string): Promise<void> {
  // Ensure target directory exists
  await fs.ensureDir(targetDir)

  // Install each file
  for (const file of files) {
    const targetPath = path.join(targetDir, file.path)
    
    // Create parent directories if needed
    await fs.ensureDir(path.dirname(targetPath))

    // Write file
    await fs.writeFile(targetPath, file.content)
    console.log(chalk.green(`Installed: ${targetPath}`))
  }
} 