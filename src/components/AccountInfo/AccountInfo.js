import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendAccountRequest } from '../../actions/account'
import './AccountInfo.scss'


function AccountInfo() {
    const dispatch = useDispatch()
    const { account, sublogin } = useSelector(store => store.account)
    const authFormSubloginValue = localStorage.getItem('subLogin')

    useEffect(() => {
        dispatch(sendAccountRequest('{"action":"pong"}'))
    }, [dispatch])

    return (
        <div className="account-info">
            <span>{account}</span>
            {authFormSubloginValue && <>
                <span className="account-info__separ">:</span>
                <span>{sublogin}</span>
            </>
            }
        </div>
    )
}

export default AccountInfo