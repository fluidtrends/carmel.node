"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipfsConfig = exports.libp2pConfig = void 0;
const libp2pConfig = () => {
    const WebRTCStar = require('libp2p-webrtc-star');
    const wrtc = require('wrtc');
    const transportKey = WebRTCStar.prototype[Symbol.toStringTag];
    const libp2p = require('ipfs-core/src/runtime/libp2p-nodejs')();
    libp2p.modules.transport.push(WebRTCStar);
    libp2p.config = {
        transport: {
            [transportKey]: { wrtc }
        }
    };
    return libp2p;
};
exports.libp2pConfig = libp2pConfig;
const ipfsConfig = (Swarm, repo) => {
    process.env.IPFS_PATH = repo;
    return {
        ipfsModule: require('ipfs'),
        remote: false,
        ipfsHttpModule: require('ipfs-http-client'),
        ipfsBin: require.resolve('ipfs/src/cli.js'),
        type: 'proc',
        ipfsOptions: {
            repo,
            libp2p: (0, exports.libp2pConfig)(),
            config: {
                Addresses: {
                    Swarm: [
                        '/ip4/0.0.0.0/tcp/4002',
                        '/ip4/127.0.0.1/tcp/4003/ws'
                    ].concat(Swarm),
                    API: '/ip4/127.0.0.1/tcp/5002',
                    Gateway: '/ip4/127.0.0.1/tcp/9090',
                    RPC: '/ip4/127.0.0.1/tcp/5003',
                }
            }
        }
    };
};
exports.ipfsConfig = ipfsConfig;
//# sourceMappingURL=config.js.map