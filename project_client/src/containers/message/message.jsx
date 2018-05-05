/*
* 底部导航栏对应的，消息列表主页面，路由组件
* */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

/*
对chatMsgs按chat_id进行分组, 并得到每个组的lastMsg组成的数组
1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id, lastMsg}
2. 得到所有lastMsg的数组
3. 对数组进行排序(按create_time降序)
 */
function getLastMsgs(chatMsgs, userId) {
    /*
    * 1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id, lastMsg}
    *   放在对象中，是因为在显示消息列表时，只需要其中的msg，并对其排序
    *       而chatMsgs是一个数组，其中每条消息又是对象（其中有很多属性）
    *       所以，新建一个对象，取出每条消息中，需要的属性，最后在将这个对象的所有属性值，变为一个数组
    * */
    const lastMsgObjs = {}

    chatMsgs.forEach((msg) => {

        /*
        * 统计msg中，是发给我的，并且是未读的，
        *   如果满足，将 unReadCount置位 1
        *   (unReadCount置位在chat状态中进行了管理)
        * */
        if(msg.to===userId && !msg.read){
            msg.unReadCount = 1
        } else {
            msg.unReadCount = 0
        }

        const chatId = msg.chat_id
        /*
        * getLastMsgs()是在render中调用的，每一次产生新的消息，都会调用
        *   所以每次调用，都会遍历一次所有的msg，
        *       并且，可能有新的消息，也可能还是原来的消息
        *   所以，要做判断，在chatId对应的msg没有时，再添加
        *       如果有，还要判断是不是最新的msg
        * */
        let lastMsg = lastMsgObjs[chatId]

        if(!lastMsg){
            lastMsgObjs[chatId] = msg
        } else {
            /*
            * 累加 unReadCount = 已经统计的 + 当前msg的
            *   因为正在进行数组遍历，所以每一个msg都会被循环到，
            *   但是，只有满足是当前 chatId属性对应的属性值 lastMsg才会进入到此，
            *   这样，就实现了对当前chatId对应的 lastMsg中，未读消息的统计
            * */
            const unReadCount = lastMsg.unReadCount + msg.unReadCount

            //如果msg比lastMsg晚, 就将msg保存为lastMsg
            if(msg.create_time > lastMsg.create_time){
                lastMsgObjs[chatId] = msg
            }
            /*
            * 最后将未读消息总数，给对应的lastMsg的属性
            *   放在最下面，是为了保证 lastMsgObjs[chatId]是最晚的 msg
            * */
            lastMsgObjs[chatId].unReadCount = unReadCount
        }
    })
    //2. 得到所有lastMsg的数组
    //Object.values，循环遍历可枚举的属性值，返回一个数组
    const lastMsgs = Object.values(lastMsgObjs)

    //3. 对数组进行排序(按create_time降序)    sort中的排序函数，返回值<=0时，m1,m2不换位置
    lastMsgs.sort(function(m1, m2){
        return m2.create_time - m1.create_time
    })

    return lastMsgs

}

class Message extends Component {

    render() {

        const {user} = this.props
        const {users, chatMsgs} = this.props.chat

        //将最后一条消息，按chat_id进行分组
        const lastMsgs = getLastMsgs(chatMsgs, user._id)

        return (
            <List style={{marginTop:50, marginBottom: 50}}>

                {
                    lastMsgs.map(msg =>{
                        /*
                        * 得到目标用户的id
                        * msg.to：该消息是发给谁的，msg.from：谁发出的
                        * */
                        const otherUserId = msg.to===user._id ? msg.from : msg.to
                        // 得到目标用户的信息
                        const otherUser = users[otherUserId]


                        /*
                        * extra中Badge为了显示，未读消息的个数
                        * thumb中做的判断，因为用户信息可能不完善，也就没有图像
                        * */
                        return (
                            <List.Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount}/>}
                                thumb={otherUser.header ? require(`../../assets/images/${otherUser.header}.png`) : null}
                                arrow='horizontal'
                                onClick={() => this.props.history.push(`/chat/${otherUserId}`)}
                            >
                                {msg.content}
                                <List.Item.Brief>{otherUser.username}</List.Item.Brief>
                            </List.Item>
                        )
                    })
                }
            </List>
        )
    }
}

export default connect(
    state => ({user: state.user, chat: state.chat}),
    {}
)(Message)
