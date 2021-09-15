"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const mesh_1 = require("@carmel/mesh");
const _1 = require(".");
const debug_1 = __importDefault(require("debug"));
const LOG = (0, debug_1.default)("carmel:node");
class Node {
    constructor(config = {}) {
        this._session = new mesh_1.Session(Object.assign({ isOperator: true }, config));
    }
    get session() {
        return this._session;
    }
    async start() {
        const mesh = await this.session.node.resolveMesh();
        const repo = `.cache_ipfs`;
        const config = (0, _1.ipfsConfig)(mesh.swarm, repo);
        const { ipfsBin } = config;
        const { createFactory } = require('ipfsd-ctl');
        const factory = createFactory(config, { js: { ipfsBin } });
        const ipfs = await factory.spawn();
        LOG('spawned IPFS node');
        await this.session.start(ipfs);
    }
}
exports.Node = Node;
//# sourceMappingURL=Node.js.map