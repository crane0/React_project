/*
* 老板信息完善的路由组件
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {NavBar, InputItem, Button, TextareaItem} from 'antd-mobile'
import HeaderSelector from '../../components/header_selector/header_selector'

import {updateUser} from "../../redux/actions";

class Laoban_info extends Component {

    state = {
        header: '', // 头像名称
        post: '',   // 职位名称
        info: '',    // 职位简介
        company: '',  //公司名称
        salary: ''    //工资

    }

    //更新header的状态
    setHeader = (header) => {
        this.setState({
            header: header
        })
    }

    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    save = () => {
        // console.log(this.state)
        this.props.updateUser(this.state)
    }
    
    render() {
        // 如果信息已经完善, 自动重定向到对应主界面
        const {header, type} = this.props.user
        if(header) { // 说明信息已经完善
            const path = type==='dashen' ? '/dashen' : '/laoban'
            return <Redirect to={path}/>
        }

        return (
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder='招聘职位' onChange={val => (this.handleChange('post', val))}>招聘职位:</InputItem>
                <InputItem placeholder='公司名称' onChange={val => (this.handleChange('company', val))}>公司名称:</InputItem>
                <InputItem placeholder='职位薪资' onChange={val => (this.handleChange('salary', val))}>职位薪资:</InputItem>
                <TextareaItem title='职位要求：'
                    rows={3} onChange={val => (this.handleChange('info', val))} />
                <Button type='primary' onClick={this.save}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {updateUser}
)(Laoban_info)