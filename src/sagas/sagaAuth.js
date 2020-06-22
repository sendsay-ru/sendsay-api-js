import { takeEvery, put, call, select } from 'redux-saga/effects'
import * as selectors from '../selectors/selectors'
import { changeFormErrorStatus, changeFormLoadingStatus } from '../actions/authorization'
import { logIn } from '../actions/app'
import { SEND_AUTH_FORM } from '../constants/constants.js'
import { fetchData } from './sagas'


function* workerLoadAuthorization() {
    const authorizationFormData = yield select(selectors.authorizationFormData)

    yield put(changeFormLoadingStatus(true))

    try {
        let res = yield call(fetchData, { action: 'sys.settings.get', list: ['about.id'] })
        document.cookie = `token = ${res.list['about.id']}`
        yield put(logIn(true))

        if (authorizationFormData.formError) {
            yield put(changeFormErrorStatus({ formError: null }))
        }

    } catch (error) {

        let obj = {
            id: error.id,
            explain: error.explain
        }

        yield put(changeFormErrorStatus({ formError: JSON.stringify(obj) }))
    }

    yield put(changeFormLoadingStatus(false))
}


export function* watchLoadAuthorization() {
    yield takeEvery(SEND_AUTH_FORM, workerLoadAuthorization)
}