/*
* 包含多个用于生成新 state的 reducer函数模块
* */

import {combineReducers} from 'redux'

import {AUTH_SUCCESS, ERROR_MSG} from './action_type'

const initUser = {
    username: '', // 用户名
    type: '', // 用户类型 dashen/laoban
    msg: '', // 错误提示信息
    redirectTo: '' // 需要自动重定向的路由路径
}

//用于更新state
function user(state=initUser, action){
   switch (action.type) {
       case AUTH_SUCCESS :
           return {...action.data, redirectTo: '/'}
       case ERROR_MSG :
           return {...state, msg: action.data}
       default:
           return state
   }
}

export default combineReducers({
   user
})