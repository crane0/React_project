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
    RECEIVE_MSG
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
            const {users, chatMsgs} = action.data
            return {
                users,
                chatMsgs,
                unReadCount: 0
            }
            
        case RECEIVE_MSG:
            const chatMsg = action.data
            //在消息列表中的某个消息对话中，实时更新？
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: 0
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