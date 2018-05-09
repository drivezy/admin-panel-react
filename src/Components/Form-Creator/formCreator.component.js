import React, { Component } from 'react';
// import './DetailPortlet.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col
} from 'reactstrap';

import { withFormik, Field, Form } from 'formik';
import Yup from 'yup';

import SelectBox from './../Forms/Components/Select-Box/selectBox';
import ReferenceInput from './../Forms/Components/Reference-Input/referenceInput';

const DisplayFormikState = props => (
    <div style={{ margin: '1rem 0' }}>
        <h3 style={{ fontFamily: 'monospace' }} />
        <pre
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}
        >
            <strong>props</strong> ={' '}
            {JSON.stringify(props, null, 2)}
        </pre>
    </div>
);

// {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */ }


const inputElement = ({ props, values, column, shouldColumnSplited, key }) => {

    const elements = {
        107: <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
            <label htmlFor="exampleInputEmail1">{column.display_name}</label>
            <Field className="form-control" type="number" name={column.column_name} placeholder={`Enter ${column.display_name}`} />
        </div>,
        108: <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
            <label htmlFor="exampleInputEmail1">{column.display_name}</label>
            <Field className="form-control" type="text" name={column.column_name} placeholder={`Enter ${column.display_name}`} />
        </div>,
        109: 'datepicker',
        746: 'time',
        110: 'datetime',
        111: <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
            <label htmlFor="exampleInputEmail1">{column.display_name}</label>
            <Field
                name={column.column_name}
                render={({ field /* _form */ }) => (
                    <SelectBox name={column.column_name} onChange={props.setFieldValue} value={values[column.column_name]} options={[{ name: "True", id: 1 }, { name: "False", id: 0 }]} />
                )}
            />
        </div>,
        116: 'dropdown',
        117: <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
            <label htmlFor="exampleInputEmail1">{column.display_name}</label>
            <Field
                name={column.column_name}
                render={({ field /* _form */ }) => (
                    <ReferenceInput column={column} name={column.column_name} onChange={props.setFieldValue} value={values[column.column_name]} />
                )}
            />
        </div>,

        119: 'switch',
        160: 'textArea',
        411: 'script',
        465: 'list type',
        684: 'serialize',
        708: 'upload',
        768: 'static display',
    }

    return elements[column.column_type];
}



const formElements = props => {
    const {
        values,
        touched,
        errors,
        dirty,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        setFieldValue
    } = props;

    const { payload } = props;

    let shouldColumnSplited = false;

    return (
        <Form>

            <div className="form-row">

                {
                    payload.formPreference.map((preference, key) => {

                        if (typeof preference != 'string') {
                            const column = payload.columns[preference.column];

                            return inputElement({ props, values, column, shouldColumnSplited, key });

                        } else if (typeof preference == 'string') {
                            shouldColumnSplited = preference.includes('s-split-') ? true : preference.includes('e-split-') ? false : shouldColumnSplited;
                        }
                    })
                }
            </div>




            <button
                type="button"
                className="outline"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
            >
                Reset
    </button>
            <button type="submit" disabled={isSubmitting}>
                Submit
    </button>

            <DisplayFormikState {...props.values} />
        </Form>
    );
}


const FormContents = withFormik({
    mapPropsToValues: props => {

        const { payload } = props;

        let response = {}

        payload.formPreference.forEach((preference) => {
            if (typeof preference != 'string') {
                let column = payload.columns[preference.column];
                response[column.column_name] = payload.listingRow[column.column_name] || '';
            }
        });

        return response;
    },
    validationSchema: Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required!'),
    }),
    handleSubmit: (values, { setSubmitting }) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
        }, 1000);
    },
    setFieldValue: (val) => {
        console.log(val);
    },
    displayName: 'BasicForm', // helps with React DevTools
})(formElements);



export default class FormCreator extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {

        const { payload } = this.props;

        return (
            <div className="form-creator">
                <Card>
                    <CardBody>
                        <FormContents payload={payload} />
                    </CardBody>
                </Card>
            </div>
        )
    }
}
