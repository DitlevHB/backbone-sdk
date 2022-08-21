import { log } from "../helper"
const fs = require("fs")
const { buf2hex, createHash } = require("@backbonedao/crypto")

async function task(opts: { signature?: string; manifest: any; update_registry?: boolean }) {
  let { manifest: current_project } = { ...opts }
  if (!fs.existsSync(`${current_project.cwd}/dist/app.min.js`)) {
    return log(`No compiled app found, please run 'compile' first.`, false, "red")
  }
  const backbonejson = require(`${current_project.cwd}/backbone.json`)
  // TODO: manifest needs to be signed
  const manifest = JSON.stringify(backbonejson.app)
  const app = fs.readFileSync(`${current_project.cwd}/dist/app.min.js`, "utf-8")
  let ui = fs.readFileSync(`${current_project.cwd}/dist/ui.min.js`, "utf-8")
  if (!ui) ui = ""
  const checksum = buf2hex(createHash(manifest + app + ui))

  log(`Version: ${backbonejson.app.version} (found in backbone.json)`)
  log(`Checksum for signing: ${checksum}`)
  log(
    `Instructions: Go to your Backbone Id (https://id.backbonedao.com) and either create a new app or release for an app. Input above checksum where asked.`
  )
  log(`Once you have created the release signature, run 'bb deploy -s SIGNATURE' to deploy.`)
}

export default task
