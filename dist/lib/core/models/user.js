"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const User = (0, base_1.ObjectModel)({
    username: String,
    public_key: String,
});
exports.default = User;