"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
const fs_extra_1 = __importDefault(require("../utils/fs-extra"));
const { exec } = require("child_process");
async function task(opts) {
    const { dir, name, description } = { ...opts };
    (0, helper_1.log)(`Copying files to ${dir}...`);
    await fs_extra_1.default.copyDirAsync(__dirname + "/template/", dir);
    const pkg = require(dir + "/package.json");
    pkg.name = name || "backbone-app";
    pkg.description = description || "Backbone App";
    await fs_extra_1.default.writeFileAsync(dir + "/package.json", JSON.stringify(pkg, null, 2));
    const bb = require(dir + "/backbone.json");
    bb.name = name || "backbone-app";
    bb.description = description || "Backbone App";
    await fs_extra_1.default.writeFileAsync(dir + "/backbone.json", JSON.stringify(bb, null, 2));
    (0, helper_1.log)(`Installing NPM dependencies... (this can take a few minutes)`);
    const cmd = `cd ${dir} && npm install`;
    return new Promise((resolve, reject) => {
        const npm = exec(cmd);
        npm.stderr.on("data", (data) => {
            (0, helper_1.log)(`${data}`, null, 'red');
        });
        npm.on("close", (code) => {
            resolve(true);
            (0, helper_1.log)('Project initialized!');
            (0, helper_1.log)('\nFor documentation, go to https://devs.backbonedao.com. Have fun!');
            process.exit(0);
        });
    });
}
exports.default = task;
