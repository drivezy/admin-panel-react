import React, { Component } from 'react';
import './Login.scene.css';
import { Card, CardBody, Button, Form, FormGroup, Label } from 'reactstrap';

import { SubscribeToEvent } from './../../Utils/stateManager.utils';
import { Location } from 'drivezy-web-utils/build/Utils';

import GLOBAL from './../../Constants/global.constants';

import {
    Redirect
} from 'react-router-dom';

import { LoginCheck } from './../../Utils/user.utils';
import { Post } from './../../Utils/http.utils';

export default class LoginScene extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            username: '',
            password: '',
            redirectToReferrer: false
        }
        // this.loggedIn.bind(this);
        this.proceedLogin.bind(this);

        Location.getHistoryMethod(this.getRouterProps); // pass methods, so that location utils can get history object
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }

    userDataFetched = (data) => {
        const { history } = this.props;
        if (data.id) {
            history.goBack();
        }
    }


    async validateCredentials({ username, password }) {
        const exp = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (exp.test(username) && username !== '' && password !== '') {
            this.proceedLogin({ username, password });
        } else {
            alert('Name or Email incorrect');
        }
    }

    async proceedLogin({ username, password }) {
        const res = Post({ urlPrefix: GLOBAL.ROUTE_URL, url: 'login', body: { username, password } });
        const login = await res;
        if (login.success) {
            // alert('User logged in successfully');
            // this.loginCheck();
            const res = await LoginCheck();
            if (res.success) {
                this.loggedIn(res.response);
            }
        }
        else {
            alert('Name or Email incorrect');
        }
    }

    loggedIn = (data) => {
        console.log(data);
        const a = (this.props.location ? this.props.location.state : null) || { from: { pathname: '/' } };
        // if (a && a.from) {
        //     this.props.setCurrentRoute(a.from.pathname);
        // }

        this.setState({ redirectToReferrer: true });
    }


    render() {
        const { from } = (this.props.location ? this.props.location.state : null) || { from: { pathname: '/' } };
        const { redirectToReferrer } = this.state
        // this.props.setCurrentRoute(from)
        if (redirectToReferrer) {
            // Global.currentRoute = from;
            return (
                <Redirect to={from} />
            )
        }
        const { showPassword } = this.state;
        return (
            <div className="login-form">
                <Card>
                    <CardBody>
                        <div className="Logo">
                            <img src={GLOBAL.ORGANIZATION.logo} />
                        </div>
                        <div className="Name">
                            <p className="text-center">{GLOBAL.ORGANIZATION.name} Dashboard</p>
                        </div>
                        <Form>
                            <FormGroup>
                                <Label>Email</Label>
                                <input autoComplete="off" onChange={(e) => this.setState({ username: e.target.value })} type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <input autoComplete="off" onChange={(e) => this.setState({ password: e.target.value })} className="form-control" type={this.state.showPassword ? 'text' : 'password'} id="exampleInputPassword1" placeholder="Password" />
                            </FormGroup>
                            <FormGroup className="button">
                                <button onClick={(event) => { event.preventDefault(); this.validateCredentials({ username: this.state.username, password: this.state.password }) }} className="btn btn-success btn-block">Login</button>
                            </FormGroup>
                            <div className="row">
                                <div className="col-sm-6">
                                    {/* <a href="#" >Forget Password?</a> */}
                                </div>
                                <div className="col-sm-6  text-right">
                                    {/* <a href="" >Create an account</a> */}
                                </div>
                            </div>
                        </Form>
                        <div className="copyright"> Panel 2017-18 © Powered by Drivezy </div>
                    </CardBody>

                </Card>
            </div>
        )
    }
}