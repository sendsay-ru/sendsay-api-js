import {
    SAVE_REQUEST_HISTORY,
    ERASE_REQUESTS_HISTORY,
    DELETE_REQUEST_HISTORY,
    SAVE_REQUEST_HISTORY_INITIAL
} from '../constants/constants.js'


export function saveRequestHistory(data) {
    return {
        type: SAVE_REQUEST_HISTORY,
        payload: data,
    }
}

export function eraseAllRequestsHistory() {
    return { type: ERASE_REQUESTS_HISTORY }
}

export function deleteRequestHistory(request) {
    return {
        type: DELETE_REQUEST_HISTORY,
        payload: request,
    }
}

export function saveRequestHistoryInitial(initialData) {
    return {
        type: SAVE_REQUEST_HISTORY_INITIAL,
        payload: initialData,
    }
}