#!/usr/bin/env node
require("ts-node").register({ lazy: true })
import { program } from "commander"
import { log, term } from "./helper"
import { checkUpdate } from "./utils/check-update"
import getCurrentProject from "./utils/get-current-project"
import getExistingFiles from "./utils/existing-files"
import initProject from "./init"
import compileProject from "./compile"
import releaseProject from "./release"
import deployProject from "./deploy"
import serveProject from "./serve"

const terminal = term()

function printLogo() {
  terminal.green("\n\n")
  terminal.green("██████╗  █████╗  ██████╗██╗  ██╗██████╗  ██████╗ ███╗   ██╗███████╗       ██╗ ██╗" + "\n")
  terminal.green("██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╗   ██╔╝██╔╝" + "\n")
  terminal.green("██████╔╝███████║██║     █████╔╝ ██████╔╝██║   ██║██╔██╗ ██║█████╗  ╚═╝  ██╔╝██╔╝ " + "\n")
  terminal.green("██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══██╗██║   ██║██║╚██╗██║██╔══╝  ██╗ ██╔╝██╔╝  " + "\n")
  terminal.green("██████╔╝██║  ██║╚██████╗██║  ██╗██████╔╝╚██████╔╝██║ ╚████║███████╗╚═╝██╔╝██╔╝   " + "\n")
  terminal.green("╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝ ╚═╝    " + "\n\n")
}
// const version = require("./package.json").version
// program.version(version)

async function common() {
  printLogo()
  // if (!options?.skipUpdate) await checkUpdate()
}

async function getProjectDetails(options) {
  const dir = options?.directory ? `${process.cwd()}/${options.directory}/` : process.cwd()
  const manifest = getCurrentProject(dir)
  if (!manifest) {
    log(
      `No backbone.json found.\n ^:
^+How to get backbone.json^ ^:
Step 1: Create new app with your Backbone Id (https://id.backbonedao.com or your own instance)
Step 2: Download backbone.json
Step 3: Place backbone.json in the root of your project
Step 4: Run this command again\n`,
      false,
      "red"
    )
    if (!options.force) process.exit(1)
  }
  return { dir, manifest }
}

program.usage("<command> [options]")

// INIT
program
  .command("init")
  .option("--skipUpdate", "Skip checking for update of Backbone SDK")
  .option("-d, --directory <projectdir>", "Directory for the new project")
  .option("--force", "Ignores all safety checks, be careful")
  .option("--pnpm", "Use PNPM instead of NPM")
  .description("Create a new Backbone project")
  .action(async (options) => {
    await common()

    const dir = options?.directory ? `${process.cwd()}/${options.directory}/` : process.cwd()
    const currentProject = getCurrentProject(dir)
    if (currentProject) {
      log(`Backbone project already set up in ${dir}`, false, "yellow")
      if (!options.force) process.exit(1)
    }

    if (getExistingFiles(dir) > 0) {
      log(
        `> This directory doesn't seem to be empty, are you sure you want to create project here? [y/N]: `,
        true,
        "yellow"
      )
      const cont = await terminal.inputField().promise
      if (cont === "N" || !cont) {
        log(`\n`)
        process.exit(1)
      }
      log(`\n`)
    }

    /* 
    if (!options.name) {
      log("> Enter project name (backbone-app): ", true)
      options.name = await terminal.inputField().promise
      log()
    }

    if (!options.description) {
      log("> Enter project description (Backbone App): ", true)
      options.description = await terminal.inputField().promise
      log()
    }
    */

    await initProject({ dir, ...options })
    process.exit(0)
  })

// COMPILE
program
  .command("compile")
  .description("Compile Backbone app")
  .action(async (options) => {
    await common()

    const { dir } = await getProjectDetails(options)

    await compileProject({ dir, ...options })
    process.exit(0)
  })

// RELEASE
program
  .command("release")
  .description("Create new release")
  .action(async (options) => {
    await common()
    const { manifest } = await getProjectDetails(options)
    await releaseProject({ manifest, ...options })
    process.exit(0)
  })

// DEPLOY
program
  .command("deploy")
  .description("Deploy Backbone app")
  .option("-s, --signature <signature>", "Signature of the app checksum")
  .action(async (options) => {
    await common()

    const { manifest } = await getProjectDetails(options)

    if (!options.signature) {
      log("> Enter signature: ", true)
      options.signature = await terminal.inputField().promise
      log()
    }
    await deployProject({ manifest, ...options })
    process.exit(0)
  })

// SERVE
program
  .command("serve")
  .description("Serve Backbone app")
  .option("-l, --local", "Use local instance of the app (useful for dev)")
  .option("-a, --address <address>", "Use this to set local address when -l is used")
  .action(async (options) => {
    await common()

    const { manifest } = await getProjectDetails(options)

    await serveProject({ manifest, terminal, ...options })
    // process.exit(0)
  })

// CATCH-ALL
program.on("command:*", (cmd) => {
  printLogo()
  program.outputHelp()
  log(`\n> Unknown command ${cmd}`, false, "yellow")
})

program.parse(process.argv)

if (!program.args.length) {
  printLogo()
  program.outputHelp()
}

function terminate() {
  terminal.grabInput(false)
  setTimeout(function () {
    process.exit()
  }, 100)
}

terminal.on("key", function (name, matches, data) {
  if (name === "CTRL_C") {
    console.log()
    terminate()
  }
})
