import {
    SAVE_REQUEST_HISTORY,
    ERASE_REQUESTS_HISTORY,
    DELETE_REQUEST_HISTORY,
    SAVE_REQUEST_HISTORY_INITIAL
} from '../constants/constants.js'


const initialState = {
    maxCountRequests: 15,
    requestHistory: []
}


export default function interactionRequestHistory(state = initialState, action) {
    switch (action.type) {
        case SAVE_REQUEST_HISTORY:
            if (state.requestHistory.length < state.maxCountRequests) {
                if (isUnic(action.payload.actionName)) {
                    return { ...state, requestHistory: [...state.requestHistory, action.payload].reverse() }
                } else {
                    state.requestHistory.unshift(...state.requestHistory.splice(findIndex(action.payload.actionName), 1))
                    return { ...state, requestHistory: [...state.requestHistory] }
                }
            }
            return {
                ...state
            }
        case DELETE_REQUEST_HISTORY:
            state.requestHistory.splice(findIndex(action.payload.actionName), 1)
            return {
                ...state, requestHistory: [...state.requestHistory]
            }
        case ERASE_REQUESTS_HISTORY:
            return {
                ...state, requestHistory: []
            }
        case SAVE_REQUEST_HISTORY_INITIAL:
            return {
                ...state, requestHistory: [...action.payload]
            }
        default:
            return state
    }

    function isUnic(actionName) {
        return !state.requestHistory.some(item => item.actionName === actionName)
    }

    function findIndex(actionName) {
        return state.requestHistory.findIndex(item => item.actionName === actionName)
    }
}