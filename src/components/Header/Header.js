import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import './Header.scss'
import Logo from '../../assets/svg/logo.svg'
import { ReactComponent as LogOutIcon } from '../../assets/svg/log-out.svg'
import { ReactComponent as FullScreenIcon } from '../../assets/svg/to-full-screen.svg'
import { ReactComponent as ExitFullScreenIcon } from '../../assets/svg/exit-full-screen.svg'
import { toggleFullscreen, logIn } from '../../actions/app'
import { saveRequestHistoryInitial } from '../../actions/requestHistory'
import Button from '../Button'
import AccountInfo from '../AccountInfo'
import { openFullscreen, closeFullscreen } from '../../helpers/helpers'


function Header() {
    const requestHistory = useSelector(store => store.requestHistory.requestHistory)
    const isFullScreen = useSelector(store => store.app.isFullScreen)
    const dispatch = useDispatch()


    useEffect(() => {
        window.addEventListener('beforeunload', handleWindowBeforeUnload)

        return () => {
            window.removeEventListener("beforeunload", handleWindowBeforeUnload)
        }
    })

    useEffect(() => {
        if (localStorage.getItem('requestsHistory') !== null) {
            dispatch(saveRequestHistoryInitial(JSON.parse(localStorage.getItem('requestsHistory'))))
        }
    }, [dispatch])


    const handleWindowBeforeUnload = () => {
        localStorage.setItem('requestsHistory', `${JSON.stringify(requestHistory)}`)
    }


    const changeFullScreen = () => {
        let elem = document.documentElement

        if (isFullScreen) {
            closeFullscreen()
            dispatch(toggleFullscreen(false))
        } else {
            openFullscreen(elem)
            dispatch(toggleFullscreen(true))
        }
    }

    const logOut = () => {
        dispatch(logIn(false))
        document.cookie = 'token=; expires=-1'
        localStorage.clear()
    }

    const memoizedAccountInfo = useMemo(() => {
        return <AccountInfo />
    }, [])


    return (
        <header className="header">
            <div className="header__inner">

                <div className='header-company'>
                    <Link to="/main"><img className="header__logo" src={Logo} alt="Logo" /></Link>
                    <span className="header__name">API-консолька</span>
                </div>

                <div className="header-detail">

                    {memoizedAccountInfo}

                    <Button
                        title={"Выйти"}
                        action={logOut}
                        className={"btn_transparent-with-icon header-detail__logout"}
                        right={<LogOutIcon aria-hidden="true" className="i i-logout" />}
                    />

                    <Button
                        action={changeFullScreen}
                        className={"btn_transparent"}
                        left={isFullScreen ? <ExitFullScreenIcon aria-hidden="true" /> : <FullScreenIcon className="i i-fullscreen" aria-hidden="true" />}
                        arialabel={"Изменить полноэкранный режим"}>
                    </Button>

                </div>
            </div>
        </header >
    )
}


export default Header