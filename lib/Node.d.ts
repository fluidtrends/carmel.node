import { Session } from '@carmel/mesh';
export declare class Node {
    private _session;
    constructor(config?: any);
    get session(): Session;
    start(): Promise<void>;
}
