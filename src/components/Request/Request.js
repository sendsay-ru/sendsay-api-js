import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import './Request.scss'
import { deleteRequestHistory } from '../../actions/requestHistory'
import { sendRequest } from '../../actions/sendRequest'
import { saveRequest } from '../../actions/request'
import { writeToBufer } from '../../helpers/helpers'
import Portal from "../Portal"
import TooltipPopover from "../TooltipPopover"


function Request({ actionName, status, data }) {
    const dispatch = useDispatch()
    const [dropDownStatus, setDropDownToggle] = useState(false)
    const [animateCopy, setCopyAnimate] = useState(false)
    const [coords, setCoords] = useState({})
    const wrapperRef = useRef(null)
    const textInput = useRef(null)
    const btnRef = useRef(null)
    const options = ['Выполнить', 'Скопировать', 'Удалить']


    const handleClickOutside = useCallback(e => {
        if (dropDownStatus) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setDropDownToggle(false)
            }
        }
    }, [dropDownStatus])


    useEffect(() => {
        document.addEventListener("keydown", handleHideDropdown, true)
        document.addEventListener("click", handleClickOutside, false)
        return () => {
            document.removeEventListener("keydown", handleHideDropdown, true)
            document.removeEventListener("click", handleClickOutside, false)
        }
    }, [handleClickOutside])


    const toggleDropDown = e => {
        e.stopPropagation()
        setDropDownToggle(!dropDownStatus)
    }

    const handleHideDropdown = e => {
        if (e.key === "Escape") {
            e.target.blur()
            setDropDownToggle(false)
        }
    }

    const handleClickToDropdown = e => {
        e.stopPropagation()

        if (e.target.innerHTML === options[1]) {
            setCopyAnimate(!animateCopy)
            if (navigator.clipboard) {
                writeToBufer(JSON.stringify(data.request))
            }
            setDropDownToggle(false)
        } else if (e.target.innerHTML === options[2]) {
            dispatch(deleteRequestHistory(data))
            setDropDownToggle(false)
        } else if (e.target.innerHTML === options[0]) {
            dispatch(saveRequest(JSON.stringify(data.request)))
            dispatch(sendRequest())
            setDropDownToggle(false)
        }
    }

    const handleClick = () => {
        dispatch(saveRequest((JSON.stringify(data.request, null, 2))))
    }

    const renderDropdownOptions = () => {

        if (!options) {
            return
        }

        return options.map((option, i) => {
            return (
                <li className="request-dropdown__item" key={i}>
                    <button
                        className="request-dropdown__btn"
                        onClick={handleClickToDropdown}>{option}
                    </button>
                </li>
            )
        })
    }

    const updateTooltipCoords = el => {
        let dropdown = textInput.current.getBoundingClientRect()
        let dropDownWidth = dropdown.width
        const rect = el.getBoundingClientRect()

        // Если слева места недостаточно
        if (dropDownWidth > rect.right) {
            setCoords({
                left: rect.x,
                top: rect.y + rect.height
            })
        } else {
            setCoords({
                left: (rect.x + rect.width) - dropDownWidth,
                top: rect.y + rect.height
            })
        }
    }


    return (
        <div className="request" ref={wrapperRef} onClick={handleClick} >
            <div className="request__inner" ref={btnRef}>
                <span className={`request__status request__status_${status || "error"}`}></span>

                <div className="request__wrap-name">
                    <span className="request__name">{actionName || "action is wrong"}</span>
                    <span
                        className={"request-copied " + (animateCopy ? "request-copied_animated" : "")}
                        onAnimationEnd={() => setCopyAnimate(!animateCopy)}
                    >
                        Скопировано
                    </span>
                </div>


                <button className="request-dots"
                    onClick={(e) => {
                        toggleDropDown(e)
                        updateTooltipCoords(e.target.closest('.request__inner'))
                    }}
                    aria-haspopup="true"
                >
                    <span className="request-dots__dot"></span>
                    <span className="request-dots__dot"></span>
                    <span className="request-dots__dot"></span>

                    <Portal>
                        <TooltipPopover
                            coords={coords}
                            updateTooltipCoords={() => updateTooltipCoords(btnRef.current)}>
                            <ul className={`request-dropdown  ${dropDownStatus ? "request-dropdown_active" : ""}`}
                                ref={textInput}
                                aria-label="submenu">
                                {renderDropdownOptions()}
                            </ul>
                        </TooltipPopover>
                    </Portal>
                </button>
            </div>
        </div>
    )
}


export default Request