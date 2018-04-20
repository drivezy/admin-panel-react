import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route, Switch
} from 'react-router-dom';
// import { Provider, connect } from 'react-redux';

// import GLOBAL from './../Constants/global.constants';

// import { ToastContainer } from 'react-toastify';

// import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';

/** Router */
// import BookingRouter from './booking.router';
/** Router ends */

/** Components */
import HomeScene from './../Scenes/Home-Scene/home.scene';
import SideNav from './../Scenes/Side-Nav/sideNav.scene';
// import ContactScene from './../Scenes/Contact-Us-Scene/contact.scene';
// import LoginScene from './../Scenes/Login-Scene/login.scene';
// import ProfileScene from './../Scenes/Profile-Scene/profile.scene';
// import EditProfileScene from './../Scenes/Edit-Profile-Scene/editProfile.scene';
/** Components ends*/

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
            visible: false
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

    componentDidMount() {
        LoadAsync.loadStyleSheetGlobal();
        // LoadAsync.loadStyleSheet({ src: 'https://fonts.googleapis.com/icon?family=Material+Icons' });
        // GetProperties();

        // setTimeout(() => this.setState({ visible: true }), 3000);
        LoadAsync.loadStyleSheet({
            src: 'https://use.fontawesome.com/releases/v5.0.10/css/all.css',
            attrs: {
                integrity: 'sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg',
                crossorigin: 'anonymous'
            }
        });
    }

    render() {
        const { match } = this.props; // match.path = '/'

        const { visible } = this.state;
        console.log('visiblevisible', visible);
        return (
            <div className="app-container">
                <div className="page-container">
                    <div className="side-nav-container">
                        <SideNav visible={visible} />
                    </div>

                    <div id="main" style={{ width: '100%', height: '100%' }}>
                        <Switch>
                            {/* <Route path="/contact" exact component={ContactScene} />
                            <Route path="/login" exact component={LoginScene} />
                            <Route path="/profile" exact component={ProfileScene} />

                            <Route path="/editProfile" component={EditProfileScene} /> */}

                            <Route path={match.path} component={HomeScene} />
                            {/* <Route path="/search-in-:type" component={SearchVehicle} /> */}
                            {/* <PrivateRoute path="/downloads" component={Download} /> */}
                            {/* <FooterSection />  */}
                            {/* <FooterBlueBar /> */}
                        </Switch>
                    </div>
                </div>

                {/* <ToastContainer /> */}
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


/**
 * Routes under this config will not have header and footer
 * Starting Route is the parent level routing definition, 
 */
class StartRoute extends Component {
    render() {
        return (
            // <Provider store={store}>
            <Router>
                <Switch>
                    <Route path="/" component={MainApp} />
                </Switch>
            </Router>
            // </Provider>
        )
    }
}
export default StartRoute;
