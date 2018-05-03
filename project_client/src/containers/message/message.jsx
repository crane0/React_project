/*
* 底部导航栏对应的，消息主页面，路由组件
* */
import React, {Component} from 'react'
import {connect} from 'react-redux'

class Message extends Component {
    render() {
        return (
            <div>message</div>
        )
    }
}

export default connect(
    state => ({}),
    {}
)(Message)
