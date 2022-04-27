import { log } from "../helper"
import fs from "../utils/fs-extra"
const { exec } = require("child_process")
import { randomBytes, createHash, buf2hex } from '@backbonedao/crypto'

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
  bb.project.name = name || "backbone-app"
  bb.project.description = description || "Backbone App"
  bb.settings.encryption_key = createHash(randomBytes(32))
  await fs.writeFileAsync(dir + "/backbone.json", JSON.stringify(bb, null, 2))

  // install dependencies
  log(`Installing NPM dependencies... (this can take a few minutes)`)
  const cmd = `cd ${dir} && npm install`
  return new Promise((resolve, reject) => {
    const npm = exec(cmd)
    let errors = false
    npm.stderr.on("data", (data) => {
      log(`${data}`, null, 'red')
      if(data.match(/npm ERR/)) errors = true
    })
    npm.stdout.on("data", (data) => {
      log(`${data}`)
    })

    npm.on("close", (code) => {
      resolve(true)
      if(!errors) {
        log('Project initialized!')
        log('\nFor documentation, go to docs (https://devs.backbonedao.com) or have a chat at Discord (https://dsc.gg/backbonedao). Have fun!')
      }
      process.exit(0)
    })
  })
}

process.on('SIGINT', function() {
  console.log("Caught interrupt signal")
  process.exit()
});

export default task
