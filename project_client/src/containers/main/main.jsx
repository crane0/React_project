/*
主界面的路由组件
 */
import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import LaobanInfo from '../laoban_info/laoban_info'
import DashenInfo from '../dashen_info/dashen_info'
import Laoban from '../laoban/laoban'
import Dashen from '../dashen/dashen'
import Message from '../message/message'
import Personal from '../personal/personal'
import NavFooter from '../../components/nav_footer/nav_footer'
import NotFound from "../../components/not_found/not_found";

import {getRedirectTo} from '../../utils'
import {getUser} from '../../redux/actions'


class Main extends Component {

    /*
    * 给组件对象添加属性
    * 包含所有底部导航组件中，相关的信息数据
    * 路由路径'/laoban'对应的'大神列表'，因为老板看到的列表，肯定是有哪些大神。
    * */
    navList = [
        {
            path: '/laoban', // 路由路径
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神',
        },
        {
            path: '/dashen', // 路由路径
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板',
        },
        {
            path: '/message', // 路由路径
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]


    /*
    * 在第一次执行 render()之后，再执行该方法！
    * 用于实现免登陆
    * */
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
        //上面都是为了实现免登陆

        /*
        * 在底部导航栏中，不同的组件，对应显示不同的信息
        *   并且会影响到头部导航栏的标题显示
        * 所以，需要确定在底部导航栏，当前显示的组件
        *   通过当前路径来判断
        * */
        const {navList} = this
        const currentPath = this.props.location.pathname
        const currentNav = navList.find(nav => nav.path === currentPath)

        /*
        * 因为底部导航栏组件navList中，有3个属性
        *   但是老板列表和大神列表同时只会显示一个，
        * 所以，根据用户的类型，给数组的元素添加了一个属性标识，用来判断是否隐藏
        * */
        if(currentNav){
            if(user.type === 'laoban'){
                navList[1].hide = true
            } else {
                navList[0].hide = true
            }
        }

        return (
            <div>
                {/*加判断是因为，在完善用户信息时，不需要当前路径的标题（NavBar是在laoban_info中已经有了）*/}
                {currentNav ? <NavBar>{currentNav.title}</NavBar> : null}
                <Switch>
                    {/*遍历生成，所有数组中对应的路由，key是为了做唯一标识*/}
                    {
                        navList.map(nav => <Route key={nav.path} path={nav.path} component={nav.component}/>)
                    }
                    <Route path='/laoban_info' component={LaobanInfo}/>
                    <Route path='/dashen_info' component={DashenInfo}/>
                    <Route component={NotFound}/>
                </Switch>
                {/*底部导航栏的结构，单独一个模块，因为不会有交互。*/}
                {currentNav ? <NavFooter navList={navList}/> : null}
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {getUser}
)(Main)
