import React, { Component } from 'react';
import './Signup.scene.css';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import GLOBAL from './../../Constants/global.constants';
import Yup from "yup";
import classnames from "classnames";
import { withFormik } from 'formik';


import {
  Redirect
} from 'react-router-dom';

import { Post, Get } from './../../Utils/http.utils';
import { Location } from 'drivezy-web-utils/build/Utils';
import ToastNotifications from '../../Utils/toast.utils';


const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .min(2, "Minimum 2 characters required")
      .required("Name is required."),
    email: Yup.string()
      .email("Invalid email address")
      .required("E-mail is required."),
    password: Yup.string()
      .min(6, "Password should contain more than 6 characters")
      .required("Password is required!")
  }),

  mapPropsToValues: ({ user }) => ({
    ...user
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    //ToastNotifications.success('Successfully Signed Up');
    //alert(payload.Email);
    setSubmitting(false);

    props.onSubmit(values);

  },
  displayName: "MyForm"
});

const InputFeedback = ({ error }) =>
  error ? <div className="input-feedback">{error}</div> : <br />;

const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  ...props
}) => {
  const classes = classnames(
    "input-group",
    {
      "animated shake error": !!error
    },
    className
  );

  return (
    <div className={classes}>
      <input
        id={id}
        className="text-input"
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      <InputFeedback error={error} />
    </div>
  );
};
const MyForm = props => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = props;
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
          <form onSubmit={handleSubmit}>
            <Label> Name </Label>
            <TextInput style={{ height: 35, width: 400 }}
              id="name"
              type="text"
              label="Name"
              placeholder="Enter Your Name"
              autoComplete="off"
              error={touched.Name && errors.Name}
              value={values.Name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Label> E-mail </Label>
            <TextInput style={{ height: 40, width: 400 }}
              id="email"
              type="email"
              label="E-mail"
              placeholder="Enter Your E-mail"
              autoComplete="off"
              error={touched.Email && errors.Email}
              value={values.Email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Label> Password </Label>
            <TextInput style={{ height: 40, width: 400 }}
              id="password"
              type="password"
              label="Password"
              placeholder="Enter Your Password"
              autoComplete="off"
              error={touched.Password && errors.Password}
              value={values.Password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button type="submit" className="btn btn-success btn-block" disabled={isSubmitting}>
              Sign Up
            </button>
          </form>
          <div className="copyright"> Panel 2017-18 © Powered by Drivezy </div>
        </CardBody>

      </Card>
    </div>
  );
};

const SignUpForm = formikEnhancer(MyForm);

export default class SignupScene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
    }
    // this.loggedIn.bind(this);
    this.proceedSignup.bind(this);
  }

  async proceedSignup({ name, email, password }) {
    const res = Post({ urlPrefix: GLOBAL.ROUTE_URL, url: 'user', body: { name, email, password } });
    const signup = await res;
    if (signup.success) {
      ToastNotifications.success('Successfully Signed Up');
    }
    else {
      ToastNotifications.error('Signup Failed');
    }
    //Location.navigate({ url: '/login' });
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
        <SignUpForm onSubmit={this.proceedSignup} />
      </div>
    )
  }
}


