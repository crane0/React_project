import React, {Component} from 'react'

import logo from './logo.png'
import './logo.less'

export default class Logo extends Component {
    render() {
        return (
            <div className='logo_container'>
                <img src={logo} alt="logo" className='logo_img'/>
            </div>
        )
    }
}
