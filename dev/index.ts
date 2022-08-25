import { log } from "../helper"
const { exec } = require("child_process")
import fs from "fs"

async function task(opts: { dir: string }) {
  const { dir } = { ...opts }
  if (!fs.existsSync(`${dir}/backbone.json`)) {
    log(`No backbone.json found`, false, "red")
    log(`\n^+How to fix:
1. Go to your Id (https://id.backbonedao.com or your own Id instance)
2. Create Id if you don't have one
3. Create new app
4. Download backbone.json and place it in this directory`)
    log(
      "\nFor documentation, go to docs (https://docs.backbonedao.com) or have a chat at Discord (https://dsc.gg/backbonedao). Have fun!"
    )
    return
  }
  if (!fs.existsSync(`${dir}/core/dist/core.min.js`)) {
    log(`No core.min.js found`, false, "red")
    log(`\n^+Did you remember to symlink Core repository and npm run build it?`)
    log(`See https://github.com/backbonedao/sdk for how to do the symlink.`)
    return
  }
  // install dependencies
  log(`Starting a development server...`)
  const cmd = `cd ${dir} && npm run dev`
  return new Promise((resolve, reject) => {
    const npm = exec(cmd)
    let errors = false
    npm.stderr.on("data", (data) => {
      log(`${data}`, false, "red")
      if (data.match(/npm ERR/)) errors = true
    })
    npm.stdout.on("data", (data) => {
      console.log(data)
    })

    npm.on("close", (code) => {
      resolve(true)
      process.exit(0)
    })
  })
}

export default task
