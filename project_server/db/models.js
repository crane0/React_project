const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/gzhaopin')

mongoose.connection.on('connected',function () {
    console.log('数据库已连接.0.')
})

//定义Schema（描述文档结构）
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 月薪
})

//定义 Model，对应数据库集合
const UserModel = mongoose.model('user', userSchema)

exports.UserModel = UserModel