"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.request = void 0;
const request = async ({ session, event, eventlog }) => {
    eventlog("[system request]:", event);
    const { call, data } = event;
    let result = { message: "skipped" };
    switch (call) {
        case "register":
            eventlog(`registering ${data.username} ...`);
            result = await session.server.chain.eos.system(session.server.chain, "caccount", { username: data.username, pub_key: data.publicKey, did: `did:carmel:${data.cid}` });
            break;
    }
    return result;
};
exports.request = request;
const response = async ({ session, event, eventlog }) => {
    eventlog("[system response]:", event);
};
exports.response = response;
//# sourceMappingURL=system.js.map