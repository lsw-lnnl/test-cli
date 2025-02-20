import { simpleGit } from 'simple-git'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'
import {packageJson} from './get-package.js'
import chalk from 'chalk'

export interface ComponentFile {
  path: string
  content: string
}

export interface DownloadResult {
  files: ComponentFile[]
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

export async function downloadComponent(gitUrl: string, componentPath: string, branch: string = 'master'): Promise<DownloadResult> {
  const tempDir = path.join(os.tmpdir(), `${packageJson.name}-${Date.now()}`)
  await fs.ensureDir(tempDir)

  try {
    // Clone repository with specified branch
    const git = simpleGit()
    await git.clone(gitUrl, tempDir, ['-b', branch, '--single-branch'])

    // Get component files
    const componentDir = path.join(tempDir, componentPath)
    const files = await getComponentFiles(componentDir)

    // 获取项目根目录的package.json
    const packageJsonPath = path.join(tempDir, 'package.json')
    let dependencies: Record<string, string> = {}
    let devDependencies: Record<string, string> = {}
    
    if (await fs.pathExists(packageJsonPath)) {
      const pkgJson = await fs.readJson(packageJsonPath)
      dependencies = pkgJson.dependencies || {}
      devDependencies = pkgJson.devDependencies || {}
    } else {
      console.log(chalk.yellow('Warning: No package.json found in project root'))
    }

    // Cleanup
    await fs.remove(tempDir)

    return {
      files,
      dependencies,
      devDependencies
    }
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