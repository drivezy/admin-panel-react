import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route, Switch
} from 'react-router-dom';
// import { Provider, connect } from 'react-redux';

// import GLOBAL from './../Constants/global.constants';

import { ToastContainer } from 'react-toastify';

// import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';

/** Router */

/** Router ends */

/** Components */
import LoginScene from './../Scenes/Login-Scene/Login.scene';
import HomeScene from './../Scenes/Home-Scene/home.scene';
import GenericListing from './../Scenes/Generic-Listing/genericListing.scene';
import GenericDetail from './../Scenes/Generic-Detail/genericDetail.scene';
import SideNav from './../Scenes/Side-Nav/sideNav.scene';
import Header from './../Scenes/Header/header.scene';


import { LoginCheck } from './../Utils/user.utils';

// import ContactScene from './../Scenes/Contact-Us-Scene/contact.scene';
// import LoginScene from './../Scenes/Login-Scene/login.scene';
// import ProfileScene from './../Scenes/Profile-Scene/profile.scene';
// import EditProfileScene from './../Scenes/Edit-Profile-Scene/editProfile.scene';
/** Components ends*/

import { GetMenusEndPoint } from './../Constants/api.constants';
import { Get } from './../Utils/http.utils';

import { GetPreferences } from './../Utils/preference.utils';

/** Actions */
// import { GetCities } from './../Actions/city.action';
// import { CurrentRoute } from './../Actions/router.action';
/** Actions ends */

/** Store */
// import store from './../index.store';
/** Store ends*/

import LoadAsync from './../Utils/loadAsyncScripts.utils';
// import { GetProperties } from './../Utils/openProperty.utils';

// import { LoginCheck } from './../Actions/user.action';

/** 
 * 2nd level router, mainly includes booking router
 * contains routes without city specific url
 * also invokes router change action with updated router path
 */
class MainApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sideNavExpanded: false,
            menuFetched: false,
        }
        // props.GetCities();
    }

    componentWillMount() {
        // this.props.LoginCheck();
        // this.unlisten = this.props.history.listen((location, action) => {
        // });
    }
    componentWillReceiveProps(nextProps) {
        // will be true
        // this.props.CurrentRoute(nextProps.location.pathname);
        // const locationChanged = nextProps.location !== this.props.location;
    }

    async componentDidMount() {
        LoadAsync.loadStyleSheetGlobal();
        // GetProperties();
        LoadAsync.loadStyleSheet({
            src: 'https://use.fontawesome.com/releases/v5.0.10/css/all.css',
            attrs: {
                integrity: 'sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg',
                crossorigin: 'anonymous'
            }
        });

        const result = await Get({ url: GetMenusEndPoint });
        if (result.success) {
            this.menus = result.response;
            this.setState({ menuFetched: true });
        }

        // Load the preferences
        GetPreferences();
        LoginCheck();
    }

    callback = (method) => {
        // this.setState({sideNavExpanded:method});
        // console.log(method);
    }

    render() {
        const { match } = this.props; // match.path = '/'
        const menus = this.menus || [];
        const { sideNavExpanded } = this.state;
        return (


            <div className="app-container">
                {
                    menus && menus.length &&
                    <div className="page-container">
                        <div className="landing-sidebar">
                            <SideNav visible={sideNavExpanded} onCollapse={this.callback} menus={menus} />
                        </div>
                        <div className="landing-wrapper {this.state.sideNavExpanded ? 'sidenav-open' : 'sidenav-closed'}" id="main" style={{ width: '100%', height: '100%' }}>
                            <Header />
                            <Switch>
                                {
                                    menus.map((menu, index) => {
                                        return menu.menus.map((state, index) => {

                                            if (typeof state.controller_path == 'string' && state.controller_path.indexOf('genericListingController.js') != -1) {
                                                return (<Route key={state.url} path={`${match.path}${state.url.split('/')[1]}`} render={props => <GenericListing {...props} menuId={state.id} />} />)
                                            } else if (typeof state.controller_path == 'string' && state.controller_path.indexOf('genericDetailCtrl.js') != -1) {
                                                return (<Route key={state.url} path={state.url} render={props => <GenericDetail {...props} menuId={state.id} />} />)
                                                // return (<Route key={state.url} path={`${match.path}${state.url.split('/')[1]}`} render={props => <GenericDetail {...props} menuId={state.id} />} />)
                                            } else {
                                                // return (<Route key={state.url} path={`${match.path}activeBookings`} component={GenericListing} />)
                                            }
                                        })
                                    })
                                }
                                {/* <Route path={`${match.path}activeBookings`} component={GenericListing} /> */}
                                {/* <Route path={`${match.path}list/:page`} component={GenericListing} />
                            <Route path={`${match.path}detail/:page/:detailId`} component={GenericDetail} /> */}
                                <Route exact path='/' component={HomeScene} />
                                {this.state.sideNavExpanded}
                            </Switch>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

// function mapStateToProps(state) {
//     // return  {
//     //     cities: state.Cities
//     // }
//     return state;
// }
// const mainApp = connect(mapStateToProps, { GetCities, CurrentRoute, LoginCheck })(MainApp);

// store.subscribe(() => ('store', console.log('store dispatch', store.getState())));

function requireAuth() {
    console.log('Login check')
}



/**
 * Routes under this config will not have header and footer
 * Starting Route is the parent level routing definition, 
 */
class StartRoute extends Component {
    render() {
        return (
            // <Provider store={store}>
            <div>
                <Router>
                    <Switch>
                        {/* <Router path='/list' component={GenericListing} /> */}
                        <Route path="/login" component={LoginScene} onEnter={requireAuth()} />
                        <Route path="/" component={MainApp} />
                        {/* <PrivateRoute path="/" component={MainApp} /> */}
                    </Switch>
                </Router>
                <ToastContainer />
            </div>
            // </Provider>
        )
    }
}

export default StartRoute;

