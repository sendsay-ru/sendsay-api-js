import { CHANGE_AUTHORIZAION, CHANGE_FULLSCREEN } from '../constants/constants.js'


const initialState = {
    isLogged: false,
    isFullScreen: false,
}


export default function appReduces(state = initialState, action) {
    switch (action.type) {
        case CHANGE_AUTHORIZAION:
            return { ...state, isLogged: action.payload }
        case CHANGE_FULLSCREEN:
            return { ...state, isFullScreen: action.payload }
        default:
            return state
    }
}