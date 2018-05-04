import io from 'socket.io-client'

import {AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USERLIST,
    RECEIVE_MSGLIST,
    RECEIVE_MSG
} from './action_type'

//这是简写了 api中的 index.js
import {reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatMsgList
} from '../api'

//授权成功的 同步 action
const auth_success = (user) => ({type: AUTH_SUCCESS, data: user})
//错误提示信息的 同步 action
const error_msg = (msg) => ({type: ERROR_MSG, data: msg})
// 接收用户的 同步 action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
// 重置用户的 同步 action，暴露是因为在退出登录时用
export const resetUser = (msg) => ({type: RESET_USER, data: msg})

//接收用户列表的 同步 action
const receiveUserList = (userList) => ({type: RECEIVE_USERLIST, data: userList})

//接收消息列表的 同步 action
const receiveMsgList = ({users, chatMsgs}) => ({type: RECEIVE_MSGLIST, data: {users, chatMsgs}})
//接收一个消息的 同步action
const receiveMsg = (chatMsg) => ({type: RECEIVE_MSG, data: chatMsg})




//注册异步 action
export const register = (user) => {
    const {username, password, passwordRpt, type} = user

    if(!username){
        return error_msg('用户名不能为空')
    } else if(password !== passwordRpt){
        return error_msg('两次密码不一致')
    }

    return async dispatch => {
        //如果不使用 async和 await
        // const promise = reqRegister(user)
        // promise.then(response => {
        //     const result = response.data
        // })

        //这次不需要后台进行验证，所以不传 passwordRpt
        const response = await reqRegister({username, password, type})
        const result = response.data    //{code: 0/1, data: user, msg: ''}

        //后台的数据
        if(result.code === 0){  //成功
            getMsgList(dispatch, result.data._id)
            dispatch(auth_success(result.data))
        } else {
            dispatch(error_msg(result.msg))
        }
    }
}

//登录异步 action
export const login = (user) => {
    const {username, password} = user

    if(!username){
        console.log('用户名不能为空')
    } else if(!password){
        console.log('密码不能为空')
    }

    return async dispatch => {
        const response = await reqLogin(user)
        const result = response.data    //{code: 0/1, data: user, msg: ''}

        //后台的数据
        if(result.code === 0){
            getMsgList(dispatch, result.data._id)
            dispatch(auth_success(result.data))
        } else {
            dispatch(error_msg(result.msg))
        }
    }
}

// 更新用户信息 异步action
export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdateUser(user)
        const result = response.data

        /*
        * result：后台返回的数据中，
        *   {code: 1, msg: '请先登陆'}
        *   {code: 0, data}
        *
        * receiveUser(result.data)
        *   执行reducers，返回的是 action.data，也就是result.data，即从后台获取的数据
        * resetUser(result.msg)
        *   执行reducers，返回的是，只是将初始的initUser中的 msg属性改了
        * */
        if(result.code === 0){
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}

// 获取用户 异步action（实现免登陆）
export const getUser = () => {
    return async dispatch => {
        // 执行异步ajax请求
        const response = await reqUser()
        const result = response.data
        if(result.code===0) { // 成功
            getMsgList(dispatch, result.data._id)
            dispatch(receiveUser(result.data))
        } else { // 失败
            dispatch(resetUser(result.msg))
        }
    }
}

//获取用户列表的 异步action
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type)
        const result = response.data
        if(result.code === 0){
            dispatch(receiveUserList(result.data))
        }
    }
}


/*
*单例对象
*   因为只要有一个就可以了，不需要创建多个。
*       并且initIO会被执行多次，所以要做判断。
*   1. 创建对象之前: 判断对象是否已经存在, 只有不存在才去创建
*   2. 创建对象之后: 保存对象
*           放到io的属性上，就相当于是保存。
* */
function initIO(dispatch, userId) {
    if(!io.socket){
        io.socket = io('ws://localhost:4000')
        io.socket.on('receiveMsg', function (chatMsg) {

            // 只有当chatMsg是与当前用户相关的消息, 才去分发同步action保存消息
            if(userId === chatMsg.from || userId === chatMsg.to){
                dispatch(receiveMsg(chatMsg))

                console.log('客户端,接收服务器的消息', chatMsg)
            }
        })
    }
}

/*
* 异步获取消息列表
*   要保证在 注册||登陆||免登陆 都执行一次
*       因为，经历上述3个过程时，就可以产生消息列表的。
*
* 因为只在其他action中使用，所以不用暴露出去
* */
async function getMsgList(dispatch, userId){
    initIO(dispatch, userId)
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code === 0){
        //users是对象格式，chatMsgs是数组格式
        const {users, chatMsgs} = result.data
        dispatch(receiveMsgList({users, chatMsgs}))
    }
}

/*
* socketio发送消息的 异步action
*   没有使用async是因为不是通过ajax发送请求的
*
* from是当前用户的 id,
* to是对方的 id,
* content是要发送的内容
* */
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        /*
        * 这里没有调用initIO()，
        *   因为发送消息时，肯定是已经注册||登陆||免登陆，其中之一
        *   而在这些过程中，就已经调用了initIO()
        * */
        io.socket.emit('sendMsg', {from, to, content})
        console.log('客户端,向服务器发送消息', {from, to, content})
    }
}
