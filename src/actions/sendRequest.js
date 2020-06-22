import { SEND_REQUEST } from '../constants/constants.js'


export function sendRequest(request) {
    return {
        type: SEND_REQUEST,
        payload: request
    }
}