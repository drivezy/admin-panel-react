import React, { Component } from 'react';
import './Login.scene.css';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import GLOBAL from './../../Constants/global.constants';

import { Post, Get } from './../../Utils/http.utils';

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
            alert('User logged in successfully');
        }
        else {
            alert('Name or Email incorrect');
        }
    }


    render() {
        return (
            <div className="login-form">
                <Card>
                    <CardBody>
                        <Form>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label className="mr-sm-2">Email</Label>
                                <input autoComplete="off" onChange={(e) => this.setState({ username: e.target.value })} type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label className="mr-sm-2">Password</Label>
                                <input autoComplete="off" onChange={(e) => this.setState({ password: e.target.value })} className="form-control" type={this.state.showPassword ? 'text' : 'password'} id="exampleInputPassword1" placeholder="Password" />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Button onClick={(event) => { event.preventDefault(); this.validateCredentials({ username: this.state.username, password: this.state.password }) }} className="btn btn-default">Login</Button>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        )
    }
}