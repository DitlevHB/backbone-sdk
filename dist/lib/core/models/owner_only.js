"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const crypto_1 = require("@backbonedao/crypto");
const OwnerOnly = (0, base_1.ObjectModel)({
    owner: String,
    signature: String,
    data: base_1.Any,
}).assert((model) => {
    return (0, crypto_1.verify)(JSON.stringify(model.data), (0, crypto_1.hex2buf)(model.signature), (0, crypto_1.hex2buf)(model.owner));
}, "data doesn't match signature");
exports.default = OwnerOnly;
