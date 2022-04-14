"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpdate = void 0;
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("../helper");
const pkg = require("../package.json");
async function checkUpdate() {
    const hasUpdate = await new Promise((resolve, reject) => {
        axios_1.default
            .get("https://registry.npmjs.org/@backbonedao/sdk/latest")
            .then((res) => {
            const latestVersion = res.data.version
                .split(".")
                .map((n) => parseInt(n, 10));
            const currentVersion = pkg.version
                .split(".")
                .map((n) => parseInt(n, 10));
            let hasUpdateVersion = false;
            let currentIsHigher = false;
            latestVersion.forEach((n, index) => {
                if (currentIsHigher)
                    return;
                if (latestVersion[index] > currentVersion[index])
                    hasUpdateVersion = true;
                else if (latestVersion[index] < currentVersion[index])
                    currentIsHigher = true;
            });
            resolve(hasUpdateVersion);
        })
            .catch((err) => {
            reject(err);
            if (err)
                (0, helper_1.log)(`SDK update check - ${err.stderr || err}`, false, 'red');
            process.exit(1);
        });
    });
    if (hasUpdate) {
        (0, helper_1.log)(`\nPlease update Backbone SDK to latest version before continue.\nTo update Backbone SDK, run in terminal:`);
        (0, helper_1.log)("\n> npm install @backbonedao/sdk -g", true);
        (0, helper_1.log)("\nTo skip update check run the command with --skipUpdate flag\n", false, "gray");
        process.exit(1);
    }
    else {
    }
}
exports.checkUpdate = checkUpdate;
