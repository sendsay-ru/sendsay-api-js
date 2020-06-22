import {
    CHANGE_FORM_VALUE,
    CHANGE_INPUTS_VALIDATE,
    CHANGE_FORM_VALIDATE,
    CHANGE_SUBMIT_STATUS,
    CHANGE_INVALID_STATUS,
    CHANGE_FORM_ERROR_STATUS,
    CHANGE_FORM_LOADING_STATUS
} from '../constants/constants.js'


const initialState = {
    login: '',
    subLogin: '',
    password: '',
    loginValid: false,
    passwordValid: false,
    allFormValid: false,
    isLoginInvalid: false,
    isPasswordInvalid: false,
    isSubmitDisabled: false,
    formError: null,
    isFormAnswerLoading: false
}


export default function authorization(state = initialState, action) {
    switch (action.type) {
        case CHANGE_FORM_VALUE:
            return { ...state, ...{ [action.payload.name]: action.payload.value } }
        case CHANGE_INPUTS_VALIDATE:
            return { ...state, ...action.payload }
        case CHANGE_FORM_VALIDATE:
            return { ...state, allFormValid: action.payload }
        case CHANGE_SUBMIT_STATUS:
            return { ...state, isSubmitDisabled: action.payload }
        case CHANGE_INVALID_STATUS:
            return { ...state, ...action.payload }
        case CHANGE_FORM_ERROR_STATUS:
            return { ...state, ...action.payload }
        case CHANGE_FORM_LOADING_STATUS:
            return { ...state, isFormAnswerLoading: action.payload }
        default:
            return state
    }
}