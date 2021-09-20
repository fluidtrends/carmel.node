import { Node } from './Node' 

(async () => {
    const isOperator = process.env.OPERATOR
    const revision = process.env.REV || ""
    const root = `${process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']}/.carmel/mesh${isOperator ? "-op" : ""}/`

    const server = new Node({ revision, root, isOperator })

    process.on('SIGINT', async () => {
        await server.stop()
        process.exit()
    })

    await server.start()

    if (!isOperator) {
        await server.send.ping("Hello")
    }
})()