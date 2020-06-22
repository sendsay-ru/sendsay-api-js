import { SAVE_REQUEST, CHANGE_REQUEST_STATUS } from '../constants/constants.js'


export function saveRequest(request) {
    return {
        type: SAVE_REQUEST,
        payload: request,
    }
}

export function changeRequestStatus(requestStatus) {
    return {
        type: CHANGE_REQUEST_STATUS,
        payload: requestStatus,
    }
}