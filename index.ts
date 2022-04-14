#!/usr/bin/env node

import { program } from "commander"
import { log, term } from "./helper"
import { checkUpdate } from "./utils/check-update"
import getCurrentProject from "./utils/get-current-project"
import createProject from "./create"

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

program.version(require("./package.json").version)

program
  .usage("<command> [options]")
  .command("create")
  .option("--skipUpdate", "Skip checking for update of Backbone SDK")
  .option("-d, --directory <projectdir>", "Where do you want the project?")
  .option("--force", "Ignores all safety checks, be careful")
  .description("Create a new Backbone project")
  .action(async (options) => {
    printLogo()
    // if (!options?.skipUpdate) await checkUpdate()

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
