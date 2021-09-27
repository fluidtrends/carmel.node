import { Session } from '@carmel/mesh/src'
import { ipfsConfig, Controller } from '.'
import fs from 'fs-extra'
import debug from 'debug'
import passport from 'passport'
import express, { Express } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import helmet from 'helmet'
import path from 'path'

const LOG = debug("carmel:node")
const DEFAULT_ROOT = `${process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']}/.carmel/mesh/`
const PORT = process.env.OPERATOR ? 9999 : 8888
export class Node {

    private _session: Session
    private _root: string 
    private _ipfs: any
    private _app: any 
    private _server: any 
    private _ctl: Controller

    constructor (config: any = {}) {
        this._root = config.root || DEFAULT_ROOT
        this._app = express()
   
        fs.existsSync(this.root) || fs.mkdirpSync(this.root)
        
        this._session = new Session({ ...config, root: this.root })
        this._ctl = new Controller(this)
    }

    get ctl () {
        return this._ctl
    }

    get baseUrl() {
        return 'http://0.0.0.0'
    }

    get server() {
        return this._server
    }

    get app () {
        return this._app 
    }

    get ipfs () {
        return this._ipfs
    }

    get session() {
        return this._session
    }

    get root () {
        return this._root
    }

    async stop () {
        LOG('stopping ...')

        await this.session.stop()

        try {
            await this.ipfs.stop()
        } catch {}

        LOG('stopped')
    }

    async _startServer () {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        this.app.use(
         cors({
           origin: this.baseUrl,
           methods: ['GET', 'POST'],
           credentials: true,
         }))

        this.app.use((req: any, res: any, next: any) => {
         res.header('Access-Control-Allow-Origin', this.baseUrl)
         res.header('Access-Control-Allow-Credentials', 'true')
         next()
        })

        this.app.use(helmet())

        await this.ctl.init()

        for (let route in this.ctl.routers) {
            this.app.use(`${route}`, this.ctl.routers[route])
        }

        this._server = new http.Server(this.app)

        await new Promise((r) => this.server.listen(PORT, async () => {
           LOG("server started", `${this.baseUrl}:${PORT}`)        
           r("")
        }))
    }

    async start () {
       LOG('starting ...')

       await this._startServer()

       const relays = await this.session.chain.fetch.relays()
       const config = ipfsConfig(relays, `${this.root}/ipfs`, this.session.config.isOperator ? [4202, 4203, 5202, 5203, 9290] : [4102, 4103, 5102, 5103, 9190])
    
       const { ipfsBin } = config 
       const { createFactory } = require('ipfsd-ctl')

       const factory = createFactory(config, { js: { ipfsBin } })
       this._ipfs = await factory.spawn()

       LOG('connected to IPFS')

       await this.session.start(this.ipfs)
    }
}