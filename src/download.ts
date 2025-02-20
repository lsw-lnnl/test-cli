import { simpleGit } from 'simple-git'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'
import {packageJson} from './get-package.js'

interface ComponentFile {
  path: string
  content: string
}

export async function downloadComponent(gitUrl: string, componentPath: string, branch: string = 'master'): Promise<ComponentFile[]> {
  // Create temp directory using package name
  const tempDir = path.join(os.tmpdir(), `${packageJson.name}-${Date.now()}`)
  await fs.ensureDir(tempDir)

  try {
    // Clone repository with specified branch
    const git = simpleGit()
    await git.clone(gitUrl, tempDir, ['-b', branch, '--single-branch'])

    // Get component files
    const componentDir = path.join(tempDir, componentPath)
    const files = await getComponentFiles(componentDir)

    // Cleanup
    await fs.remove(tempDir)

    return files
  } catch (error) {
    // Cleanup on error
    await fs.remove(tempDir)
    throw error
  }
}

async function getComponentFiles(componentDir: string): Promise<ComponentFile[]> {
  const files: ComponentFile[] = []

  async function processDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = path.relative(componentDir, fullPath)

      if (entry.isDirectory()) {
        await processDirectory(fullPath)
      } else {
        const content = await fs.readFile(fullPath, 'utf-8')
        files.push({
          path: relativePath,
          content
        })
      }
    }
  }

  await processDirectory(componentDir)
  return files
} 