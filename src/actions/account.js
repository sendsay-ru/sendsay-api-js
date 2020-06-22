import { SEND_ACCOUNT_REQUEST, SAVE_ACCOUNT_INFO } from '../constants/constants.js'


export function sendAccountRequest(data) {
    return {
        type: SEND_ACCOUNT_REQUEST,
        payload: data,
    }
}

export function saveAccountInfo(data) {
    return {
        type: SAVE_ACCOUNT_INFO,
        payload: data,
    }
}
