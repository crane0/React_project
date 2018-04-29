/*
使用mongoose操作mongodb的测试文件
1. 连接数据库
  1.1. 引入mongoose
  1.2. 连接指定数据库(URL只有数据库是变化的)
  1.3. 获取连接对象
  1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的Model
  2.1. 字义Schema(描述文档结构)
  2.2. 定义Model(与集合对应, 可以操作集合)
3. 通过Model或其实例对集合数据进行CRUD操作
  3.1. 通过Model实例的save()添加数据
  3.2. 通过Model的find()/findOne()查询多个或一个数据
  3.3. 通过Model的findByIdAndUpdate()更新某个数据
  3.4. 通过Model的remove()删除匹配的数据
 */
const md5 = require('blueimp-md5')
const mongoose = require('mongoose')

/*1. 连接数据库*/
// 1.1. 引入mongoose
// 1.2. 连接指定数据库(URL只有数据库是变化的)
// 1.3. 获取连接对象
// 1.4. 绑定连接完成的监听(用来提示连接成功)
mongoose.connect('mongodb://localhost:27017/react_project')

const conn = mongoose.connection

conn.on('connected',function () {
    console.log('数据库已连接...')
})

/*2. 得到对应特定集合的Model*/
// 2.1. 字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type: String, require: true},
    password: {type: String, require: true},
    type: {type: String, require: true}
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema)



/*3. 通过Model或其实例对集合数据进行CRUD操作*/
//3.1. 通过Model实例的save()添加数据
function testSave() {
    const user = {
        username: 'xlx',
        password: md5('123'),
        type: 'dashen'
    }

    const userModel = new UserModel(user)

    userModel.save(function (err,user) {
        console.log('save', err, user)
    })
    /*
    * { _id: 5ae3dffdec33fb256cc89d8e,
      username: 'xlx',
      password: '202cb962ac59075b964b07152d234b70',
      type: 'dashen',
      __v: 0 }
    * */
}
// testSave()

//3.2. 通过Model的find()/findOne()查询多个或一个数据
function testFind() {
    UserModel.find(function (err, users) {
        console.log('find', err, users)
    })
    /*
    * users是数组格式
    * [ { _id: 5ae3dffdec33fb256cc89d8e,
        username: 'xlx',
        password: '202cb962ac59075b964b07152d234b70',
        type: 'dashen',
        __v: 0 } ]
    * */
    UserModel.findOne({_id: '5ae3dffdec33fb256cc89d8e'}, function (err, user) {
        console.log('findOne', err, user)
    })
    /*
    * user是对象格式
    * { _id: 5ae3dffdec33fb256cc89d8e,
      username: 'xlx',
      password: '202cb962ac59075b964b07152d234b70',
      type: 'dashen',
      __v: 0 }
    * */
}
// testFind()

//3.3. 通过Model的findByIdAndUpdate()更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5ae3dffdec33fb256cc89d8e'}, {username: 'xxx'}, 
        function (err, user) {
            console.log('update', err, user)
        })
    /*
    * username已经被修改为xxx，但是返回的是处理之前的数据
    * { _id: 5ae3dffdec33fb256cc89d8e,
      username: 'xlx',
      password: '202cb962ac59075b964b07152d234b70',
      type: 'dashen',
      __v: 0 }
    * */
}
// testUpdate()

//3.4. 通过Model的remove()删除匹配的数据
function testRemove() {
    UserModel.remove({_id: '5ae3dffdec33fb256cc89d8e'}, function (err, result) {
        console.log('remove', err, result)
    })
    /*
    * ok代表操作成功（不一定删除成功，比如，如果根据该 id，没有匹配到，ok还是会返回 1）
    * n 代表删除的文档个数
    * { ok: 1, n: 1 }
    * */
}
testRemove()
