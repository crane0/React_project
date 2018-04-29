import React from 'react'
import axios from 'axios'

export default function ajax(url, data={}, type){

    if(type==='GET'){
        let paramStr = ''
        //Object.keys()遍历的是对象的可枚举属性，返回值为数组
        Object.keys(data).forEach(key => {
            paramStr += key + '=' + data[key] + '&'
        })

        //如果paramStr不是空串，说明 data有传递值，将最后一个 &截取掉
        if(paramStr){
            paramStr = paramStr.substring(0, paramStr.length - 1)
        }
        return axios.get(url + '?' + paramStr)

    } else {
        return axios.post(url, data)
    }
}
