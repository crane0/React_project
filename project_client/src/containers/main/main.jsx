/*
主界面的路由组件
 */
import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import LaobanInfo from '../laoban_info/laoban_info'
import DashenInfo from '../dashen_info/dashen_info'

import {getRedirectTo} from '../../utils'
import {getUser} from '../../redux/actions'

class Main extends Component {

    //在第一次执行 render()之后，再执行该方法！
    componentDidMount(){
        const userId = Cookies.get('userId')
        const {_id} = this.props.user
        /*
        * 这个判断，cookie中有，说明之前登陆过；user中没有，说明这次还没有登陆
        * 所以，发送请求获取 user的数据
        * */
        if(userId && !_id){
            console.log('发送异步请求，通过cookie中的userId发送请求')
            this.props.getUser()
        }
    }

    render() {

        const userId = Cookies.get('userId')
        //如果cookie中没有，直接跳转登陆页面
        if(!userId){
            return <Redirect to='/login'/>
        }

        /*
        * 如果cookie中有，说明之前登陆过（也经历过注册，所以user中会有_id）。
        * 再检查 user中_id，如果没有，说明还没有完善详细信息
        * 则return null，页面什么都不显示，接下来立马执行
        *   上面的 componentDidMount，发送请求，获取数据库的 user信息
        *   再执行下面的重定向。也就实现了免登陆功能。
        * */
        const {user} = this.props
        if(!user._id){
            return null
        } else {
            /*
            * 如果访问的是根路径，重定向到指定的页面
            *   其中涉及到header是否存在，而指向不同的路由
            * */
            let path = this.props.location.pathname
            if(path === '/'){
                path = getRedirectTo(user.type, user.header)
                return <Redirect to={path} />
            }
        }


        return (
            <div>
                <Switch>
                    <Route path='/laoban_info' component={LaobanInfo}/>
                    <Route path='/dashen_info' component={DashenInfo}/>
                </Switch>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {getUser}
)(Main)
