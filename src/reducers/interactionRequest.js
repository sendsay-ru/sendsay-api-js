import { SAVE_REQUEST, CHANGE_REQUEST_STATUS } from '../constants/constants.js'


const initialState = {
    savedRequest: '',
    isValid: null
}


export default function interactionRequest(state = initialState, action) {
    switch (action.type) {
        case SAVE_REQUEST:
            return {
                ...state,
                savedRequest: action.payload
            }
        case CHANGE_REQUEST_STATUS:
            return {
                ...state,
                isValid: action.payload
            }
        default:
            return state
    }
}