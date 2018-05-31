import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route, Switch, Redirect
} from 'react-router-dom';

/** Components */
import HomeScene from './../../Scenes/Home-Scene/home.scene';
import GenericListing from './../../Scenes/Generic-Listing/genericListing.scene';
import GenericDetail from './../../Scenes/Generic-Detail/genericDetail.scene';
import SideNav from './../../Scenes/Side-Nav/sideNav.scene';
import Header from './../../Scenes/Header/header.scene';
import BookingDetail from './../../Scenes/Booking-Detail/bookingDetail.scene';


export default class LandingApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menus: this.props.menus
        }
    }

    render() {
        const { menus = [], sideNavExpanded } = this.state;
        const { match } = this.props;

        return (
            <div className="page-container">
                <div className="landing-sidebar">
                    <SideNav visible={sideNavExpanded} onCollapse={this.callback} menus={menus} />
                </div>
                <div className={`landing-wrapper ${sideNavExpanded ? 'sidenav-open' : 'sidenav-closed'}`} id="main" style={{ height: '100%' }}>
                    <Header className={`${sideNavExpanded ? 'expanded' : 'collapsed'}`} />
                    <Switch>
                        {
                            menus.map((menu, index) => {
                                if (Array.isArray(menu.menus)) {
                                    return menu.menus.map((state, index) => {

                                        if (typeof state.controller_path == 'string' && state.controller_path.indexOf('genericListingController.js') != -1) {
                                            return (<Route key={state.url} path={`${match.path}${state.url.split('/')[1]}`} render={props => <GenericListing {...props} menuId={state.id} />} />)
                                        } else if (typeof state.controller_path == 'string' && state.controller_path.indexOf('genericDetailCtrl.js') != -1) {
                                            return (<Route key={state.url} path={state.url} render={props => <GenericDetail {...props} menuId={state.id} />} />)
                                            // return (<Route key={state.url} path={`${match.path}${state.url.split('/')[1]}`} render={props => <GenericDetail {...props} menuId={state.id} />} />)
                                        } else {
                                            // return (<Route key={state.url} path={state.url} component={BookingDetail} />)
                                        }
                                    })
                                }
                            })
                        }
                        {/* <Route path={`${match.path}activeBookings`} component={GenericListing} /> */}
                        {/* <Route path={`${match.path}list/:page`} component={GenericListing} />
                            <Route path={`${match.path}detail/:page/:detailId`} component={GenericDetail} /> */}

                        <Route exact path='/booking/:bookingId' component={BookingDetail} />
                        <Route exact path='/' component={HomeScene} />
                        {this.state.sideNavExpanded}
                    </Switch>
                </div>
            </div>
        )
    }
}