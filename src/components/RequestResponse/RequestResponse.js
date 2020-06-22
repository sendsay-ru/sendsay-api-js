import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGesture } from "react-use-gesture"
import './RequestResponse.scss'
import { saveRequest, changeRequestStatus } from '../../actions/request'
import Textarea from '../Textarea'
import { isJsonString } from '../../helpers/helpers.js'


function RequestResponse() {
    const dispatch = useDispatch()
    const answerData = useSelector(store => store.answerData.answerData)
    const answerStatus = useSelector(store => store.answerData.answerStatus)
    const requestData = useSelector(store => store.requestData.savedRequest)
    const requestIsValid = useSelector(store => store.requestData.isValid)
    const [[left, right], set] = useState([0, 0])


    useEffect(() => {
        let nextLeft = Number(localStorage.getItem('left'))
        let nextRight = Number(localStorage.getItem('right'))
        set([nextLeft, nextRight])
    }, [])


    useEffect(() => {
        window.addEventListener('beforeunload', handleWindowBeforeUnload)
        return () => {
            document.removeEventListener('keyup', handleWindowBeforeUnload)
        }

        function handleWindowBeforeUnload() {
            localStorage.setItem('left', `${left}`)
            localStorage.setItem('right', `${right}`)
        }
    })


    const bind = useGesture({
        onDrag: ({ delta: [dx], temp = left }) => {
            const nextLeft = temp + dx
            const nextRight = left + right - nextLeft

            set([nextLeft, nextRight])
            return temp
        }
    })

    const handleChange = e => {

        if (isJsonString(e.target.value)) {
            dispatch(changeRequestStatus(null))
        }

        dispatch(saveRequest(e.target.value))
    }


    return (
        <div className="request-response">
            <div className="request-response__block" style={{ width: left }} >
                <span className={`request-response__title ${requestIsValid ? "request-response__title_error" : " "}`}>Запрос:</span>

                <Textarea
                    lang="en"
                    onChange={handleChange}
                    className={`request-response__textarea ${requestIsValid && `request-response__textarea_${requestIsValid}`}`}
                    value={requestData}
                    name={"requestTextarea"}
                />
            </div>

            <div className="request-response-separ">
                <div className="request-response-separ__block" {...bind()} >
                    <div className="request-response-separ__dots">
                        <span className="request-response-separ__dot"></span>
                        <span className="request-response-separ__dot"></span>
                        <span className="request-response-separ__dot"></span>
                    </div>
                </div>
            </div>

            <div className="request-response__block" style={{ width: right }}>

                <span className={`request-response__title ${answerStatus ? "request-response__title_error" : ""}`}>Ответ:</span>

                <Textarea
                    lang="en"
                    className={`request-response__textarea request-response__textarea_${answerStatus}`}
                    value={answerData}
                    name={"requestTextareaAnswer"}
                    readOnly={"readonly"}
                />
            </div>

        </div>
    )
}


export default RequestResponse