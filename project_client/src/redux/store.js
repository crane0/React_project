import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
//用于在浏览器使用 Redux调试插件
import {composeWithDevTools} from 'redux-devtools-extension'

import Reducers from './reducers'


export default createStore(Reducers, composeWithDevTools(applyMiddleware(thunk)))