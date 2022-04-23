"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("./protocol"));
const api_1 = __importDefault(require("./api"));
exports.default = { Protocol: protocol_1.default, API: api_1.default };
