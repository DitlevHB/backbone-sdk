import { log } from "../helper"
import { Core } from "../../core-alpha/dist/node"
import fs from "fs"
import crypto from "@backbonedao/crypto"

const Bootloader = {
  API: async function (Data, Protocol) {
    return {
      async get(key) {
        const value = await Data.get(key)
        return value || null
      },
      async set(params = { key: "", value: "" }) {
        await Protocol({
          type: "set",
          key: params.key,
          value: params.value,
        })
      },
    }
  },
  Protocol: async function (op, Core, Id) {
    if (typeof op !== "object" || !op?.type) throw new Error("UNKNOWN OP")
    switch (op.type) {
      case "set": {
        await Core.put({ key: op.key, value: op.value })
        break
      }
      default:
        throw new Error("UNKNOWN OP")
    }
  },
}

async function task({ current_project = { cwd: null, settings: { address: null, encryption_key: null } }, local = false, address = '' } = {}) {
  let core
  if (!local) {
    core = await Core({
      config: { ...current_project.settings, storage: "raf", disable_timeout: true },
    })
    log(`Serving backbone://${current_project.settings.address}...`)
  } else {
    if (!fs.existsSync(`${current_project.cwd}/dist/app.min.js`)) {
      return log(`No compiled app found, please run 'compile' first.`, false, "red")
    }
    const code = fs.readFileSync(`${current_project.cwd}/dist/app.min.js`, "utf-8")
    let ui = fs.readFileSync(`${current_project.cwd}/dist/ui.min.js`, "utf-8")
    const app = Function(code + ';return app')()

    const local_address = address ? address.replace('backbone://', '') : `0x${crypto.buf2hex(crypto.discoveryKey(crypto.randomBytes(32)))}`
    core = await Core({
      config: { ...current_project.settings, storage: "raf", disable_timeout: true, address: local_address },
      app,
    })
    await core._setMeta({
      key: "code",
      value: {
        app: code,
        ui,
        signature: '!!!DEV!!!',
      },
    })
    log(`Serving local code at backbone://${local_address} (https://browser.backbonedao.com/${local_address})...`)
    if(current_project.settings.encryption_key) log(`Encryption key: ${current_project.settings.encryption_key}`)
  }
  // @ts-ignore
  if (!(await core.getNetwork())) await core.connect()
  // console.log("Getting app code...")
  // const unpacked_code = await BootCore.get("_/code")
  // if (!unpacked_code) throw new Error("no code found")
  // const code = await unpack(unpacked_code)
  // verify signature
  // const is_valid = await verify({ code, address: params.address })
  // if(!is_valid) return reject('code verification failed')

  // create app
  // const app = Function(code.code + ";return app")()
  // console.log("Starting Core with app...")
  //const core = await Core({
  //  config: { ...opts.current_project.settings, storage: "raf" },
  //  app,
  //})
}

export default task
