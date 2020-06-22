import { takeEvery, put, call } from 'redux-saga/effects'
import { saveAccountInfo } from '../actions/account'
import { SEND_ACCOUNT_REQUEST } from '../constants/constants.js'
import { fetchData } from './sagas'


function* workerLoadAccountInfo(action) {
    const requestData = action.payload
    let requestDataObject = JSON.parse(requestData)

    try {
        let res = yield call(fetchData, requestDataObject)

        let obj = {
            status: 'success',
            account: res.account,
            sublogin: res.sublogin
        }

        yield put(saveAccountInfo(obj))
    }
    catch (error) {

        let obj = {
            status: 'error',
            errorInfo: error
        }

        yield put(saveAccountInfo(obj))
    }
}


export function* watchLoadAccountInfo() {
    yield takeEvery(SEND_ACCOUNT_REQUEST, workerLoadAccountInfo)
}
