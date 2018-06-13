import React, { Component } from 'react';
import './Signup.scene.css';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import GLOBAL from './../../Constants/global.constants';
import Yup from "yup";
import classnames from "classnames";


import {
    Redirect
} from 'react-router-dom';

import { Post, Get } from './../../Utils/http.utils';
import { Location } from './../../Utils/location.utils';
import ToastNotifications from '../../Utils/toast.utils';

import { withFormik } from "formik";


const formikEnhancer = withFormik({
    validationSchema: Yup.object().shape({
      Name: Yup.string()
        .min(2, "Minimum 2 characters required")
        .required("Name is required."),
      Email: Yup.string()
        .email("Invalid email address")
        .required("E-mail is required."),
      Password: Yup.string()
        .min(6, "Password should contain more than 6 characters")
        .required("Password is required!")
    }),
  
    mapPropsToValues: ({ user }) => ({
      ...user
    }),
    handleSubmit: (payload, { setSubmitting }) => {
        ToastNotifications.success('Successfully Signed Up');
        //alert(payload.Email);
        setSubmitting(false);
    },
    displayName: "MyForm"
  });
  
  const InputFeedback = ({ error }) =>
    error ? <div className="input-feedback">{error}</div> : <br />;

  /* const formlabel = ({ error, className, children, ...props }) => {
    return (
        <label className="label" {...props}>
        {children}
        </label>
    );
    };
    */
  
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
    /*
    <formlabel htmlFor={id} error={error}>
                {label}
            </formlabel>
    */
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
                                <TextInput style={{height: 35, width: 400}}
                                id="Name"
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
                                <TextInput style={{height: 40, width: 400}}
                                id="Email"
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
                                <TextInput style={{height: 40, width: 400}}
                                id="Password"
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
  
  const MyEnhancedForm = formikEnhancer(MyForm);

  export default MyEnhancedForm;