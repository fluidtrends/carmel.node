import express, { Request, Response, Router } from "express"
import { Node } from '.'

export class Controller {
    private _routers: { [id: string]: express.Router }
    private _node: Node 
    private _routes: any 

    constructor(node: Node) {
        this._node = node 
        this._routers = {}
        this._routes = {
            events: {
                send: this._sendEvent.bind(this)
            }            
        }
    }

    get node () {
        return this._node
    }

    get routers () {
        return this._routers
    }

    get routes () {
        return this._routes
    }

    async _sendEvent (params: any) {
        if (!params || !params.channel || !params.id || !params.data) throw new Error('Invalid event request')

        const result = await this.node.session.station.channel(params.channel).sendEvent(params.id, params.data, params.type || "request")

        return result
    }

    _handleRoute (router: express.Router, id: string, handler: any) {        
        router.post(`/${id}`, async (req: Request, res: Response) => {
            try {
              const result = await handler(req.body)
              res.status(200).send(result)
            } catch (e) {
              res.status(500).send(e.message)
            }
        })
    }

    addRouter(id: string, routes: any = {}) {
       this.routers[id] = express.Router()
      
       for (let route in routes) {
          this._handleRoute(this.routers[id], route, routes[route])
       }

       return this.routers[id]
    }

    async _handleEvents () {
       for (let route in this.routes) {
         this.addRouter(`/${route}`, this.routes[route])
       }
    }

    async init () {
        await this._handleEvents()
    }
}