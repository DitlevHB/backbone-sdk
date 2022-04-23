#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const helper_1 = require("./helper");
const get_current_project_1 = __importDefault(require("./utils/get-current-project"));
const create_1 = __importDefault(require("./create"));
const terminal = (0, helper_1.term)();
function printLogo() {
    terminal.green("\n\n");
    terminal.green("██████╗  █████╗  ██████╗██╗  ██╗██████╗  ██████╗ ███╗   ██╗███████╗       ██╗ ██╗" +
        "\n");
    terminal.green("██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╗   ██╔╝██╔╝" +
        "\n");
    terminal.green("██████╔╝███████║██║     █████╔╝ ██████╔╝██║   ██║██╔██╗ ██║█████╗  ╚═╝  ██╔╝██╔╝ " +
        "\n");
    terminal.green("██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══██╗██║   ██║██║╚██╗██║██╔══╝  ██╗ ██╔╝██╔╝  " +
        "\n");
    terminal.green("██████╔╝██║  ██║╚██████╗██║  ██╗██████╔╝╚██████╔╝██║ ╚████║███████╗╚═╝██╔╝██╔╝   " +
        "\n");
    terminal.green("╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝ ╚═╝    " +
        "\n\n");
}
commander_1.program
    .usage("<command> [options]")
    .command("create")
    .option("--skipUpdate", "Skip checking for update of Backbone SDK")
    .option("-d, --directory <projectdir>", "Directory for the new project")
    .option("--force", "Ignores all safety checks, be careful")
    .description("Create a new Backbone project")
    .action(async (options) => {
    printLogo();
    const dir = options?.directory
        ? `${process.cwd()}/${options.directory}/`
        : process.cwd();
    const currentProject = (0, get_current_project_1.default)(dir);
    if (currentProject) {
        (0, helper_1.log)(`Backbone project already set up in ${dir}`, false, "yellow");
        if (!options.force)
            process.exit(1);
    }
    if (!options.name) {
        (0, helper_1.log)("> Enter project name (backbone-app): ", true);
        options.name = await terminal.inputField().promise;
        (0, helper_1.log)();
    }
    if (!options.description) {
        (0, helper_1.log)("> Enter project description (Backbone App): ", true);
        options.description = await terminal.inputField().promise;
        (0, helper_1.log)();
    }
    await (0, create_1.default)({ dir, ...options });
    process.exit(0);
});
commander_1.program.on("command:*", (cmd) => {
    printLogo();
    commander_1.program.outputHelp();
    (0, helper_1.log)(`\n> Unknown command ${cmd}`, false, "yellow");
});
commander_1.program.parse(process.argv);
if (!commander_1.program.args.length) {
    printLogo();
    commander_1.program.outputHelp();
}
