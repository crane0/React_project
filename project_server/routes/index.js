var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')
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

module.exports = router;
