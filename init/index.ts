import { log } from "../helper"
import fs from "../utils/fs-extra"
const { exec } = require("child_process")
// import { randomBytes, createHash, buf2hex } from "@backbonedao/crypto"

async function task({
  dir = "",
  name = "",
  description = "",
  pnpm = false
} = {}) {

  // copy directory template over
  log(`Copying files to ${dir}...`)
  await fs.copy(__dirname + "/template/", dir, { recursive: true })

  // edit project detail files
  const pkg = require(dir + "/package.json")
  pkg.name = name || "backbone-app"
  pkg.description = description || "Backbone App"
  await fs.writeFile(dir + "/package.json", JSON.stringify(pkg, null, 2))

  /* 
  const bb = require(dir + "/backbone.json")
  bb.app.name = name || "backbone-app"
  bb.app.description = description || "Backbone App"
  // bb.settings.encryption_key = createHash(randomBytes(32)).slice(0, 32)
  await fs.writeFile(dir + "/backbone.json", JSON.stringify(bb, null, 2)) 
  */

  // install dependencies
  log(`Installing NPM dependencies... (this can take a few minutes)`)
  const cmd = `cd ${dir} && ${pnpm ? 'pnpm' : 'npm'} install`
  return new Promise((resolve, reject) => {
    const npm = exec(cmd)
    let errors = false
    npm.stderr.on("data", (data) => {
      if (data.match(/npm ERR/)) {
        log(`${data}`, false, "red")
        errors = true
      }
    })
    npm.stdout.on("data", (data) => {
      // log(`${data}`)
    })

    npm.on("close", (code) => {
      resolve(true)
      if (!errors) {
        log("Project initialized 🥳 ^:")
        log(`\n^+Next steps
1. Go to your Id (https://id.backbonedao.com or your own Id instance)
2. Create Id if you don't have one
3. Create new app
4. Download backbone.json and place it in this directory`)
        log(
          "\nFor documentation, go to docs (https://devs.backbonedao.com) or have a chat at Discord (https://dsc.gg/backbonedao). Have fun!"
        )
      }
      process.exit(0)
    })
  })
}

process.on("SIGINT", function () {
  process.exit()
})

export default task
