#!/usr/bin/env node

import { program } from "commander"
import { log, term } from "./helper"
import { checkUpdate } from "./utils/check-update"
import getCurrentProject from "./utils/get-current-project"
import createProject from "./create"
import compileProject from "./compile"

const terminal = term()

function printLogo() {
  terminal.green("\n\n")
  terminal.green(
    "██████╗  █████╗  ██████╗██╗  ██╗██████╗  ██████╗ ███╗   ██╗███████╗       ██╗ ██╗" +
      "\n"
  )
  terminal.green(
    "██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╗   ██╔╝██╔╝" +
      "\n"
  )
  terminal.green(
    "██████╔╝███████║██║     █████╔╝ ██████╔╝██║   ██║██╔██╗ ██║█████╗  ╚═╝  ██╔╝██╔╝ " +
      "\n"
  )
  terminal.green(
    "██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══██╗██║   ██║██║╚██╗██║██╔══╝  ██╗ ██╔╝██╔╝  " +
      "\n"
  )
  terminal.green(
    "██████╔╝██║  ██║╚██████╗██║  ██╗██████╔╝╚██████╔╝██║ ╚████║███████╗╚═╝██╔╝██╔╝   " +
      "\n"
  )
  terminal.green(
    "╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝ ╚═╝    " +
      "\n\n"
  )
}
// const version = require("./package.json").version
// program.version(version)

async function common() {
  printLogo()
  // if (!options?.skipUpdate) await checkUpdate()
}

program.usage("<command> [options]")

program
  .command("create")
  .option("--skipUpdate", "Skip checking for update of Backbone SDK")
  .option("-d, --directory <projectdir>", "Directory for the new project")
  .option("--force", "Ignores all safety checks, be careful")
  .description("Create a new Backbone project")
  .action(async (options) => {
    await common()

    const dir = options?.directory
      ? `${process.cwd()}/${options.directory}/`
      : process.cwd()
    const currentProject = getCurrentProject(dir)
    if (currentProject) {
      log(`Backbone project already set up in ${dir}`, false, "yellow")
      if (!options.force) process.exit(1)
    }

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

    await createProject({ dir, ...options })
    process.exit(0)
  })

program
  .command("compile")
  .description("Compile Backbone app")
  .action(async (options) => {
    await common()

    const dir = options?.directory
      ? `${process.cwd()}/${options.directory}/`
      : process.cwd()
    const currentProject = getCurrentProject(dir)
    if (!currentProject) {
      log(
        `Please run compile on the root of the Backbone app project dir`,
        false,
        "red"
      )
      if (!options.force) process.exit(1)
    }

    await compileProject({ dir, ...options })
    process.exit(0)
  })

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
