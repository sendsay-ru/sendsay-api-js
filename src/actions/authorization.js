import {
    CHANGE_FORM_VALUE,
    CHANGE_INPUTS_VALIDATE,
    CHANGE_FORM_VALIDATE,
    CHANGE_SUBMIT_STATUS,
    CHANGE_INVALID_STATUS,
    CHANGE_FORM_ERROR_STATUS,
    CHANGE_FORM_LOADING_STATUS,
    SEND_AUTH_FORM
} from '../constants/constants.js'


export function changeFormValue(value) {
    return {
        type: CHANGE_FORM_VALUE,
        payload: value,
    }
}

export function changeInputsValidate(data) {
    return {
        type: CHANGE_INPUTS_VALIDATE,
        payload: data,
    }
}

export function changeFormValidate(data) {
    return {
        type: CHANGE_FORM_VALIDATE,
        payload: data,
    }
}

export function changeSubmitStatus(status) {
    return {
        type: CHANGE_SUBMIT_STATUS,
        payload: status,
    }
}

export function changeInvalidStatus(data) {
    return {
        type: CHANGE_INVALID_STATUS,
        payload: data,
    }
}

export function changeFormErrorStatus(data) {
    return {
        type: CHANGE_FORM_ERROR_STATUS,
        payload: data,
    }
}

export function changeFormLoadingStatus(data) {
    return {
        type: CHANGE_FORM_LOADING_STATUS,
        payload: data,
    }
}

export function sendAuthForm() {
    return {
        type: SEND_AUTH_FORM,
    }
}