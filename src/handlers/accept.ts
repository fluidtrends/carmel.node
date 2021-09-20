export const request = async ({ session, event, eventlog }: any) => {
    eventlog("[accept request]:", event)
    return { message: "ok" }
}

export const response = async ({ session, event, eventlog }: any) => {
    eventlog("[accept response]:", event)
}