import React from "react"


function TextArea(props) {
    const { lang, value, name, onChange, placeholder, className, readOnly } = props

    return (
        <textarea
            lang={lang}
            className={className}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
        />
    )
}


export default TextArea