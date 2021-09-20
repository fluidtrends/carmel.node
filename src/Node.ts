import { Session } from '@carmel/mesh/src'
import { ipfsConfig } from '.'
import path from 'path'
import fs from 'fs-extra'
import debug from 'debug'

const LOG = debug("carmel:node")
const DEFAULT_ROOT = `${process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']}/.carmel/mesh/`

export class Node {

    private _session: Session
    private _root: string 

    constructor (config: any = {}) {
        this._root = config.root || DEFAULT_ROOT
        
        fs.existsSync(this.root) || fs.mkdirpSync(this.root)
        
        this._session = new Session({
            isOperator: true,
            ...config,
            root: this.root,
        })
    }

    get session() {
        return this._session
    }

    get root () {
        return this._root
    }

    async stop () {
        LOG('stopping IPFS node')
        await this.session.stop()
    }

    async start () {
       const relays = await this.session.server.resolveRelays()
       const config = ipfsConfig(relays, `${this.root}/ipfs`, this.session.config.isOperator ? [4002, 4003, 5002, 5003, 9090] : [4102, 4103, 5102, 5103, 9190])
    
       const { ipfsBin } = config 
       const { createFactory } = require('ipfsd-ctl')

       const factory = createFactory(config, { js: { ipfsBin } })
       const ipfs = await factory.spawn()

       LOG('spawned IPFS node')

       await this.session.start(ipfs)
    }

    get send () {
        return this.session.server.send
    }
}