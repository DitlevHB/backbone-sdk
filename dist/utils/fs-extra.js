"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const fse = {
    unlinkSync(p) {
        return fs_1.default.unlinkSync(p);
    },
    existsSync(p) {
        return fs_1.default.existsSync(p);
    },
    readdirSync(dir) {
        return fs_1.default.readdirSync(dir);
    },
    mkdirSync(dir) {
        if (fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir);
            return;
        }
        dir.split(path_1.default.sep).forEach((part, index) => {
            if (!part)
                return;
            const partialPath = dir
                .split(path_1.default.sep)
                .slice(0, index + 1)
                .join(path_1.default.sep);
            if (!fs_1.default.existsSync(partialPath)) {
                fs_1.default.mkdirSync(partialPath);
            }
        });
    },
    readFileSync(file, charset) {
        return fs_1.default.readFileSync(file, charset);
    },
    writeFileSync(file, content) {
        if (!fs_1.default.existsSync(path_1.default.dirname(file))) {
            fse.mkdirSync(path_1.default.dirname(file));
        }
        return fs_1.default.writeFileSync(file, content);
    },
    writeFileAsync(file, content) {
        if (!fs_1.default.existsSync(path_1.default.dirname(file))) {
            fse.mkdirSync(path_1.default.dirname(file));
        }
        return new Promise((resolve, reject) => {
            fs_1.default.writeFile(file, content, (err) => {
                if (err)
                    reject();
                else
                    resolve(true);
            });
        });
    },
    copyFileSync(src, dest) {
        if (!fs_1.default.existsSync(path_1.default.dirname(dest))) {
            fse.mkdirSync(path_1.default.dirname(dest));
        }
        fs_1.default.copyFileSync(src, dest);
    },
    copyFileAsync(src, dest) {
        if (!fs_1.default.existsSync(path_1.default.dirname(dest))) {
            fse.mkdirSync(path_1.default.dirname(dest));
        }
        return new Promise((resolve, reject) => {
            fs_1.default.copyFile(src, dest, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(true);
            });
        });
    },
    copyDirAsync(src, dest) {
        return (0, promises_1.cp)(src, dest, { force: true, recursive: true });
    },
};
exports.default = fse;
