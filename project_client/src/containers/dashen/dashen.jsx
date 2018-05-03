/*
* 底部导航栏对应的，大神主页面，路由组件
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'

import {getUserList} from '../../redux/actions'
import UserList from '../../components/user_list/user_list'

class Dashen extends Component {

    componentDidMount() {
        /*
        * 发送请求，获取laoban列表
        * 就会更新 state，也就更新 userList，作为 props传递给 UserList
        *   再显示到页面。
        * */
        this.props.getUserList('laoban')
    }

    render() {
        return (
            <UserList userList={this.props.userList}/>
        )
    }
}

export default connect(
    state => ({userList: state.userList}),
    {getUserList}
)(Dashen)
