/*
* 大神信息完善的路由组件
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, InputItem, Button, TextareaItem} from 'antd-mobile'
import HeaderSelector from '../../components/header_selector/header_selector'


class Dashen_info extends Component {

    state = {
        header: '', // 头像名称
        post: '',   // 职位名称
        info: ''    // 职位简介
    }

    //更新header的状态（在HeaderSelector中调用，进行更新）
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
                <NavBar>大神信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem onChange={val => (this.handleChange('post', val))}>求职岗位:</InputItem>
                <TextareaItem title='个人介绍：'
                    rows={3} onChange={val => (this.handleChange('info', val))}/>
                <Button type='primary' onClick={this.save}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state => {},
    {}
)(Dashen_info)