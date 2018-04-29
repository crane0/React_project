import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button
} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import {login} from "../../redux/actions";
import Logo from '../../components/logo/logo'

class Login extends Component {

    state = {
        username : '',
        password : ''
    }

    //处理点击登陆的逻辑
    handleLogin = () => {
        this.props.login(this.state)
    }

    //输入框内容改变时，更新状态
    handleChange = (name, val) => {
        this.setState({
            [name] : val
        })
    }

    //转到注册页面
    toRegister = () => {
        this.props.history.push('/register')
    }

    //标签使用说明，在 register.js中
    render() {
        const {msg, redirectTo} = this.props.user

        if(redirectTo) {
            return <Redirect to={redirectTo}/>
        }

        return (
            <div>
                <NavBar>职来职往</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        {/*这是错误提示信息，为null不显示
                            这个class样式定义在了 assets/css/index.css中
                            而引入这个样式，在入口 js(idnex.js)中
                        */}
                        {msg ? <div className='error-msg'>{msg}</div> : null}
                        <InputItem onChange={val => {this.handleChange('username', val)}}>用户名：</InputItem>
                        <WhiteSpace />
                        <InputItem onChange={val => {this.handleChange('password', val)}}>密码：</InputItem>
                        <WhiteSpace />
                        <Button type='primary' onClick={this.handleLogin}>登录</Button>
                        <WhiteSpace />
                        <Button onClick={this.toRegister}>还没有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login)
