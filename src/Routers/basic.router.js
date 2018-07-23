import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route, Switch, Redirect
} from 'react-router-dom';

import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';
import { ToastContainer } from 'drivezy-web-utils/build/Components/Toast-Container/toastContainer.component';
import { ModalWrapper } from 'drivezy-web-utils/build/Components/Modal-Wrapper/modalWrapper.component';
import { ConfirmModal } from 'drivezy-web-utils/build/Components/Confirm-Modal-Wrapper/confirm.modal';

// import { ToastContainer } from 'react-toastify';

import { SubscribeToEvent } from 'common-js-util';

// /** Router */
import PrivateRoute from './privateRoute.router';
import IndexRouter from './index.router';
// /** Router ends */

// /** Scenes */
import LoginScene from './../Scenes/Login-Scene/Login.scene';


import SignupScene from './../Scenes/Signup-Scene/Signup.scene';
// /** Scenes End*/

import { Spotlight } from './../Components/Spotlight-Search/spotlightSearch.component';
/** Component Ends */

/** Util */
import SettingsUtil from './../Utils/settings.utils';
import { LoginCheck } from './../Utils/user.utils';

/** Util Ends*/


/**
 * Routes under this config will not have header and footer
 * Starting Route is the parent level routing definition, 
 */
export default class BasicRoute extends Component {
    state = {
        loggedUser: {},

    };



    componentDidMount() {
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
        // setTimeout(() => ConfirmUtils.confirmModal({ message: "Are you sure you want to request approval?", callback: () => console.log('hit') }), 2000);
        LoginCheck();

    }

    userDataFetched = (data) => {
        if (data.id) {
            this.state.loggedUser = data;
        } else {
            this.setState({ loggedUser: data });
        }
    }



    render() {
        const { loggedUser } = this.state;
        return (
            <div id='parent-admin-element'>
                <Router>
                    <Switch>
                        <Route path="/signup" component={SignupScene} />
                        <Route path="/login" component={LoginScene} />
                        <PrivateRoute path="/" loggedUser={loggedUser} component={IndexRouter} />
                    </Switch>
                </Router>
                <ToastContainer ref={(elem) => { ToastNotifications.register(elem); }} />

                <ModalWrapper ref={(elem) => ModalManager.registerModal(elem)} />
                <ConfirmModal ref={(elem) => ConfirmUtils.RegisterConfirm(elem)} />
                <Spotlight ref={(elem) => SettingsUtil.registerModal(elem)} />
            </div>
        )
    }
}
