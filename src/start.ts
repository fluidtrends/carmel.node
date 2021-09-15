import { Node } from './Node' 

(async () => {
    const server = new Node()
    await server.start()
})()