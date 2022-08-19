"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
const fs = require("fs");
const { buf2hex, createHash, verifyAppSig } = require("@backbonedao/crypto");
const AppLoader = require("./apploader");
const { Core } = require("../lib/core");
async function task(opts) {
    let { signature, manifest: current_project, update_registry } = { ...opts };
    if (!fs.existsSync(`${current_project.cwd}/dist/app.min.js`)) {
        return (0, helper_1.log)(`No compiled app found, please run 'compile' first.`, false, "red");
    }
    const backbonejson = require(`${current_project.cwd}/backbone.json`);
    const manifest = JSON.stringify(backbonejson.app);
    const app = fs.readFileSync(`${current_project.cwd}/dist/app.min.js`, "utf-8");
    let ui = fs.readFileSync(`${current_project.cwd}/dist/ui.min.js`, "utf-8");
    if (!ui)
        ui = "";
    const checksum = buf2hex(createHash(manifest + app + ui));
    if (!signature) {
        (0, helper_1.log)(`Version: ${backbonejson.app.version} (found in backbone.json)`);
        (0, helper_1.log)(`Checksum for signing: ${checksum}`);
        (0, helper_1.log)(`Instructions: Go to your Backbone Id (https://id.backbonedao.com) and either create a new app or release for an app. Input above checksum where asked.`);
        (0, helper_1.log)(`Once you have created the release signature, run 'bb deploy -s SIGNATURE' to deploy.`);
    }
    else {
        (0, helper_1.log)(`Verify signature...`);
        if (signature.length === 130)
            signature = "0x" + signature;
        if (signature.length !== 132)
            return (0, helper_1.log)(`Invalid signature.`, false, "red");
        const is_valid_address = await verifyAppSig({
            code: { checksum, signature },
            address: current_project.app.address,
        });
        if (!is_valid_address) {
            return (0, helper_1.log)(`Signature verification failed.`, false, "red");
        }
        (0, helper_1.log)(`Creating/updating container...`);
        const apploader_core = await Core({
            config: {
                address: current_project.app.address,
                encryption_key: current_project.settings.encryption_key,
            },
            app: AppLoader,
        });
        await apploader_core.meta._setMeta({
            key: "manifest",
            value: manifest,
        });
        const mmanifest = await apploader_core.meta._getMeta("manifest");
        if (!mmanifest)
            return (0, helper_1.log)(`Container manifest failed to save.`, false, "red");
        await apploader_core.meta._setMeta({
            key: "code",
            value: {
                app,
                ui,
                signature,
            },
        });
        const ccode = await apploader_core.meta._getMeta("code");
        if (!ccode)
            return (0, helper_1.log)(`Container code failed to save.`, false, "red");
        if (buf2hex(createHash(mmanifest + ccode.app + ccode.ui)) !== checksum)
            return (0, helper_1.log)(`Container manifest and code mismatch from originals.`, false, "red");
        (0, helper_1.log)(`Deploying container to backbone://${current_project.app.address}...`);
        if (update_registry) {
            (0, helper_1.log)(`Registering new version into Backbone App Registry...`);
        }
        (0, helper_1.log)(`All done 🥳`);
        (0, helper_1.log)(`Tip: To propagate new code to app users, run 'bb serve'`);
    }
}
exports.default = task;
