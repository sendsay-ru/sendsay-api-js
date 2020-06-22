import { CHANGE_AUTHORIZAION, CHANGE_FULLSCREEN } from '../constants/constants.js'

export function logIn(data) {
    return {
        type: CHANGE_AUTHORIZAION,
        payload: data,
    }
}


export function toggleFullscreen(bool) {
    return {
        type: CHANGE_FULLSCREEN,
        payload: bool,
    }
}