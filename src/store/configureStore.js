import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootReducer } from '../reducers'
import { watchLoadAccountInfo, } from '../sagas/sagaLoadInfo'
import { watchLoadData } from '../sagas/sagaLoadRequest'
import { watchLoadAuthorization } from '../sagas/sagaAuth'


const sagaMiddleware = createSagaMiddleware()

const middleware = [
    applyMiddleware(sagaMiddleware),
    ...(window.__REDUX_DEVTOOLS_EXTENSION__ ? [window.__REDUX_DEVTOOLS_EXTENSION__()] : [])
]


export const store = createStore(rootReducer, compose(...middleware))


sagaMiddleware.run(watchLoadData)
sagaMiddleware.run(watchLoadAccountInfo)
sagaMiddleware.run(watchLoadAuthorization)