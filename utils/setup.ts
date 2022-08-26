import { log } from "../helper"
const { exec } = require("child_process")

;(async () => {
  const dir = process.cwd()
  log(`Installing NPM dependencies... (this can take a few minutes)`)
  await runNPM(dir, "npx pnpm install")
  log(`Installing Core...`)
  await initSubmodules(dir)
  log(`Installing Core NPM dependencies... (this can take a few minutes)`)
  await runNPM(`${dir}/lib/core`, "npx pnpm install")
  log(`Building Core...`)
  await runNPM(`${dir}/lib/core`, "npm run build:node")
  log(`Building SDK...`)
  await runNPM(dir, "npm run build && npm link")
  log("All done! Try to run `bb` - you should get a help menu.")
  log("If something went wrong, jump to our Discord (https://dsc.gg/backbonedao) and we'll help you.", false, 'yellow')
})()

async function runNPM(dir, npmcmd) {
  const cmd = `cd ${dir} && ${npmcmd}`
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
      log(`${data}`)
    })

    npm.on("close", (code) => {
      if (!errors) resolve(true)
      else {
        log(`Please fix the errors and try again`, false, "red")
        process.exit(0)
      }
    })
  })
}

async function initSubmodules(dir) {
  const cmd = `cd ${dir} && git submodule init && git submodule update`
  return new Promise((resolve, reject) => {
    const git = exec(cmd)
    let errors = false
    git.stderr.on("data", (data) => {
      if (data.match(/ERR/)) {
        log(`${data}`, false, "red")
        errors = true
      }
    })
    git.stdout.on("data", (data) => {
      // log(`${data}`)
    })

    git.on("close", (code) => {
      if (!errors) resolve(true)
      else {
        log(`Please fix the errors and try again`, false, "red")
        process.exit(0)
      }
    })
  })
}
