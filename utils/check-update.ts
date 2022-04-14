import axios from "axios"
import { log } from "../helper"
const pkg = require("../package.json")

export async function checkUpdate() {
  const hasUpdate = await new Promise((resolve, reject) => {
    axios
      .get("https://registry.npmjs.org/@backbonedao/sdk/latest")
      .then((res) => {
        const latestVersion = res.data.version
          .split(".")
          .map((n) => parseInt(n, 10))
        const currentVersion = pkg.version
          .split(".")
          .map((n) => parseInt(n, 10))
        let hasUpdateVersion = false
        let currentIsHigher = false
        latestVersion.forEach((n, index) => {
          if (currentIsHigher) return
          if (latestVersion[index] > currentVersion[index])
            hasUpdateVersion = true
          else if (latestVersion[index] < currentVersion[index])
            currentIsHigher = true
        })
        resolve(hasUpdateVersion)
      })
      .catch((err) => {
        reject(err)
        if (err) log(`SDK update check - ${err.stderr || err}`, false, 'red')
        process.exit(1)
      })
  })

  if (hasUpdate) {
    log(
      `\nPlease update Backbone SDK to latest version before continue.\nTo update Backbone SDK, run in terminal:`
    )
    log("\n> npm install @backbonedao/sdk -g", true)
    log(
      "\nTo skip update check run the command with --skipUpdate flag\n",
      false,
      "gray"
    )
    process.exit(1)
  } else {
  }
}
