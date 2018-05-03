import {AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER
} from './action_type'

//这是简写了 api中的 index.js
import {reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser
} from '../api'

//授权成功的 同步 action
const auth_success = (user) => ({type: AUTH_SUCCESS, data: user})
//错误提示信息的 同步 action
const error_msg = (msg) => ({type: ERROR_MSG, data: msg})
// 接收用户的 同步 action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
// 重置用户的 同步 action，暴露是因为在退出登录时用
export const resetUser = (msg) => ({type: RESET_USER, data: msg})


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
        if(result.code === 0){
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

// 获取用户异步action
export const getUser = () => {
    return async dispatch => {
        // 执行异步ajax请求
        const response = await reqUser()
        const result = response.data
        if(result.code===0) { // 成功
            dispatch(receiveUser(result.data))
        } else { // 失败
            dispatch(resetUser(result.msg))
        }
    }
}

