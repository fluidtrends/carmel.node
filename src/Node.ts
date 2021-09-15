import { Session } from '@carmel/mesh'
import { ipfsConfig } from '.'
import path from 'path'
import fs from 'fs-extra'
import debug from 'debug'

const LOG = debug("carmel:node")

export class Node {

    private _session: Session

    constructor (config: any = {}) {
        this._session = new Session({
            isOperator: true,
            ...config            
        })
    }

    get session() {
        return this._session
    }

    async start () {
       const mesh = await this.session.node.resolveMesh()
       const repo = `.cache_ipfs`

       const config = ipfsConfig(mesh.swarm, repo)
    
       const { ipfsBin } = config 
       const { createFactory } = require('ipfsd-ctl')

       const factory = createFactory(config, { js: { ipfsBin } })
       const ipfs = await factory.spawn()

       LOG('spawned IPFS node')

       await this.session.start(ipfs)
    }
}