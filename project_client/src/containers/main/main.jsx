import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom'

import LaobanInfo from '../laoban_info/laoban_info'
import DashenInfo from '../dashen_info/dashen_info'


export default class Main extends Component {

    render() {
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
