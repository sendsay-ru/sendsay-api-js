import React, { useEffect } from "react"
import debounce from "lodash/debounce"
import './TooltipPopover.scss'


const TooltipPopover = ({ children, coords, updateTooltipCoords }) => {
    const updateCoords = debounce(updateTooltipCoords, 100)

    useEffect(() => {
        window.addEventListener("resize", updateCoords)
        return () => window.removeEventListener("resize", updateCoords)
    }, [updateCoords])


    return (
        <div className="popover" style={{ ...coords }} >
            <div className="popover__inner">{children}</div>
        </div>
    )
}

export default TooltipPopover