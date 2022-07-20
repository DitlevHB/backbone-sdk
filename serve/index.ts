import { log } from "../helper"
import { Core } from "../../core-alpha/dist/node"
// import BB from "../../core-alpha"
// const Core = BB.Core
import { unpack } from "msgpackr"

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

async function task(opts: { current_project: any }) {
  const core = await Core({
    config: { ...opts.current_project.settings, storage: "raf", disable_timeout: true }
  })
  log(`Serving backbone://${opts.current_project.settings.address}...`)
  // @ts-ignore
  if(!await core.getNetwork()) await core.connect()
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
