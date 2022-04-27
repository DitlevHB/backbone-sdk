import fs from './fs-extra'

export default (dir) => {
  const files = fs.readdirSync(dir)
  return files.length
}