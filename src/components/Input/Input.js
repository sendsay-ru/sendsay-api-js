import React from "react"
import './Input.scss'


const Input = props => {
    const { type, name, title, value, placeholder, onChange, wrapсlass, titleсlass } = props

    return (
        <div className={`input ${wrapсlass}`}>
            <label className={titleсlass} htmlFor={name}>
                {title}
            </label>

            <input
                className={`input__field`}
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
            />
        </div>
    )
}

export default Input