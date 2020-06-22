import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './ActionPanels.scss'
import { saveRequest, changeRequestStatus } from '../../actions/request'
import { sendRequest } from '../../actions/sendRequest'
import { ReactComponent as FormatIcon } from '../../assets/svg/format.svg'
import GitHubLink from '../GitHubLink'
import Button from '../Button'
import { isJsonString } from '../../helpers/helpers.js'


function ActionPanels() {
    const requestData = useSelector(store => store.requestData.savedRequest)
    const answerIsLoading = useSelector(store => store.answerData.answerIsLoading)
    const dispatch = useDispatch()


    const sendRequestFunction = () => {
        if (isJsonString(requestData)) {
            dispatch(sendRequest())
        } else {
            dispatch(changeRequestStatus('error'))
        }
    }

    const formatRequest = () => {
        if (isJsonString(requestData)) {
            dispatch(saveRequest(JSON.stringify(JSON.parse(requestData), null, 2)))
        }
    }


    return (
        <div className="action-panels">

            <Button
                title={"Отправить"}
                action={sendRequestFunction}
                className={"btn_standart"}
                loading={answerIsLoading}
            />

            <GitHubLink />

            <Button
                title={"Форматировать"}
                action={formatRequest}
                className={"btn_transparent"}
                left={<FormatIcon className="action-panels__format-icon" aria-hidden="true"/>}>
            </Button >

        </div>
    )
}

export default ActionPanels