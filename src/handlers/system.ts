export const request = async ({ session, event, eventlog }: any) => {
    eventlog("[system request]:", event)

    const { call, data } = event 
    let result: any = { message: "skipped" }

    switch (call) {
        case "register":
            eventlog(`registering ${data.username} ...`)
            result = await session.server.chain.eos.system(session.server.chain, "caccount", { username: data.username, pub_key: data.publicKey, did: `did:carmel:${data.cid}` })
            break
    }

    return result 
}

export const response = async ({ session, event, eventlog }: any) => {
    eventlog("[system response]:", event)
}