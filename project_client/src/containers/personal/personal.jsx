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

//退出登录时，重置 redux管理的 user
import {resetUser} from '../../redux/actions'

class Personal extends Component {

    logout = () => {
        Modal.alert('退出','确定要退出登录吗?',[
            {text: '取消'},
            {
                text: '确定',
                onPress: () => {
                    //退出时，要清除cookie中的数据，并且重置 redux管理的 user
                    Cookies.remove('userId')
                    this.props.resetUser()
                }
            }
        ])
    }

    render() {
        const {username, info, header, company, post, salary} = this.props.user

        /*
        * 这里设置样式，是为了保证列表，不被底部和顶部导航栏盖住。
        *
        * message的属性值没有的话，就不会显示
        * */
        return (
            <div style={{marginBottom:50, marginTop:50}}>
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
