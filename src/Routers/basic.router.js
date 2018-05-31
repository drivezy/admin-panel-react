import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route, Switch, Redirect
} from 'react-router-dom';

/** Router */
import PrivateRoute from './privateRoute.router';
/** Router ends */

import SettingsUtil from './../Utils/settings.utils';


import ModalManager from './../Wrappers/Modal-Wrapper/modalManager';

// import GLOBAL from './../Constants/global.constants';
import { ToastContainer } from 'react-toastify';
import ModalWrapper from './../Wrappers/Modal-Wrapper/modalWrapper.component';
import { LoaderComponent, LoaderUtils } from './../Utils/loader.utils';
import { ConfirmModalComponent, ConfirmUtils } from './../Utils/confirm-utils/confirm.utils';
import { Spotlight } from './../Components/Spotlight-Search/spotlightSearch.component';

import LoginScene from './../Scenes/Login-Scene/Login.scene';

import { SubscribeToEvent } from './../Utils/stateManager.utils';


import MainApp from './index.router';

/**
 * Routes under this config will not have header and footer
 * Starting Route is the parent level routing definition, 
 */
class BasicRoute extends Component {
    state = {
        loggedUser: {}
    };

    componentDidMount() {
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });

    }

    userDataFetched = (data) => {
        this.setState({ loggedUser: data });
    }

    render() {
        const { loggedUser } = this.state;
        return (
            <div id='parent-admin-element' className='drivezy-dark-theme'>
                <Router>
                    <Switch>
                        <Route path="/login" component={LoginScene} />
                        <PrivateRoute path="/" loggedUser={loggedUser} component={MainApp} />
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

export default BasicRoute;