"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = (cwd) => {
    let currentProject;
    try {
        currentProject = require(path_1.default.resolve(cwd, "backbone.json"));
    }
    catch (err) {
    }
    if (!currentProject) {
        try {
            currentProject = require(path_1.default.resolve(cwd, "package.json")).backbone;
        }
        catch (err) {
        }
    }
    if (!currentProject)
        return undefined;
    return {
        cwd,
        ...(currentProject || {}),
    };
};
