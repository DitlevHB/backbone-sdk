#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const helper_1 = require("./helper");
const get_current_project_1 = __importDefault(require("./utils/get-current-project"));
const existing_files_1 = __importDefault(require("./utils/existing-files"));
const init_1 = __importDefault(require("./init"));
const compile_1 = __importDefault(require("./compile"));
const deploy_1 = __importDefault(require("./deploy"));
const serve_1 = __importDefault(require("./serve"));
const terminal = (0, helper_1.term)();
function printLogo() {
    terminal.green("\n\n");
    terminal.green("██████╗  █████╗  ██████╗██╗  ██╗██████╗  ██████╗ ███╗   ██╗███████╗       ██╗ ██╗" + "\n");
    terminal.green("██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╗   ██╔╝██╔╝" + "\n");
    terminal.green("██████╔╝███████║██║     █████╔╝ ██████╔╝██║   ██║██╔██╗ ██║█████╗  ╚═╝  ██╔╝██╔╝ " + "\n");
    terminal.green("██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══██╗██║   ██║██║╚██╗██║██╔══╝  ██╗ ██╔╝██╔╝  " + "\n");
    terminal.green("██████╔╝██║  ██║╚██████╗██║  ██╗██████╔╝╚██████╔╝██║ ╚████║███████╗╚═╝██╔╝██╔╝   " + "\n");
    terminal.green("╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝ ╚═╝    " + "\n\n");
}
async function common() {
    printLogo();
}
async function getProjectDetails(options) {
    const dir = options?.directory ? `${process.cwd()}/${options.directory}/` : process.cwd();
    const manifest = (0, get_current_project_1.default)(dir);
    if (!manifest) {
        (0, helper_1.log)(`No backbone.json found.\n ^:
^+How to get backbone.json^ ^:
Step 1: Create new app with your Backbone Id (https://id.backbonedao.com or your own instance)
Step 2: Download backbone.json
Step 3: Place backbone.json in the root of your project
Step 4: Run this command again\n`, false, "red");
        if (!options.force)
            process.exit(1);
    }
    return { dir, manifest };
}
commander_1.program.usage("<command> [options]");
commander_1.program
    .command("init")
    .option("--skipUpdate", "Skip checking for update of Backbone SDK")
    .option("-d, --directory <projectdir>", "Directory for the new project")
    .option("--force", "Ignores all safety checks, be careful")
    .option("--pnpm", "Use PNPM instead of NPM")
    .description("Create a new Backbone project")
    .action(async (options) => {
    await common();
    const dir = options?.directory ? `${process.cwd()}/${options.directory}/` : process.cwd();
    const currentProject = (0, get_current_project_1.default)(dir);
    if (currentProject) {
        (0, helper_1.log)(`Backbone project already set up in ${dir}`, false, "yellow");
        if (!options.force)
            process.exit(1);
    }
    if ((0, existing_files_1.default)(dir) > 0) {
        (0, helper_1.log)(`> This directory doesn't seem to be empty, are you sure you want to create project here? [y/N]: `, true, "yellow");
        const cont = await terminal.inputField().promise;
        if (cont === "N" || !cont) {
            (0, helper_1.log)(`\n`);
            process.exit(1);
        }
        (0, helper_1.log)(`\n`);
    }
    await (0, init_1.default)({ dir, ...options });
    process.exit(0);
});
commander_1.program
    .command("compile")
    .description("Compile Backbone app")
    .action(async (options) => {
    await common();
    const { dir } = await getProjectDetails(options);
    await (0, compile_1.default)({ dir, ...options });
    process.exit(0);
});
commander_1.program
    .command("deploy")
    .description("Deploy Backbone app")
    .option("-s, --signature <signature>", "Signature of the app checksum")
    .action(async (options) => {
    await common();
    const { manifest } = await getProjectDetails(options);
    await (0, deploy_1.default)({ manifest, ...options });
    process.exit(0);
});
commander_1.program
    .command("serve")
    .description("Serve Backbone app")
    .option("-l, --local", "Use local instance of the app (useful for dev)")
    .option("-a, --address <address>", "Use this to set local address when -l is used")
    .action(async (options) => {
    await common();
    const { manifest } = await getProjectDetails(options);
    await (0, serve_1.default)({ manifest, ...options });
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
function terminate() {
    terminal.grabInput(false);
    setTimeout(function () {
        process.exit();
    }, 100);
}
terminal.on("key", function (name, matches, data) {
    if (name === "CTRL_C") {
        console.log();
        terminate();
    }
});
