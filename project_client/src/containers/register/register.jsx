import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button
} from 'antd-mobile'

import {Redirect} from 'react-router-dom'

import {register} from "../../redux/actions";
import Logo from '../../components/logo/logo'

class Register extends Component {

    state = {
        username: '',   //用户名
        password: '',   //密码
        passwordRpt: '',    //确认密码
        type: 'laoban'    //用户类型
    }

    handleRegister = () => {
        this.props.register(this.state)
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
        console.log(12122)
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
        const {msg, redirectTo} = this.props.user
        console.log(redirectTo)
        if(redirectTo){
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
                       {msg ? <div className='error_msg'>{msg}</div> : null}
                       <InputItem placeholder='请输入用户名' onChange={val => {this.handleChange('username', val)}}>用户名：</InputItem>
                       <WhiteSpace />
                       <InputItem placeholder='请输入密码' type='password' onChange={val => {this.handleChange('password', val)}}>密码：</InputItem>
                       <WhiteSpace />
                       <InputItem placeholder='请确认密码' type='password' onChange={val => {this.handleChange('passwordRpt', val)}}>确认密码：</InputItem>
                       <WhiteSpace />
                       <List.Item>
                           <span>用户类型：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                           <Radio checked={this.state.type === 'employee'} onClick={() => {this.handleChange('type', 'employee')}}>employee</Radio>&nbsp;&nbsp;&nbsp;&nbsp;
                           <Radio checked={this.state.type === 'laoban'} onClick={() => {this.handleChange('type', 'Boss')}}>Boss</Radio>
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

export default connect(
    //这个store对象中的state状态
    state => ({user: state.user}),
    {register}
)(Register)

