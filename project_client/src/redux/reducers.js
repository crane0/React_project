/*
* 包含多个用于生成新 state的 reducer函数模块
* */

import {combineReducers} from 'redux'

import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USERLIST,
    RECEIVE_MSGLIST,
    RECEIVE_MSG,
    READ_MSG
} from './action_type'
//index的话，就不会需要写了
import {getRedirectTo} from '../utils'

const initUser = {
    username: '', // 用户名
    type: '', // 用户类型 dashen/laoban
    msg: '', // 错误提示信息
    redirectTo: '' // 需要自动重定向的路由路径
}

//用于更新 user
function user(state=initUser, action){
   switch (action.type) {
       case AUTH_SUCCESS :
           //这里使用的是 user中的 type和 header
           const {type, header} = action.data
           return {...action.data, redirectTo: getRedirectTo(type, header)}
       case ERROR_MSG :
           return {...state, msg: action.data}

       case RECEIVE_USER: // data是user
           return action.data
       case RESET_USER: // data是msg
           return {...initUser, msg: action.data}
       default :
           return state
   }
}


const initUserList = []

//用于更新user列表
function userList(state=initUserList, action) {
    switch (action.type) {
        case RECEIVE_USERLIST :
            return action.data
        default :
            return state
    }
}

const initChat = {
    users: {},
    chatMsgs: [],
    unReadCount: 0
}
//用于聊天状态
function chat(state=initChat, action) {
    // debugger
    switch (action.type) {
        case RECEIVE_MSGLIST:
            const {users, chatMsgs, userId} = action.data
            return {
                users,
                chatMsgs,
                //未读消息，必须满足是发送给我的，并且是未读，才会 +1
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (msg.to===userId && !msg.read ? 1 : 0), 0)
            }
            
        case RECEIVE_MSG:
            //因为在action中，多传了userId，所以要使用{}进行获取chatMsg
            const {chatMsg} = action.data
            /*
            * chatMsg，就是接收到的消息，下面的逻辑就是在更新消息列表 chatMsgs
            *   所以，也就实现了实时聊天
            * */
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                /*
                * 只有chat函数一个作用域，对一个对象进行结构赋值，获取相同的参数只能进行一次！
                *   因为在第一个case中，已经进行了 userId的获取，所以这里如果在使用解构赋值获取，就会报错！
                *   所以，直接使用了 action.data.userId
                *   并且因为是单个消息的获取，所以直接在state.unReadCount进行改变即可。
                * */
                unReadCount: state.unReadCount + (chatMsg.to===action.data.userId && !chatMsg.read ? 1 : 0)
            }

        case READ_MSG:
            //count是更新的数量
            const {count, from ,to} = action.data
            // state.chatMsgs.forEach(msg => {
            //     if(to === msg.to && from === msg.from && !msg.read){
            //         msg.read = true
            //     }
            // })

            return {
                users: state.users,
                //map返回的是一个新的数组
                chatMsgs: state.chatMsgs.map(msg => {
                    if(msg.from===from && msg.to===to && !msg.read) { // 需要更新
                        //msg是一个对象，...可以解构对象，
                        return {...msg, read: true}
                    } else {// 不需要，map需要返回值，否则就被过滤掉了
                        return msg
                    }
                }),
                unReadCount: state.unReadCount - count
            }
        default:
            return state
    }
}



export default combineReducers({
    user,
    userList,
    chat
})