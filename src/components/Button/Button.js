import React from "react"
import './Button.scss'
import Loader from '../Loader'


const Button = props => {
    const { title, action, className, disabled, loading, arialabel } = props

    return (
        <button
            className={`btn ${className}`}
            onClick={action}
            disabled={disabled}
            aria-label={arialabel}
        >
            {props.left}
            <span className={`btn__text ${loading ? "btn__text_hidden" : ""}`}>{title}</span>
            {loading && <Loader />}
            {props.right}
        </button>
    )
}


export default Button