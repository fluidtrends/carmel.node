export const request = async ({ session, event, eventlog }: any) => {
    eventlog("[system request]:", event)

    const { call, data } = event 
    let result: any = { message: "skipped" }

    switch (call) {
        case "register":
            eventlog(`registering ${data.username} ...`)
            result = await session.server._.system("caccount", { username: data.username, pub_key: data.publicKey, did: data.did })
            break
        case "update":
            eventlog(`updating ${data.username} ...`)
            result = await session.server._.system("uaccount", { username: data.username, did: data.did, sig: data.signature })
            break
        }

    return result 
}

export const response = async ({ session, event, eventlog }: any) => {
    eventlog("[system response]:", event)
}