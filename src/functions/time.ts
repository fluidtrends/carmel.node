import moment from 'moment'

export const request = async ({ log, session, channel, id, from, type, data }: any) => {
    log(`getting time ...`, data)

    return { timestamp: `${Date.now()}`, formatted: `${moment().format(data.format)}`, carmel: data.carmel || {} } 
}

export const response = async ({ log, session, channel, data }: any) => {
    log(`getting time response ...`, data)

    return data
}