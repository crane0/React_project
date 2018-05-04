var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel, ChatModel} = require('../db/models')
//这是配置对象，用于过滤
const filter = {password: 0, _v: 0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
*
a)	path为: /register
b)	请求方式为: POST
c)	接收username和password参数
d)	admin是已注册用户
e)	注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
f)	注册失败返回: {code: 1, msg: '此用户已存在'}
* */

// router.post('/register', function (req,res) {
//     const {username, password} = req.body
//     if(username === 'admin'){
//         res.send({
//             code: 1,
//             msg: '此用户已存在'
//         })
//
//     }else{
//         res.send({
//             code: 0,
//             data: {
//                 _id: 'abc',
//                 username: 'xxxx',
//                 password: '123'
//             }
//         })
//     }
// })

//用户注册
router.post('/register', function (req,res) {
    const {username, password, type} = req.body

    UserModel.findOne({username}, function (err, user) {
        if(user){
            res.send({code: 1, msg: '用户名已存在'})
        } else {
            //保存完之后，才能产生 id，所以在其中进行 _id的操作
            new UserModel({username, type, password: md5(password)}).save(function (err, user) {
                res.cookie('userId', user._id, {maxAge: 1000*60*60*24})

                //因为密码不需要返回，所以重新定义了一个对象
                const data = {username, type, _id:user._id}
                res.send({code: 0, data})
            })
        }
    })
})

//用户登陆
router.post('/login', function (req, res) {
    const {username, password} = req.body
    /*
    * filter是投影，const filter = {password: 0, _v: 0}
    * 投影设置为对象时，1代表输出，0代表不输出。
    * */
    UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
        if(user){
            res.cookie('userId', user._id, {maxAge: 1000*60*60*24})
            res.send({code: 0, data: user})
        } else {
            res.send({code:1 ,msg: '用户名或密码不正确！'})
        }
    })
})

//更细用户信息
router.post('/update',function (req, res) {
    const userId = req.cookies.userId
    if(!userId){
        //return代表不在继续往下执行
        return res.send({code: 1, msg: '请先登陆'})
    }

    //如果存在，获取后更新
    const user = req.body
    UserModel.findByIdAndUpdate({_id: userId}, user, function (err, oldUser) {
        //如果数据库中没有了（各种原因被删除），则cookie中也没有必要存在了
        if(!oldUser){
            res.clearCookie('userId')
            res.send({code: 1, msg: '请先登陆'})
        } else {
            /*
            * 因为这个回调函数，不会返回更新后的对象（并且在后台不能使用...剩余参数）
            * 所以，使用 Object.assign的方式，合并对象的属性，返回一个新的属性
            *
            * 返回_id，因为要实现免登陆功能，_id唯一
            * */
            const {_id, username, type} = oldUser
            const data = Object.assign({_id, username, type}, user)
            res.send({code: 0, data})
        }
    })
})

//获取用户信息（根据cookie中的userId）
router.get('/user', function (req, res) {
    const userId = req.cookies.userId
    if(!userId){
        //return代表不在继续往下执行
        return res.send({code: 1, msg: '请先登陆'})
    }

    UserModel.findOne({_id: userId}, filter, function (err, user) {
        res.send({code: 0, data: user})
    })
})

//获取用户列表（通过用户类型）
router.get('/userList', function (req, res) {
    const {type} = req.query

    UserModel.find({type: type}, filter, function (err, users) {
        res.send({code: 0, data: users})
    })
})


//获取当前用户，所有相关聊天信息的列表
router.get('/msgList', function (req, res) {

    // 获取cookie中的userid
    const userId = req.cookies.userId

    UserModel.find(function (err, userDocs) {
        // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
        // const users = {}
        // userDocs.forEach(doc => {
        //     users[doc._id] = {username: doc.username, header: doc.header}
        // })
        /*
       * {
         "5aeaeca0df405a0338090c65": {
           "username": "l1",
           "header": "头像2"
         },
         "5aeaecccdf405a0338090c66": {
           "username": "d1",
           "header": "头像2"
         }
       }
       *
       * */

        const users = userDocs.reduce((users, user) => {
            users[user._id] = {username: user.username, header: user.header}
            return users
        },{})

        /*
        查询userId相关的所有聊天信息
         参数1: 查询条件
         参数2: 过滤条件
         参数3: 回调函数
        */

        /*
        * "chatMsgs": [
				{
	                "read": false,
	                "_id": "5ae1f3c3a95eb824841199f1",
	                "from": "5ae1f088d37a442b749fc143",
	                "to": "5ae1ddd99ca58023d82351ae",
	                "content": "aa",
	                "create_time": 1524757443374,
	                "__v": 0
	            }
			]
        * */
        ChatModel.find({'$or' : [{from: userId}, {to: userId}]}, filter, function (err, chatMsgs) {
            // 返回 所有用户（对象格式） 和 当前用户相关的所有聊天消息的数据（数组格式）
            res.send({code: 0, data: {users, chatMsgs}})
        })
    })
})

//修改指定消息为已读
router.post('/readMsg', function (req, res) {
    const from = req.body.from
    const to = req.cookies.userId
    /*
    更新数据库中的chat数据
    参数1: 查询条件
    参数2: 更新为指定的数据对象
    参数3: 是否1次更新多条, 默认只更新一条
    参数4: 更新完成的回调函数
     */

    ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
        res.send({code: 0, data: doc.nModified})    //更新的数量
    })
})

module.exports = router;
