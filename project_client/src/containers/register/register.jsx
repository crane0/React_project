import React, {Component} from 'react'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button
} from 'antd-mobile'

import Logo from '../../components/logo/logo'

export default class Register extends Component {

    state = {
        username: '',   //用户名
        password: '',   //密码
        passwordRpt: '',    //确认密码
        type: 'Boss'    //用户类型
    }

    /*
    * 通过不同的 name,获取 name对应的 val
    * [name]，将name变为一个变量了
    * */
    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    //跳转到登陆页面
    toLogin = () => {
        this.props.history.push('/login')
    }

    /*
    * div中用到的标签，都是 antd-mobile中的
    * NavBar，导航栏
    * WingBlank，两翼留白布局
    * List，普通列表
    * InputItem，文本输入框，可以将文字包进来
    * WhiteSpace，上下留白布局
    * List.Item，可输入列表
    * Radio，单选框
    * */
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
                       <InputItem onChange={val => {this.handleChange('passwordRpt', val)}}>确认密码：</InputItem>
                       <WhiteSpace />
                       <List.Item>
                           <span>用户类型：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                           <Radio checked={this.state.type === 'employee'} onClick={() => {this.handleChange('type', 'employee')}}>employee</Radio>&nbsp;&nbsp;&nbsp;&nbsp;
                           <Radio checked={this.state.type === 'Boss'} onClick={() => {this.handleChange('type', 'Boss')}}>Boss</Radio>
                       </List.Item>
                       <WhiteSpace />
                       <Button type='primary' onClick={this.handleRegister}>注册</Button>
                       <WhiteSpace />
                       <Button onClick={this.toLogin}>已有账户</Button>
                   </List>
                </WingBlank>
            </div>
        )
    }
}
