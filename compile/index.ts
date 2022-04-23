import { log } from "../helper"
const { exec } = require("child_process")

async function task(opts: {
  dir: string
  name?: string
  description?: string
}) {
  const { dir, name, description } = { ...opts }

  // install dependencies
  log(`Compiling and minifying...`)
  const cmd = `cd ${dir} && npm run build:browser:full && npm run build:browser:app`
  return new Promise((resolve, reject) => {
    const npm = exec(cmd)
    let errors = false
    npm.stderr.on("data", (data) => {
      log(`${data}`, null, 'red')
      if(data.match(/npm ERR/)) errors = true
    })
    npm.stdout.on("data", (data) => {
      // log(`${data}`)
    })

    npm.on("close", (code) => {
      resolve(true)
      if(!errors) {
        log('Standalone project compiled to dist/exe.min.js (the full package, includes Backbone Core)')
        log('App only compiled to dist/app.min.js (use this if you load Backbone Core from CDN)')
      }
      process.exit(0)
    })
  })
}

process.on('SIGINT', function() {
  console.log("Caught interrupt signal")
  process.exit()
});

export default task
