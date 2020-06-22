import { SAVE_ACCOUNT_INFO } from '../constants/constants.js'


const initialState = {
    account: null,
    sublogin: null,
    errorInfo: null
}


export default function account(state = initialState, action) {
    switch (action.type) {
        case SAVE_ACCOUNT_INFO:
            return { ...state, ...action.payload }
        default:
            return state
    }
}