import io from 'socket.io-client'

/*
* 连接服务器，得到与服务器的连接对象 socket
*   只要连接上，服务器那边就会监听到
* */
const socket = io('ws://localhost:4000')

//向服务器发送消息
socket.emit('sendMsg', {name: 'baby'})

//接收服务器发送的消息
socket.on('receiveMsg', function(data){
    console.log('客户端，接收到服务器发送的数据', data)
})