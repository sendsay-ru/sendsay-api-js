import React from "react"
import meh from '../../assets/svg/meh.svg'
import './FormError.scss'


function FormError({ formError }) {
    if (formError !== null && formError.length > 0) {
        return (
            <div className="auth-form-error">
                <img className="auth-form-error__icon" src={meh} alt="Sad icon" />
                <div className="auth-form-error__block">
                    <span className="auth-form-error__title">Вход не вышел</span>
                    <span className="auth-form-error__info">{formError}</span>
                </div>
            </div>
        )
    } else {
        return ""
    }
}


export default FormError