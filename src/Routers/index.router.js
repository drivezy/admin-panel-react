import React, { Component } from 'react';
import { HotKeys } from 'react-hotkeys';

import { PreserveState } from 'drivezy-web-utils/build/Utils';
import { SubscribeToEvent } from 'state-manager-utility';

/** Component */
import Landing from './../Components/Landing/landing.component';
/** Component Ends */

/** Utils */
// import { LoginCheck } from './../Utils/user.utils';
import { GetPreferences } from './../Utils/preference.utils';
import SettingsUtil from './../Utils/settings.utils';
import { GetMenusFromApi } from './../Utils/menu.utils';
import LoadAsync from './../Utils/loadAsyncScripts.utils';
// import { Location } from './../Utils/location.utils';
import { GetUserPreferences } from './../Utils/userPreference.utils';
import { Spotlight } from '../Components/Spotlight-Search/spotlightSearch.component';


// import { GetProperties } from './../Utils/openProperty.utils';


/** 
 * 2nd level router, mainly includes booking router
 * contains routes without city specific url
 * also invokes router change action with updated router path
 */

export default class IndexRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sideNavExpanded: true,
            menuFetched: true,
            elem: true,
            keyMap: {
                moveUp: 'Shift+B',
                // spotlight: 'meta+f'
            }
        }
        // props.GetCities();
    }


    keyMap = {
        moveUp: 'Shift+B',
    }

    handlers = {

        'moveUp': (event) => this.toggleSideNav(this.state.sideNavExpanded),
        'spotlight': (event) => {
            
            SettingsUtil.openSpotlightModal();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        PreserveState();
        // will be true
        // this.props.CurrentRoute(nextProps.location.pathname);
        // const locationChanged = nextProps.location !== this.props.location;
    }


    async componentDidMount() {
        LoadAsync.loadStyleSheetGlobal();
        // GetProperties();
        LoadAsync.loadStyleSheet({
            src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css',
            // src: 'https://use.fontawesome.com/releases/v5.0.10/css/all.css',
            // src: 'https://use.fontawesome.com/4ca6d82400.js',
            attrs: {
                integrity: 'sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg',
                crossorigin: 'anonymous'
            }
        });

        // const result = await GetMenusFromApi();
        // if (result.success) {
        //     this.menus = result.response;
        //     this.setState({ menuFetched: true });
        // }
        this.menus = await GetMenusFromApi();
        this.setState({ menuFetched: true });

        // LoginCheck();

        // Load the preferences
        const preference = await GetUserPreferences();

        if (preference.success) {
            this.assignSpotlight(preference.response);
        }

        SubscribeToEvent({ eventName: 'launchSpotlight', callback: this.assignSpotlight.bind(this) })
    }




    assignSpotlight = (preference) => {
        let spotlight;
        if (Array.isArray(preference)) {
            spotlight = preference.filter(entry => entry.parameter == "spotlightkeys").pop();
        }
        else {
            spotlight = preference.name;
        }

        if (spotlight) {
            let keys = JSON.parse(spotlight.value).map(key => key.key).join('+');
            let { keyMap } = this.state;

            keyMap['spotlight'] = keys;

            // this.setState({ keyMap });
            this.state.keyMap = keyMap;
            this.forceUpdate();
      
        }
    }



    getRouterProps = () => ({ history: this.props.history });

    render() {
        const { match, history } = this.props; // match.path = '/'
        const menus = this.menus || [];
        const { keyMap } = this.state;

        return (
            <div>
                <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={this.handlers}>
                    <div className="app-container">
                        {/* Landing Is the Basic Layout that builds the routes and the layout */}
                        <Landing match={match} menus={menus} history={history} />
                        {/* Landing Ends */}
                    </div>
                </HotKeys>
            </div>
        )
    }
}
