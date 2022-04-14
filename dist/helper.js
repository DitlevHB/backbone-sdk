"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.term = exports.log = void 0;
const terminal = require('terminal-kit').terminal;
function log(str = '', no_br, color = 'green') {
    terminal[color](`${str}${no_br ? '' : '\n'}`);
}
exports.log = log;
function term() {
    return terminal;
}
exports.term = term;
