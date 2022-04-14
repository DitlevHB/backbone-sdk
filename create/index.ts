import { log } from "../helper"
import fs from "../utils/fs-extra"
const { exec } = require("child_process")

async function task(opts: {
  dir: string
  name?: string
  description?: string
}) {
  const { dir, name, description } = { ...opts }

  // copy directory template over
  log(`Copying files to ${dir}...`)
  await fs.copyDirAsync(__dirname + "/template/", dir)

  // edit project detail files
  const pkg = require(dir + "/package.json")
  pkg.name = name || "backbone-app"
  pkg.description = description || "Backbone App"
  await fs.writeFileAsync(dir + "/package.json", JSON.stringify(pkg, null, 2))

  const bb = require(dir + "/backbone.json")
  bb.name = name || "backbone-app"
  bb.description = description || "Backbone App"
  await fs.writeFileAsync(dir + "/backbone.json", JSON.stringify(bb, null, 2))

  // install dependencies
  log(`Installing NPM dependencies... (this can take a few minutes)`)
  const cmd = `cd ${dir} && npm install`
  return new Promise((resolve, reject) => {
    const npm = exec(cmd)

    npm.stderr.on("data", (data) => {
      log(`${data}`, null, 'red')
    })

    npm.on("close", (code) => {
      resolve(true)
      log('Project initialized!')
      log('\nFor documentation, go to https://devs.backbonedao.com. Have fun!')
      process.exit(0)
    })
  })
}

export default task
