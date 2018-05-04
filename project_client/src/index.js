import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Switch, Route} from 'react-router-dom'
import {Provider} from 'react-redux'

import Register from './containers/register/register'
import Login from './containers/login/login'
import Main from './containers/main/main'
import store from './redux/store'

import './assets/css/index.less'

import './test/socketio_test'

//如果不写 path，则除了/register 和 /login之外的都走 Main这个组件
ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/register' component={Register} />
                <Route path='/login' component={Login} />
                <Route component={Main} />
            </Switch>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
)
