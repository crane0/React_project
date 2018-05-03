/*
* 底部导航栏显示的，路由组件
*   写在components中，因为没有交互
* */

import React, {Component} from 'react'
/*将这个组件，包装为路由组件（向外暴露），才可以用路由组件特有的属性 history/location/math*/
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
/*TabBar底部标签栏*/
import {TabBar} from 'antd-mobile'

class NavFooter extends Component {

    static propTypes = {
        navList: PropTypes.array.isRequired
    }

    render() {

        let {navList} = this.props
        //隐藏需要隐藏的
        navList = navList.filter(nav => !nav.hide)

        //用于在<TabBar.Item/>中的 selected属性，是否选中
        const path = this.props.location.pathname

        return (
            <TabBar>
                {
                    navList.map(nav => (
                        <TabBar.Item key={nav.path}
                            title={nav.text}
                            icon={{uri: require(`./images/${nav.icon}.png`)}}
                            selectedIcon={{uri: require(`./images/${nav.icon}_selected.png`)}}
                            selected={path===nav.path}
                            onPress={() => {this.props.history.replace(nav.path)}} />
                    ))
                }
            </TabBar>
        )
    }
}

export default withRouter(NavFooter)


