
import React, {Component} from 'react'
import {NavBar, List, InputItem, Grid, Icon} from 'antd-mobile'
import {connect} from 'react-redux'
import {sendMsg, readedMsg} from "../../redux/actions";

class Chat extends Component {

    //管理要发送的内容
    state = {
        content: '',
        isShow: false   //是否显示表情列表
    }

    //在第一次render()之前回调
    componentWillMount() {
        //初始化表情列表
        const emojis = ['😂','🔥','😍','😂','🔥','😍','😂','🔥','😍','😂','🔥','😍',
            '😂','🔥','😍','😂','🔥','😍','😂','🔥','😍','😂','🔥','😍','😂','🔥','😍',
            '😂','🔥','😍','😂','🔥','😍','😂','🔥','😍','😂','🔥','😍','😂','🔥','😍',
            '😂','🔥','😍','😂','🔥','😍','😂','🔥','😍','😂','🔥','😍','😂','🔥','😍',
            '😂','🔥','😍','😂','🔥','😍','😂','🔥','😍','😂','🔥','😍',]

        //需要text，因为antd组件中，Grid中的文本，需要这样使用。
        this.emojis = emojis.map(emoji => ({text: emoji}))
    }

    //为了在进入聊天界面时，显示的是最下面的消息
    componentDidMount () {
        // 初始显示列表
        window.scrollTo(0, document.body.scrollHeight)

    }
    componentDidUpdate () {
        // 更新显示列表
        window.scrollTo(0, document.body.scrollHeight)

    }


    /*
    * 用于发请求，更新消息的未读状态
    *   更新的未读消息的代码只能写到这里，当退出聊天页面时，就会执行WillUnmount。
    *   如果DidMount中，则只有在进入聊天页面时，才会readedMsg，
    *       所以，如果现在已经在聊天页面，那和其他人进行聊天的过程中，不会在执行 DidMount
    *       所以，当退出聊天页面时，刚刚的所有聊天内容，都会是未读消息显示。
    *   如果在DidUpdate中，因为有readedMsg，所以只要一获取焦点，就会不停的执行DidUpdate，很可能会内存溢出
    * */
    componentWillUnmount () {
        const from = this.props.match.params.userId
        const to = this.props.user._id
        this.props.readedMsg(from, to)
    }
    
    toggleShow = () => {
        const isShow = !this.state.isShow
        this.setState({isShow})
        if(isShow){
            // 异步手动派发resize事件,解决表情列表显示的 bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
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
        this.setState({
            content: '',
            isShow: false
        })
    }

    render() {
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat

        //正在聊天的，当前用户的id
        const meId = user._id
        /*
        * 如果还没有获取数据, 直接不做任何显示
        * 因为，如果在聊天页面进行刷新，就要进行免登陆功能的逻辑，
        *   而在发送请求获取用户信息时getUser中，执行getMsgList获取消息列表时
        *   还没有获取到 this.props.chat中的数据时，
        *   当前路由已经进行render渲染了，
        *   下面的逻辑中在使用users时，就会报错
        *
        * */
        if(!users[meId]){
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
        * NavBar中，设置了回退按钮
        *
        * msgs.map()做的判断，
        *   是因为聊天双方的人，他们的头像和聊天信息，显示的位置不同
        *
        * value={this.state.content}，是为了配合清空输入框
        *   而在onChange中，可以直接进行state的修改。
        *
        * onFocus，是保证获取输入框的焦点时，表情列表隐藏
        *
        * InputItem中extra属性中，只能有一个根标签
        * */
        return (
            <div id='chat-page'>
                <NavBar
                    icon={<Icon type='left'/>}
                    className='sticky-header'
                    onLeftClick={()=> this.props.history.goBack()}
                >
                    {users[otherId].username}
                </NavBar>
                <List style={{marginTop:50, marginBottom: 50}}>
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
                        onFocus={() => this.setState({isShow: false})}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{marginRight: 8}}>😂</span>
                                <span onClick={this.handleSend}>发送</span>
                            </span>
                        }
                    />
                    {this.state.isShow ? (
                        <Grid
                            data={this.emojis}  //传入菜单的数据 Array<{icon, text}>
                            columnNum={8}   //列
                            carouselMaxRow={4}      //最大行数
                            isCarousel={true}       //有多页时，是否有轮播效果
                            onClick={(item) => {    //点击每个菜单的回调函数，要实时更新content
                                this.setState({content: this.state.content + item.text})
                            }}
                        />
                    ) : null}
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user, chat: state.chat}),
    {sendMsg, readedMsg}
)(Chat)