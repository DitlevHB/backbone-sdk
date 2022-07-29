"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
const fs_extra_1 = __importDefault(require("../utils/fs-extra"));
const { exec } = require("child_process");
async function task({ dir = "", name = "", description = "", pnpm = false } = {}) {
    (0, helper_1.log)(`Copying files to ${dir}...`);
    await fs_extra_1.default.copyDirAsync(__dirname + "/template/", dir);
    const pkg = require(dir + "/package.json");
    pkg.name = name || "backbone-app";
    pkg.description = description || "Backbone App";
    await fs_extra_1.default.writeFileAsync(dir + "/package.json", JSON.stringify(pkg, null, 2));
    (0, helper_1.log)(`Installing NPM dependencies... (this can take a few minutes)`);
    const cmd = `cd ${dir} && ${pnpm ? 'pnpm' : 'npm'} install`;
    return new Promise((resolve, reject) => {
        const npm = exec(cmd);
        let errors = false;
        npm.stderr.on("data", (data) => {
            if (data.match(/npm ERR/)) {
                (0, helper_1.log)(`${data}`, null, "red");
                errors = true;
            }
        });
        npm.stdout.on("data", (data) => {
        });
        npm.on("close", (code) => {
            resolve(true);
            if (!errors) {
                (0, helper_1.log)("Project initialized 🥳 ^:");
                (0, helper_1.log)(`\n^+Next steps
1. Go to your Id (https://id.backbonedao.com or your own Id instance)
2. Create Id if you don't have one
3. Create new app
4. Download backbone.json and place it in this directory`);
                (0, helper_1.log)("\nFor documentation, go to docs (https://devs.backbonedao.com) or have a chat at Discord (https://dsc.gg/backbonedao). Have fun!");
            }
            process.exit(0);
        });
    });
}
process.on("SIGINT", function () {
    process.exit();
});
exports.default = task;
