import { log } from "../helper"
const { exec } = require("child_process")

async function task(opts: {
  dir: string
}) {
  const { dir } = { ...opts }

  // install dependencies
  log(`Compiling and minifying...`)
  const cmd = `cd ${dir} && npm run build:browser:full`
  return new Promise((resolve, reject) => {
    const npm = exec(cmd)
    let errors = false
    npm.stderr.on("data", (data) => {
      log(`${data}`, false, 'red')
      if(data.match(/npm ERR/)) errors = true
    })
    npm.stdout.on("data", (data) => {
      // log(`${data}`)
    })

    npm.on("close", (code) => {
      resolve(true)
      if(!errors) {
        log('App compiled to dist/app.min.js and UI compiled to dist/ui.min.js')
        log(`Protip: Run 'bb deploy' to get code checksum for release signing.`)
      }
      process.exit(0)
    })
  })
}

export default task
