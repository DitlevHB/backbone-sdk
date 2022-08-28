import { log } from "../helper"
const os = require("os")
import { versions } from 'node:process';

async function task() {
  log(`System info`)
  log(`OS :: Platform: ${os.platform()} | Release: ${os.release()} | Version: ${os.version()}`)
  log(`NodeJS :: ${Object.keys(versions).map(k => `${k}: ${versions[k]}`).join(' | ')}`)
}

export default task
