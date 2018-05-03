/*
* 底部导航栏对应的，个人中心主页面，路由组件
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
/*
* Result结果页
* Modal对话框（模态框）
* */
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile'

//退出登录时，重置redux管理的 user
import {resetUser} from '../../redux/actions'

class Personal extends Component {

    logout = () => {
        Modal.alert('退出','确定要退出登录吗?',[
            {text: '取消'},
            {
                text: '确定',
                onPress: () => {
                    Cookies.remove('userId')
                    this.props.resetUser()
                }
            }
        ])
    }

    render() {
        const {username, info, header, company, post, salary} = this.props.user

        /*message的属性值没有的话，就不会显示*/
        return (
            <div>
                <Result
                    img={<img src={require(`../../assets/images/${header}.png`)} style={{width: 50}} alt='header'/>}
                    title={username}
                    message={company}
                    />

                <List renderHeader={() => '相关信息'}>
                    <List.Item multipleLine>
                        <List.Item.Brief>职位：{post}</List.Item.Brief>
                        <List.Item.Brief>简介：{info}</List.Item.Brief>
                        {salary ? <List.Item.Brief>薪水：{salary}</List.Item.Brief> : null}
                    </List.Item>
                </List>
                <WhiteSpace/>

                <List>
                    <Button type='warning' onClick={this.logout}>退出登录</Button>
                </List>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {resetUser}
)(Personal)
