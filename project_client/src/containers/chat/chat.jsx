
import React, {Component} from 'react'
import {NavBar, List, InputItem} from 'antd-mobile'
import {connect} from 'react-redux'
import {sendMsg} from "../../redux/actions";

class Chat extends Component {

    //管理要发送的内容
    state = {
        content: ''
    }

    /*
    * 发送数据时，要先做收集
    * */
    handleSend = () => {
        const from = this.props.user._id
        const to = this.props.match.params.userId
        const content = this.state.content

        if(content){
            this.props.sendMsg({from, to, content})
        }

        //清除输入框的数据
        this.setState({content: ''})
    }


    /*
    * value={this.state.content}，是为了配合清空输入框
    * 而在onChange中，可以直接进行state的修改。
    * */
    render() {
        return (
            <div id='chat-page'>
                <NavBar>aa</NavBar>
                <List>
                    <List.Item
                        thumb={require('../../assets/images/头像1.png')}
                    >
                        你好
                    </List.Item>
                    <List.Item
                        thumb={require('../../assets/images/头像1.png')}
                    >
                        你好2
                    </List.Item>
                    <List.Item
                        className='chat-me'
                        thumb={require('../../assets/images/头像2.png')}
                        extra='我'
                    >
                        很好
                    </List.Item>
                    <List.Item
                        className='chat-me'
                        thumb={require('../../assets/images/头像2.png')}
                        extra='我'
                    >
                        很好2
                    </List.Item>
                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        value={this.state.content}
                        onChange={val => this.setState({content: val})}
                        extra={
                            <span onClick={this.handleSend}>发送</span>
                        }
                    />
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {sendMsg}
)(Chat)