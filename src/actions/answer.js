import { SAVE_ANSWER, SAVE_ANSWER_STATUS, CHANGE_ANSWER_LOADING } from '../constants/constants.js'


export function saveAnswer(answer) {
    return {
        type: SAVE_ANSWER,
        payload: answer,
    }
}

export function saveAnswerStatus(answerStatus) {
    return {
        type: SAVE_ANSWER_STATUS,
        payload: answerStatus,
    }
}

export function changeAnswerLoading(answer) {
    return {
        type: CHANGE_ANSWER_LOADING,
        payload: answer,
    }
}