import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './HistoryPanel.scss'
import Button from '../Button'
import Request from '../Request'
import { ReactComponent as ClearIcon } from '../../assets/svg/clear.svg'
import { eraseAllRequestsHistory } from '../../actions/requestHistory'


function HistoryPanel() {
    const dispatch = useDispatch()
    const requestHistory = useSelector(store => store.requestHistory.requestHistory)


    const generateHistoryItems = useMemo(() => {

        if (requestHistory.length === 0) {
            return
        }

        return requestHistory.map((item, i) => {
            return (
                <Request {...item} key={i} data={item} />
            )
        })
    }, [requestHistory])


    const eraseRequestsHistory = () => {
        dispatch(eraseAllRequestsHistory())
    }

    const toScrollBlock = e => {
        let target = e.target.closest('.history-panel__requests')
        if (target.clientWidth !== target.scrollWidth) {
            target.scrollLeft -= (e.nativeEvent.wheelDelta * 40)
        }
    }


    return (
        <div className="history-panel">
            <div className="history-panel__requests" onWheel={toScrollBlock}>
                {generateHistoryItems}
            </div>

            <div className="history-panel__wrap-btn">
                <Button
                    className={"btn_transparent"}
                    action={eraseRequestsHistory}
                    left={<ClearIcon aria-hidden="true" />}
                    arialabel="Очистить">
                </Button>
            </div>
        </div>
    )
}


export default HistoryPanel