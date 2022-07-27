import { log } from "../helper"
import { Core } from "../../core-alpha/dist/node"
import fs from "fs"
import crypto from "@backbonedao/crypto"

let params = {
  manifest: { cwd: null, settings: { address: null, encryption_key: null } },
  local: false,
  address: "",
}
process.on("uncaughtException", function (error) {
  log(`Error: ${error.stack}`, false, "red")
  log(`Sleeping for 5 seconds and then restarting...`)
  setTimeout(() => {
    task(params)
  }, 5000)
})

async function task({
  manifest = { cwd: null, settings: { address: null, encryption_key: null } },
  local = false,
  address = "",
} = {}) {
  params = { manifest, local, address }
  let core
  if (!local) {
    core = await Core({
      config: { ...manifest.settings, storage: "raf", disable_timeout: true },
    })
    log(`Serving backbone://${manifest.settings.address}...`)
  } else {
    process.env["LOG"] = "true"
    if (!fs.existsSync(`${manifest.cwd}/dist/app.min.js`)) {
      return log(`No compiled app found, please run 'compile' first.`, false, "red")
    }
    const code = fs.readFileSync(`${manifest.cwd}/dist/app.min.js`, "utf-8")
    let ui = fs.readFileSync(`${manifest.cwd}/dist/ui.min.js`, "utf-8")
    const app = Function(code + ";return app")()

    const local_address = address
      ? address.replace("backbone://", "")
      : `0x${crypto.buf2hex(crypto.discoveryKey(crypto.randomBytes(32)))}`

    params.address = local_address
    core = await Core({
      config: { ...manifest.settings, storage: "raf", disable_timeout: true, address: local_address },
      app,
    })
    await core._setMeta({
      key: "manifest",
      value: manifest,
    })
    await core._setMeta({
      key: "code",
      value: {
        app: code,
        ui,
        signature: "!!!DEV!!!",
      },
    })

    log(
      `Serving local code at backbone://${local_address} (https://browser.backbonedao.com/#${local_address}${
        manifest.settings.encryption_key ? "|" + manifest.settings.encryption_key : ""
      })...`
    )
    if (manifest.settings.encryption_key) log(`Encryption key: ${manifest.settings.encryption_key}`)
  }

  if (!(await core.getNetwork())) await core.connect()
}

export default task
