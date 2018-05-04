
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
        //当前用户 id
        const from = this.props.user._id
        /*
        * 对方 id
        *   因为是从用户列表点进来的，点进来后，地址栏的路由路径改变了，
        *   根据 Main中配置的chat路由的路径，
        *   就可以这样获取，对应用户列表的 id
        * */
        const to = this.props.match.params.userId
        const content = this.state.content

        //当有内容时（可以发送空格），才可以发送
        if(content){
            this.props.sendMsg({from, to, content})
        }

        //发送完当前内容后，清除输入框的数据
        this.setState({content: ''})
    }

    render() {
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat

        //正在聊天的，当前用户的id
        const meId = user._id
        /*
        * 如果还没有获取数据, 直接不做任何显示
        * */
        if(!users[meId]){
            console.log(users,users[meId])
            return null
        }

        //正在聊天的，对方的id
        const otherId = this.props.match.params.userId
        //计算出chat_id
        const chatId = [meId,otherId].sort().join('_')
        /*
        * 因为chatMsgs是当前用户相关的，所有聊天消息的数据，
        *   所以进行过滤，只保留与正在聊天的这个人的聊天消息
        * */
        const msgs = chatMsgs.filter((msg) => msg.chat_id === chatId)

        /*
        * 没有在下面的 msgs.map()中获取聊天对方的头像，而是放在了外面获取，
        *   因为return中的虚拟DOM会多次的渲染，而头像只需要在当前聊天中，获取一次
        *   不同没有都 msgs.map()循环一遍
        * */
        const otherHeader = users[otherId].header
        //这个是为了保证，有的用户没有完善信息（也就是没有选择头像等）
        const otherIcon = otherHeader ? require(`../../assets/images/${otherHeader}.png`) : null

        /*
        * msgs.map()做的判断，
        *   是因为聊天双方的人，他们的头像和聊天信息，显示的位置不同
        *
        * value={this.state.content}，是为了配合清空输入框
        *   而在onChange中，可以直接进行state的修改。
        * */
        return (
            <div id='chat-page'>
                <NavBar>aa</NavBar>
                <List>
                    {
                        msgs.map(msg => {
                            if(otherId===msg.from){     //对方的消息
                                return (
                                    <List.Item
                                        key={msg._id}
                                        thumb={otherIcon}
                                    >
                                        {msg.content}
                                    </List.Item>
                                )
                            } else {    //我发给对方的消息
                                return (
                                    <List.Item
                                        key={msg._id}
                                        className='chat-me'
                                        extra='我'
                                    >
                                        {msg.content}
                                    </List.Item>
                                )
                            }
                        })
                    }
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
    state => ({user: state.user, chat: state.chat}),
    {sendMsg}
)(Chat)