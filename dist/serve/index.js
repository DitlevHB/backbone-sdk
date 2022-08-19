"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
const core_1 = require("../lib/core");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = require("@backbonedao/crypto");
const crypto_2 = __importDefault(require("crypto"));
global.crypto = crypto_2.default;
let params = {
    manifest: { cwd: null, settings: { address: null, encryption_key: null } },
    local: false,
    address: "",
};
let core;
async function task({ manifest = { cwd: null, settings: { address: null, encryption_key: null } }, local = false, address = "", terminal } = {}) {
    params = { manifest, local, address };
    if (!fs_1.default.existsSync(`${manifest.cwd}/dist/app.min.js`)) {
        return (0, helper_1.log)(`No compiled app found, please run 'compile' first.`, false, "red");
    }
    if (!local) {
        core = await (0, core_1.Core)({
            config: { ...manifest.settings, address: manifest.app.address, storage: "raf", disable_timeout: true },
        });
        (0, helper_1.log)(`Serving backbone://${manifest.app.address}...`);
    }
    else {
        process.env["LOG"] = "true";
        const code = fs_1.default.readFileSync(`${manifest.cwd}/dist/app.min.js`, "utf-8");
        let ui = fs_1.default.readFileSync(`${manifest.cwd}/dist/ui.min.js`, "utf-8");
        const app = require(`${manifest.cwd}/src/app`);
        const local_address = address
            ? address.replace("backbone://", "")
            : `0x${(0, crypto_1.buf2hex)((0, crypto_1.discoveryKey)((0, crypto_1.randomBytes)(32)))}`;
        params.address = local_address;
        core = await (0, core_1.Core)({
            config: { ...manifest.settings, storage: "raf", disable_timeout: true, address: local_address },
            app,
        });
        await core.meta._setMeta({
            key: "manifest",
            value: manifest.app,
        });
        await core.meta._setMeta({
            key: "code",
            value: {
                app: code,
                ui,
                signature: "!!!DEV!!!",
            },
        });
        const code_exists = await core.meta._getMeta('code');
        if (!code_exists)
            throw new Error('error storing code');
        const manifest_exists = await core.meta._getMeta('manifest');
        if (!manifest_exists)
            throw new Error('error storing manifest');
        (0, helper_1.log)(`Serving local code at backbone://${local_address} (https://browser.backbonedao.com/${local_address}${manifest.settings.encryption_key ? "#" + manifest.settings.encryption_key : ""})...`);
        if (manifest.settings.encryption_key)
            (0, helper_1.log)(`Encryption key: ${manifest.settings.encryption_key}`);
    }
    if (!(await core.network.getNetwork()))
        await core.network.connect();
}
exports.default = task;
