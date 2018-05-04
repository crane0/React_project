/*
* 用户列表的，路由组件
* 因为在老板和大神的列表中，都是一样，所以将其抽出作为公共的部分，
*   并且，没有交互，没有用到react-redux，所以放在components中，
*   有的内容不显示，用3目运算符做了判断。
* */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {WingBlank, WhiteSpace, Card} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

class UserList extends Component {

    static propTypes = {
        userList: PropTypes.array.isRequired
    }

    render() {

        const {userList} = this.props
        console.log(userList)

        /*
        * style={{marginBottom:50, marginTop:50}}
        *   这里设置样式，是为了保证列表，不被底部和顶部导航栏盖住。
        * Card onClick
        *   点击对应的用户，跳转到聊天页面，${user._id}就是该卡片对应的用户，
        *   所以在chat.jsx中，可以通过match匹配请求地址中的内容，获取对应的卡片用户
        * */
        return (
            <WingBlank style={{marginBottom:50, marginTop:50}}>
                {
                    userList.map(user => (
                        <div key={user._id}>
                            <WhiteSpace/>
                            <Card onClick={() => this.props.history.push(`/chat/${user._id}`)}>
                                <Card.Header
                                    thumb={require(`../../assets/images/${user.header}.png`)}
                                    extra={user.username}
                                />
                                <Card.Body>
                                    <div>职位：{user.post}</div>
                                    {user.company ? <div>公司：{user.company}</div> : null}
                                    {user.salary ? <div>薪水：{user.salary}</div> : null}
                                    <div>描述：{user.info}</div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                }
            </WingBlank>
        )
    }
}

export default withRouter(UserList)
