import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './AuthorizationForm.scss'
import Logo from '../../assets/svg/logo.svg'
import FormError from '../FormError'
import Input from '../Input/Input'
import Button from '../Button'
import GitHubLink from '../GitHubLink'
import {
    changeFormValue, changeInputsValidate,
    changeFormValidate, changeSubmitStatus,
    changeInvalidStatus, sendAuthForm
} from '../../actions/authorization'
import { logIn } from '../../actions/app'
import { getCookie } from '../../helpers/helpers'



function AuthorizationForm() {
    const dispatch = useDispatch()
    const { login, subLogin, password, loginValid, passwordValid,
        isSubmitDisabled, isFormAnswerLoading, isPasswordInvalid,
        isLoginInvalid, formError, allFormValid,
    } = useSelector(store => store.authorizationForm)


    useEffect(() => {
        const token = getCookie('token')

        if (token) {
            dispatch(logIn(true))
        }
    }, [dispatch])


    useEffect(() => {

        if (loginValid && passwordValid) {
            dispatch(changeFormValidate(true))
            dispatch(changeSubmitStatus(false))
        } else if (!loginValid && !passwordValid) {
            dispatch(changeFormValidate(false))
        }

        if (loginValid) {
            dispatch(changeInvalidStatus({ isLoginInvalid: false }))
        }

        if (passwordValid) {
            dispatch(changeInvalidStatus({ isPasswordInvalid: false }))
        }

    }, [dispatch, loginValid, passwordValid])


    const handleSubmit = e => {
        e.preventDefault()

        if (allFormValid) {
            doAuthorization()
        } else {
            dispatch(changeSubmitStatus(true))
        }

        if (!loginValid) {
            dispatch(changeInvalidStatus({ isLoginInvalid: true }))
        }

        if (!passwordValid) {
            dispatch(changeInvalidStatus({ isPasswordInvalid: true }))
        }
    }


    const doAuthorization = () => {
        localStorage.setItem(`login`, `${login}`)
        localStorage.setItem(`subLogin`, `${subLogin}`)
        localStorage.setItem(`password`, `${password}`)

        dispatch(sendAuthForm())
    }


    const validateField = e => {
        const { name, value } = e.target

        switch (name) {
            case 'login':
                let isLoginValid = Boolean(
                    value.match(/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/) ||
                    value.match(/^(?=.*[A-Za-z0-9]$)[A-Za-z_][A-Za-z\d.-]{0,19}$/))

                dispatch(changeFormValue({ name: name, value: value }))
                dispatch(changeInputsValidate({ loginValid: isLoginValid }))

                if (!isLoginValid) {
                    dispatch(changeInvalidStatus(true))
                }
                break
            case 'subLogin':
                dispatch(changeFormValue({ name: name, value: value }))
                break
            case 'password':
                let isPasswordValid = Boolean(value.match('^[a-zA-Z0-9 ]+$'))
                dispatch(changeInputsValidate({ passwordValid: isPasswordValid }))
                dispatch(changeFormValue({ name: name, value: value }))

                if (!isPasswordValid) {
                    dispatch(changeInvalidStatus(true))
                }
                break
            default:
                break
        }
    }


    return (
        <div className="login">
            <img className="login-logo" src={Logo} alt="Logo" />

            <form className="login-form" onSubmit={handleSubmit}>
                <span className="login-form__title">API-консолька</span>

                <FormError formError={formError} />

                <Input
                    type={"text"}
                    name={"login"}
                    title={"Логин"}
                    value={login}
                    onChange={validateField}
                    titleсlass={"login-form__label"}
                    wrapсlass={`login-form__group ${isLoginInvalid ? "input_invalid" : ""}`}
                />

                <div className="login-form__wrap">
                    <Input
                        type={"text"}
                        name={"subLogin"}
                        title={"Сублогин"}
                        titleclass={"login-form__label"}
                        value={subLogin}
                        onChange={validateField}
                        titleсlass={"login-form__label"}
                        wrapсlass={"login-form__group"}
                    />
                    <span className="login-form__option-text">Опционально</span>
                </div>

                <Input
                    type={"password"}
                    name={"password"}
                    title={"Пароль"}
                    titleclass={"login-form__label"}
                    value={password}
                    onChange={validateField}
                    titleсlass={"login-form__label"}
                    wrapсlass={`login-form__group ${isPasswordInvalid ? "input_invalid" : ""}`}
                />

                <Button
                    title={"Войти"}
                    className={"btn_standart login-form__submit"}
                    disabled={isSubmitDisabled}
                    loading={isFormAnswerLoading}
                />
            </form>

            <GitHubLink />
        </div>
    )
}


export default AuthorizationForm