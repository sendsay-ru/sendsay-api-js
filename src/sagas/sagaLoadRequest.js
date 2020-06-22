import { takeEvery, put, call, select } from 'redux-saga/effects'
import * as selectors from '../selectors/selectors'
import { saveAnswer, saveAnswerStatus, changeAnswerLoading } from '../actions/answer'
import { saveRequestHistory } from '../actions/requestHistory'
import { SEND_REQUEST } from '../constants/constants.js'
import {fetchData} from './sagas'


function* workerLoadData() {
    const requestData = yield select(selectors.requestData)
    let requestDataObject = JSON.parse(requestData)

    yield put(changeAnswerLoading(true))

    try {
        yield call(fetchData, requestDataObject)

        let obj = {
            status: 'success',
            actionName: requestDataObject.action,
            request: requestDataObject
        }

        yield put(saveAnswer(JSON.stringify(obj)))
        yield put(saveAnswerStatus(''))
        yield put(saveRequestHistory(obj))
    }
    catch (error) {
        let obj = {
            status: 'error',
            actionName: requestDataObject.action,
            request: requestDataObject,
            errorInfo: error
        }
        yield put(saveAnswer(JSON.stringify(obj)))
        yield put(saveAnswerStatus('error'))
        yield put(saveRequestHistory(obj))
    }

    yield put(changeAnswerLoading(false))
}


export function* watchLoadData() {
    yield takeEvery(SEND_REQUEST, workerLoadData)
}