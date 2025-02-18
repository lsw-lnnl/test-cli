import { simpleGit } from 'simple-git'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'

interface ComponentFile {
  path: string
  content: string
}

export async function downloadComponent(gitUrl: string, componentPath: string): Promise<ComponentFile[]> {
  // Create temp directory
  const tempDir = path.join(os.tmpdir(), 'component-cli-' + Date.now())
  console.log('tempDir', tempDir)
  await fs.ensureDir(tempDir)

  try {
    // Clone repository
    const git = simpleGit()
    await git.clone(gitUrl, tempDir)

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