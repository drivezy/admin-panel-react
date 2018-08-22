import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route, Switch, Redirect
} from 'react-router-dom';

import { Location } from 'drivezy-web-utils/build/Utils/location.utils';
import { ToastNotifications, ModalManager, LoaderUtils } from 'drivezy-web-utils/build/Utils';
import { GetItem, SetItem } from 'storage-utility';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';

import { ToastContainer } from 'drivezy-web-utils/build/Components/Toast-Container/toastContainer.component';
import { ModalWrapper } from 'drivezy-web-utils/build/Components/Modal-Wrapper/modalWrapper.component';
import { ConfirmModal } from 'drivezy-web-utils/build/Components/Confirm-Modal-Wrapper/confirm.modal';

import { InitializeCommonJs } from 'common-js-util';
// import { ToastContainer } from 'react-toastify';
import GLOBAL from './../Constants/global.constants';


import { SubscribeToEvent } from 'state-manager-utility';

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
import { GetUserPreferences } from './../Utils/userPreference.utils';

/** Util Ends*/

/**
 * BasicRoute is wrapped within Router to make available history object
 * history object is used to pass to Location utility method which is helpful in navigation across the project
 */

 let homepage="";

export class EntryComopnent extends Component {
    render() {
        return (
            <Router>
                <Route path="/" component={BasicRoute} />
            </Router>
        )
    }
}

/**
 * Routes under this config will not have header and footer
 * Starting Route is the parent level routing definition, 
 */
export class BasicRoute extends Component {
    constructor(props) {
        super(props);
        InitializeCommonJs({
            GLOBAL,
            ToastNotifications,
            GetItem, SetItem,
            Loader: LoaderUtils
        });

        Location.getHistoryMethod(this.getRouterProps); // pass methods, so that location utils can get history object
    }

    state = {
        loggedUser: {},
    };

    getRouterProps = () => ({ history: this.props.history });

    componentDidMount() {
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
        // setTimeout(() => ConfirmUtils.confirmModal({ message: "Are you sure you want to request approval?", callback: () => console.log('hit') }), 2000);
        LoginCheck();
        this.getHomepage();
    }

    // getHomepage = async() => {
    //     const preference = await GetUserPreferences();
    //     if(preference.success){
    //         const preferences = preference.response;
    //         preferences.map((parameter) => (
    //             (parameter.parameter == "homepage") ? homepage = parameter.value : null
    //         )) 
    //     }
    // } 

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
                {/* <Router> */}
                <Switch>
                    <Route path="/signup" component={SignupScene} />
                    <Route path="/login" component={LoginScene} />
                    <PrivateRoute path="/" loggedUser={loggedUser} component={IndexRouter} />
                </Switch>
                {/* </Router> */}
                <ToastContainer ref={(elem) => { ToastNotifications.register(elem); }} />

                <ModalWrapper ref={(elem) => ModalManager.registerModal(elem)} />
                <ConfirmModal ref={(elem) => ConfirmUtils.RegisterConfirm(elem)} />
                <Spotlight ref={(elem) => SettingsUtil.registerModal(elem)} />

            </div>
        )
    }
}
