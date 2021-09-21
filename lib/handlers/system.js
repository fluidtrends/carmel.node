"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.request = void 0;
const request = async ({ session, event, eventlog }) => {
    eventlog("[system request]:", event);
    console.log(session.chain);
    return { message: "ok" };
};
exports.request = request;
const response = async ({ session, event, eventlog }) => {
    eventlog("[system response]:", event);
};
exports.response = response;
//# sourceMappingURL=system.js.map