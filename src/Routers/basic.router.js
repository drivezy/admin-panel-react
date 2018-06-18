import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route, Switch, Redirect
} from 'react-router-dom';


import { ToastContainer } from 'react-toastify';

/** Router */
import PrivateRoute from './privateRoute.router';
import IndexRouter from './index.router';
/** Router ends */

/** Scenes */
import LoginScene from './../Scenes/Login-Scene/Login.scene';
/** Scenes End*/

/** Components */
import ModalManager from './../Wrappers/Modal-Wrapper/modalManager';
import ModalWrapper from './../Wrappers/Modal-Wrapper/modalWrapper.component';
import { Spotlight } from './../Components/Spotlight-Search/spotlightSearch.component';
/** Component Ends */

/** Util */
import SettingsUtil from './../Utils/settings.utils';
import { SubscribeToEvent } from './../Utils/stateManager.utils';
import { LoaderComponent, LoaderUtils } from './../Utils/loader.utils';
import { ConfirmModalComponent, ConfirmUtils } from './../Utils/confirm-utils/confirm.utils';
/** Util Ends*/


/**
 * Routes under this config will not have header and footer
 * Starting Route is the parent level routing definition, 
 */
export default class BasicRoute extends Component {
    state = {
        loggedUser: {}
    };

    componentDidMount() {
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }

    userDataFetched = (data) => {
        this.state.loggedUser = data
        // this.setState({ loggedUser: data });
    }

    render() {
        const { loggedUser } = this.state;
        return (
            <div id='parent-admin-element'>
                <Router>
                    <Switch>
                        <Route path="/login" component={LoginScene} />
                        <PrivateRoute path="/" loggedUser={loggedUser} component={IndexRouter} />
                    </Switch>
                </Router>
                <ToastContainer />
                <ModalWrapper ref={(elem) => ModalManager.registerModal(elem)} />
                <LoaderComponent ref={(elem) => LoaderUtils.RegisterLoader(elem)} />
                <ConfirmModalComponent ref={(elem) => ConfirmUtils.RegisterConfirm(elem)} />
                <Spotlight ref={(elem) => SettingsUtil.registerModal(elem)} />
            </div>
        )
    }
}
