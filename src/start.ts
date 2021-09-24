import { Node } from './Node' 
import merge from 'deepmerge'
import baseConfig from '../config.json'
import * as functions from './functions'

(async () => {
    const isOperator = process.env.OPERATOR
    const root = `${process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']}/.carmel/mesh${isOperator ? "-op" : ""}/`

    try {
        const config: any = merge(baseConfig, require('../config.private.json'))
        const node = new Node({ root, ...config })
        node.session.registerFunctions(functions)

        process.on('SIGINT', async () => {
            // await node.stop()
            process.exit()
        })

        // await node.start()
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
})()