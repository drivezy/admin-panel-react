import React, { Component } from 'react';
import './Signup.scene.css';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import GLOBAL from './../../Constants/global.constants';

import {
    Redirect
} from 'react-router-dom';

import { LoginCheck } from './../../Utils/user.utils';
import { Post, Get } from './../../Utils/http.utils';

import { updateUser, setCurrentRoute } from './../../';
import ToastNotifications from '../../Utils/toast.utils';
import { Location } from './../../Utils/location.utils';

export default class SignupScene extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            name: '',
            email: '',
            password: '',
            redirectToReferrer: false
        }
        // this.loggedIn.bind(this);
        this.proceedSignup.bind(this);
    }


    async validateCredentials({ name, email, password }) {
        const exp = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (exp.test(email) && email !== '' && password !== '' && name !== '') {
            this.proceedSignup({ name, email, password });
        } else {
            alert('Name or Email incorrect');
        }
    }

    async proceedSignup({ name,email, password }) {
        // user
        // name
        // password
        // email
        const res = Post({ urlPrefix: GLOBAL.ROUTE_URL, url: 'user', body: { name, email, password } });
        const signup = await res;
        if (signup.success) {
            //alert('Signed Up Successfully');
            ToastNotifications.success('Successfully Signed Up');
            // this.loginCheck();
            /*const res = await LoginCheck();
            if (res.success) {
                this.loggedIn(res.response);
            }*/
        }
        else {
            alert('Name or Email incorrect');
        }
        Location.navigate({url: '/login'});
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
            <div className="sign-form">
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
                                <Label>Name</Label>
                                <input autoComplete="off" onChange={(e) => this.setState({ name: e.target.value })} type="text" className="form-control" id="exampleInputEmail1" placeholder="Name" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Email</Label>
                                <input autoComplete="off" onChange={(e) => this.setState({ email: e.target.value })} type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <input autoComplete="off" onChange={(e) => this.setState({ password: e.target.value })} className="form-control" type={this.state.showPassword ? 'text' : 'password'} id="exampleInputPassword1" placeholder="Password" />
                            </FormGroup>
                            <FormGroup className="button">
                                <Button onClick={(event) => { event.preventDefault(); this.validateCredentials({ name: this.state.name, email: this.state.email, password: this.state.password }) }} className="btn btn-success btn-block">Sign Up</Button>
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