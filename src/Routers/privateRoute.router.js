/**
 * Routes passed through Private route validates user and then only lets enter into the page
 */
import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

export default class PrivateRoute extends Component {
    state = {
        loggedUser: {}
    };

    render() {
        const { component: Component, loggedUser, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={props =>
                    loggedUser.id || !loggedUser.loggedCheckDone ? (
                        <Component {...props} />
                    ) : (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    state: { from: props.location }
                                }}
                            />
                        )
                }
            />
        )
    }
}