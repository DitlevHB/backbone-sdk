"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
const { exec } = require("child_process");
async function task(opts) {
    const { dir } = { ...opts };
    (0, helper_1.log)(`Compiling and minifying...`);
    const cmd = `cd ${dir} && npm run build:browser:full`;
    return new Promise((resolve, reject) => {
        const npm = exec(cmd);
        let errors = false;
        npm.stderr.on("data", (data) => {
            (0, helper_1.log)(`${data}`, false, 'red');
            if (data.match(/npm ERR/))
                errors = true;
        });
        npm.stdout.on("data", (data) => {
        });
        npm.on("close", (code) => {
            resolve(true);
            if (!errors) {
                (0, helper_1.log)('App compiled to dist/app.min.js and UI compiled to dist/ui.min.js');
                (0, helper_1.log)(`Protip: Run 'bb deploy' to get code checksum for release signing.`);
            }
            process.exit(0);
        });
    });
}
exports.default = task;
