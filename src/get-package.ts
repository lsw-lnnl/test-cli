
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { readFileSync } from 'fs'
import { join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取 package.json
export const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
)

