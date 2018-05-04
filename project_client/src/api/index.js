/*
* 都是请求接口的函数模块，
* 函数返回值是 promise对象
* */

import ajax from './ajax'

//注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST')

//登陆接口（直接写对象的属性，因为只会传递这两个属性）
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST')

//更新（完善用户信息时）用户接口
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')

//获取（通过cookie，实现免登陆功能）用户信息
export const reqUser = () => ajax('/user')

/*
* 获取用户列表（GET请求）
* 注意，这里是{type}，ajax中规定了参数的数据类型，
*   如果写为type,则传递的字符串会被包装为包装类型，进行遍历组合。
* */
export const reqUserList = (type) => ajax('/userList', {type})

//获取当前用户的，聊天消息列表
export const reqChatMsgList = () => ajax('/msgList')

//修改指定消息为已读
export const reqReadMsg = (from) => ajax('readMsg', {from}, 'POST')