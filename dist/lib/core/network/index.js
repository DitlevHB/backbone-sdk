"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.getSwarm = void 0;
const common_1 = require("../common");
const network_node_1 = __importDefault(require("@backbonedao/network-node"));
const crypto_1 = require("@backbonedao/crypto");
const network_node_2 = __importDefault(require("@backbonedao/network-node"));
const chunker_1 = require("./chunker");
const streamx_1 = require("streamx");
let network;
async function getSwarm(network_config) {
    if (!network)
        network = (0, network_node_1.default)(network_config);
    return network;
}
exports.getSwarm = getSwarm;
async function connect(opts) {
    if (this.network)
        return (0, common_1.error)('NETWORK EXISTS');
    if (!this.config?.network)
        return (0, common_1.error)('CONNECT NEEDS NETWORK CONFIG');
    if (this.config.private)
        return (0, common_1.error)('ACCESS DENIED - PRIVATE CORE');
    const network_config = this.config.network;
    (0, common_1.emit)({
        ch: 'network',
        msg: `Connect with conf: ${JSON.stringify(network_config)}`,
    });
    if (this.config.firewall)
        network_config.firewall = this.config.firewall;
    if (!this.config.network_id) {
        this.config.network_id = (0, crypto_1.keyPair)();
    }
    network_config.keyPair = this.config.network_id;
    let self = this;
    async function connectToNetwork() {
        try {
            const network = (0, network_node_2.default)(network_config);
            network.on('connection', async (socket, user) => {
                (0, common_1.emit)({
                    event: 'network.new-connection',
                    ch: 'network',
                    msg: `New connection from ${(0, crypto_1.buf2hex)(user.peer.host).slice(0, 8)}`,
                });
                const split = new chunker_1.Split({ chunkSize: 2 * 1024 });
                const merge = new chunker_1.Merge();
                const merged = (0, streamx_1.pipeline)(socket, merge, self.datamanager.replicate(user.client, { live: true }));
                const r = (0, streamx_1.pipeline)(merged, split, socket);
                r.on('error', (err) => {
                    (0, common_1.error)(err.message);
                });
                self.connected_peers++;
            });
            (0, common_1.emit)({
                ch: 'network',
                event: 'network.connecting',
                msg: `Connecting to backbone://${self.address}...`,
            });
            network.join(Buffer.isBuffer(self.address_hash)
                ? self.address_hash
                : Buffer.from(self.address_hash, 'hex'));
            await network.flush(() => { });
            return network;
        }
        catch (err) {
            (0, common_1.error)(err);
        }
    }
    if (!opts?.local_only) {
        this.network = await connectToNetwork();
        this.connection_id = (0, crypto_1.buf2hex)(this.network.webrtc.id);
        (0, common_1.emit)({
            ch: 'network',
            event: 'network.connected',
            msg: `Connected to backbone://${self.address} with id ${this.connection_id.slice(0, 8)}`,
        });
    }
    else {
        (0, common_1.emit)({
            ch: 'network',
            msg: `Using local connection`,
        });
        this.network = this.datamanager.replicate(opts?.local_only?.initiator, { live: true });
    }
    return this.network;
}
exports.connect = connect;
