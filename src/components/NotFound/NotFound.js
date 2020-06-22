import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.scss'


function NotFound(){
    return(
        <div className="not-found">
            <Link to="/main" className="not-found__link">Go to Main Page</Link>
        </div>
    )
}


export default NotFound