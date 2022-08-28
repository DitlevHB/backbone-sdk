import { log } from "../helper"
const fs = require("fs")
const { buf2hex, createHash, verifyAppSig } = require("@backbonedao/crypto")
const AppLoader = require("./apploader")
const { Core } = require("../lib/core")

async function task(opts: {
  signature?: string
  manifest: any
  update_registry?: boolean
}) {
  let { signature, manifest, update_registry } = { ...opts }
  if (!fs.existsSync(`${manifest.cwd}/dist/app.min.js`)) {
    return log(
      `No compiled app found, please run 'compile' first.`,
      false,
      "red"
    )
  }

  // TODO: manifest needs to be signed
  const app = fs.readFileSync(
    `${manifest.cwd}/dist/app.min.js`,
    "utf-8"
  )
  let ui = fs.readFileSync(
    `${manifest.cwd}/dist/ui.min.js`,
    "utf-8"
  )
  if(!ui) ui = ""
  const checksum = buf2hex(createHash(JSON.stringify(manifest.app) + app + ui))

  if (!signature) {
    log(`Version: ${manifest.app.version} (found in backbone.json)`)
    log(`Checksum for signing: ${checksum}`)
    log(
      `Instructions: Go to your Backbone Id (https://id.backbonedao.com) and either create a new app or release for an app. Input above checksum where asked.`
    )
    log(`Once you have created the release signature, run 'bb deploy -s SIGNATURE' to deploy.`)
  } else {
    log(`Verify signature...`)
    // check signature
    if (signature.length === 130) signature = "0x" + signature
    if (signature.length !== 132) return log(`Invalid signature.`, false, "red")
    
    const is_valid_address = await verifyAppSig({
      code: { checksum, signature },
      address: manifest.app.address,
    })

    if (!is_valid_address) {
      return log(`Signature verification failed.`, false, "red")
    }
    log(`Creating/updating container...`)
    // Open Core with AppLoader app
    let backend = require(`${manifest.cwd}/src/app`)
    if (backend?.default) backend = backend.default

    const apploader_core = await Core({
      config: {
        address: manifest.app.address,
        encryption_key: manifest.settings.encryption_key,
      },
      app: backend,
    })
    await apploader_core.meta._setMeta({
      key: "manifest",
      value: manifest.app,
    })
    const mmanifest = await apploader_core.meta._getMeta("manifest")
    if (!mmanifest) return log(`Container manifest failed to save.`, false, "red")
    if(!mmanifest?.version)  return log(`Container manifest is invalid.`, false, "red")

    await apploader_core.meta._setMeta({
      key: "code",
      value: {
        app,
        ui,
        signature,
      },
    })
    const ccode = await apploader_core.meta._getMeta("code")
    if (!ccode) return log(`Container code failed to save.`, false, "red")
 
    if (buf2hex(createHash(JSON.stringify(mmanifest) + ccode.app + ccode.ui)) !== checksum)
      return log(`Container manifest and code mismatch from originals.`, false, "red")
    log(
      `Deploying container to backbone://${manifest.app.address}...`
    )

    if (update_registry) {
      log(`Registering new version into Backbone App Registry...`)
      // TODO: Create contract call and send it
    }

    log(`All done 🥳`)
    log(
      `Tip: To propagate new code to app users, run 'bb serve'`
    )
  }
}

export default task
