/*
* 包含多个用于生成新 state的 reducer函数模块
* */

import {combineReducers} from 'redux'

function xx(state = 0, action) {
    return state
}

function yy(state = 0, action) {
    return state
}

export default combineReducers({
    xx,
    yy
})