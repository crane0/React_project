/*
* 底部导航栏对应的，大神主页面，路由组件
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'

class Dashen extends Component {
    render() {
        return (
            <div>dashen</div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {}
)(Dashen)
