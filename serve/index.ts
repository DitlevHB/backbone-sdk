// @ts-nocheck
import { log } from "../helper"
import { Core } from "../lib/core"
import fs from "fs"
import { buf2hex, discoveryKey, randomBytes } from "@backbonedao/crypto"
import crypto from "crypto"

global.crypto = crypto

let params = {
  manifest: { cwd: null, settings: { address: null, encryption_key: null } },
  local: false,
  address: "",
}

// let process_pending = false
// process.on("uncaughtException", async function (error) {
//   log(`Error: ${error.stack}`, false, "red")
//   if(typeof core?.getNetwork === 'function') {
//     const net = await core.getNetwork()
//     net.destroy()
//   }
//   log(`Sleeping for 5 seconds and then restarting...`)
//   if(process_pending) return
//   process_pending = setTimeout(() => {
//     clearTimeout(process_pending)
//     task(params)
//   }, 5000)
// })

let core

async function task({
  manifest = { cwd: null, settings: { address: null, encryption_key: null } },
  local = false,
  address = "",
  terminal,
} = {}) {
  params = { manifest, local, address }
  // let core
  if (!fs.existsSync(`${manifest.cwd}/dist/app.min.js`)) {
    return log(`No compiled app found, please run 'compile' first.`, false, "red")
  }
  process.env["LOG"] = "true"

  const code = fs.readFileSync(`${manifest.cwd}/dist/app.min.js`, "utf-8")
  let ui = fs.readFileSync(`${manifest.cwd}/dist/ui.min.js`, "utf-8")
  //const app = Function(code + ";return app")()
  let app = require(`${manifest.cwd}/src/app`)
  if (app?.default) app = app.default

  if (!local) {
    // TODO: Create some sort of check to see if core actually contains the code
    core = await Core({
      config: { ...manifest.settings, address: manifest.app.address, storage: "raf", disable_timeout: true },
      app,
    })
    log(
      `Serving at backbone://${manifest.app.address} (https://browser.backbonedao.com/${manifest.app.address}${
        manifest.settings.encryption_key ? "#" + manifest.settings.encryption_key : ""
      })...`
    )
    if (manifest.settings.encryption_key) log(`Encryption key: ${manifest.settings.encryption_key}`)
  } else {
    log(`Starting in local mode`)

    const local_address = address ? address.replace("backbone://", "") : `0x${buf2hex(discoveryKey(randomBytes(32)))}`

    params.address = local_address
    core = await Core({
      config: { ...manifest.settings, storage: "raf", disable_timeout: true, address: local_address },
      app,
    })
    await core.meta._setMeta({
      key: "manifest",
      value: manifest.app,
    })
    await core.meta._setMeta({
      key: "code",
      value: {
        app: code,
        ui,
        signature: "!!!DEV!!!",
      },
    })

    const code_exists = await core.meta._getMeta("code")
    if (!code_exists) throw new Error("error storing code")
    const manifest_exists = await core.meta._getMeta("manifest")
    if (!manifest_exists) throw new Error("error storing manifest")

    log(
      `Serving local code at backbone://${local_address} (https://browser.backbonedao.com/${local_address}${
        manifest.settings.encryption_key ? "#" + manifest.settings.encryption_key : ""
      })...`
    )
    if (manifest.settings.encryption_key) log(`Encryption key: ${manifest.settings.encryption_key}`)
  }

  if (!(await core.network.getNetwork())) await core.network.connect()
}

export default task
