import React from 'react'
import './Loader.scss'


function Loader() {
    return (
        <div className="loader">
            <div className="loader__inner">
                <div className="loader__part"></div>
                <div className="loader__part"></div>
                <div className="loader__part"></div>
                <div className="loader__part"></div>
                <div className="loader__part"></div>
                <div className="loader__part"></div>
                <div className="loader__part"></div>
                <div className="loader__part"></div>
            </div>
        </div>
    )
}


export default Loader