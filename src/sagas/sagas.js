import Sendsay from 'sendsay-api'
import { getAuthLocalStorageData } from '../helpers/helpers'


export function fetchData(requestData) {
    let localStorageData = getAuthLocalStorageData()

    const sendsay = new Sendsay({
        auth: {
            login: localStorageData.login,
            subLogin: localStorageData.subLogin,
            password: localStorageData.password
        }
    })

    return sendsay.request(requestData)
}