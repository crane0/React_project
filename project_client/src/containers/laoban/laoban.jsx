/*
* 底部导航栏对应的，老版主页面，路由组件
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'

class Laoban extends Component {
    render() {
        return (
            <div>Laoban</div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {}
)(Laoban)
