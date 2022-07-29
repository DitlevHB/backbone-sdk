"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
const core_1 = require("../lib/core");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("@backbonedao/crypto"));
let params = {
    manifest: { cwd: null, settings: { address: null, encryption_key: null } },
    local: false,
    address: "",
};
process.on("uncaughtException", function (error) {
    (0, helper_1.log)(`Error: ${error.stack}`, false, "red");
    (0, helper_1.log)(`Sleeping for 5 seconds and then restarting...`);
    setTimeout(() => {
        task(params);
    }, 5000);
});
async function task({ manifest = { cwd: null, settings: { address: null, encryption_key: null } }, local = false, address = "", } = {}) {
    params = { manifest, local, address };
    let core;
    if (!local) {
        core = await (0, core_1.Core)({
            config: { ...manifest.settings, storage: "raf", disable_timeout: true },
        });
        (0, helper_1.log)(`Serving backbone://${manifest.settings.address}...`);
    }
    else {
        process.env["LOG"] = "true";
        if (!fs_1.default.existsSync(`${manifest.cwd}/dist/app.min.js`)) {
            return (0, helper_1.log)(`No compiled app found, please run 'compile' first.`, false, "red");
        }
        const code = fs_1.default.readFileSync(`${manifest.cwd}/dist/app.min.js`, "utf-8");
        let ui = fs_1.default.readFileSync(`${manifest.cwd}/dist/ui.min.js`, "utf-8");
        const app = Function(code + ";return app")();
        const local_address = address
            ? address.replace("backbone://", "")
            : `0x${crypto_1.default.buf2hex(crypto_1.default.discoveryKey(crypto_1.default.randomBytes(32)))}`;
        params.address = local_address;
        core = await (0, core_1.Core)({
            config: { ...manifest.settings, storage: "raf", disable_timeout: true, address: local_address },
            app,
        });
        await core._setMeta({
            key: "manifest",
            value: manifest,
        });
        await core._setMeta({
            key: "code",
            value: {
                app: code,
                ui,
                signature: "!!!DEV!!!",
            },
        });
        (0, helper_1.log)(`Serving local code at backbone://${local_address} (https://browser.backbonedao.com/#${local_address}${manifest.settings.encryption_key ? "|" + manifest.settings.encryption_key : ""})...`);
        if (manifest.settings.encryption_key)
            (0, helper_1.log)(`Encryption key: ${manifest.settings.encryption_key}`);
    }
    if (!(await core.getNetwork()))
        await core.connect();
}
exports.default = task;
