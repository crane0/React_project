
const {ChatModel} = require('../db/models')

/*暴露出去，会在www文件中，进行配置 */
module.exports = function (server) {
    const io = require('socket.io')(server)

    /*
    * 监视客户端与服务器的连接
    *   socket就是与客户端连接的对象
    *   只要客户端连接了服务器，这里就可以发现。
    * */
    io.on('connection', function (socket) {
        console.log('有一个客户来了')

        //接收客户端发送的消息（data与前台约定，是对象格式）
        socket.on('sendMsg', function ({from, to, content}) {
            console.log('服务器收到消息', {from, to, content})

            //处理数据
            const chat_id = [from, to].sort().join('_')
            const create_time = Date.now()

            new ChatModel({from, to, content, chat_id, create_time}).save(function (err, chatMsg) {
                //向客户端发送消息
                io.emit('receiveMsg', chatMsg)
                console.log('向客户端发送的消息', chatMsg)
            })
        })
    })
}