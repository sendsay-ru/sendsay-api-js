import { SAVE_ANSWER, SAVE_ANSWER_STATUS, CHANGE_ANSWER_LOADING } from '../constants/constants.js'


const initialState = {
    answerData: '',
    answerStatus: null,
    answerIsLoading: false
}


export default function interactionAnswer(state = initialState, action) {
    switch (action.type) {
        case SAVE_ANSWER:
            return { ...state, answerData: JSON.stringify(JSON.parse(action.payload), null, 2) }
        case SAVE_ANSWER_STATUS:
            return { ...state, answerStatus: action.payload }
        case CHANGE_ANSWER_LOADING:
            return { ...state, answerIsLoading: action.payload }
        default:
            return state
    }
}