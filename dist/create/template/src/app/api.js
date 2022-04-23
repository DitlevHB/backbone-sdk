"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function API(Core, Protocol) {
    return {
        async all(stream) {
            const items = await Core.query({ lt: '~' }, stream);
            return items;
        },
        async get(key) {
            const value = await Core.get(key);
            return value || null;
        },
        async del(key) {
            await Protocol({
                type: 'del',
                key,
            });
        },
        async set(params = { key: "", value: "" }) {
            await Protocol({
                type: 'set',
                key: params.key,
                value: params.value
            });
        },
    };
}
exports.default = API;
