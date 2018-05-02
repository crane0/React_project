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