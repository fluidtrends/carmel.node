import { Node } from './Node' 
import * as handlers from './handlers'

(async () => {
    const isOperator = process.env.OPERATOR
    const revision = process.env.REV || ""
    const root = `${process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']}/.carmel/mesh${isOperator ? "-op" : ""}/`

    try {
        const config = require('../private.json')
        const server = new Node({ revision, root, isOperator, ...config, handlers })

        process.on('SIGINT', async () => {
            await server.stop()
            process.exit()
        })

        await server.start()

        if (!isOperator) {
            await server.send.ping({ message: "Hello" })
        }
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
})()