/*
* 老板信息完善的路由组件
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, InputItem, Button, TextareaItem} from 'antd-mobile'
import HeaderSelector from '../../components/header_selector/header_selector'


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
        console.log(this.state)
    }
    
    render() {
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
    state => {},
    {}
)(Laoban_info)