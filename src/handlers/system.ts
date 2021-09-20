export const request = async ({ session, event, eventlog }: any) => {
    eventlog("[system request]:", event)
    console.log(session.chain)
    return { message: "ok" }
}

export const response = async ({ session, event, eventlog }: any) => {
    eventlog("[system response]:", event)
}