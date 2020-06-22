import { combineReducers } from 'redux'
import interactionRequest from './interactionRequest'
import interactionAnswer from './interactionAnswer'
import interactionRequestHistory from './interactionRequestHistory'
import app from './app'
import account from './account'
import authorization from './authorization'


export const rootReducer = combineReducers({
    app,
    authorizationForm: authorization,
    account,
    requestData: interactionRequest,
    answerData: interactionAnswer,
    requestHistory: interactionRequestHistory,
})