import React, {Component} from 'react'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button
} from 'antd-mobile'
import Logo from '../../components/logo/logo'

export default class Login extends Component {

    state = {
        username : '',
        password : ''
    }

    handleChange = (name, val) => {
        this.setState({
            [name] : val
        })
    }

    toRegister = () => {
        this.props.history.push('/register')
    }

    //标签使用说明，在 register.js中
    render() {
        return (
            <div>
                <NavBar>职来职往</NavBar>
                <Logo />
                <WingBlank>
                    <List>
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
