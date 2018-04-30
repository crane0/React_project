/*
* 选择用户图像的 UI组件
* */


import React, {Component} from 'react'
import {List, Grid} from 'antd-mobile'

export default class Header_selector extends Component {

    constructor(props) {
        super(props)
        this.headerList = []
        for(let i = 0; i < 20; i++){
            this.headerList.push({
                text: '头像' + (i+1),
                icon: require(`./images/头像${i+1}.png`)  //可以使用commonJs的语法，不能使用import
            })
        }
    }

    state = {
        icon: null  //图片图像，默认没有值
    }

    handleClick = ({text, icon}) => {
        this.setState({icon})
        this.props.setHeader(text)
    }

    render() {

        const {icon} = this.state

        const listHeader = !icon ? '请选择头像' : (
            <div>
                已选择头像：<img src={icon}/>
            </div>
        )

        //data是一个数组，其中的元素是对象格式
        return (
            <List renderHeader={() => listHeader}>
                <Grid data={this.headerList}
                    columnNum={5}
                    onClick={this.handleClick}/>
            </List>
        )
    }
}