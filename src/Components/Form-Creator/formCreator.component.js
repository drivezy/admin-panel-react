import React, { Component } from 'react';
// import './DetailPortlet.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col
} from 'reactstrap';

import { withFormik } from 'formik';
import Yup from 'yup';

import SelectBox from './../Forms/Components/Select-Box/selectBox';


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


const inputElement = ({ column, shouldColumnSplited,key }) => {

    const elements = {
        107: <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
            <label htmlFor="exampleInputEmail1">{column.display_name}</label>
            <input type="number" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder={`Enter ${column.display_name}`} />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>,
        108: <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
            <label htmlFor="exampleInputEmail1">{column.display_name}</label>
            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder={`Enter ${column.display_name}`} />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
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
        <form onSubmit={handleSubmit}>

            <div className="form-row">

                {
                    payload.formPreference.map((preference, key) => {

                        if (typeof preference != 'string') {
                            const column = payload.columns[preference.column];

                            return inputElement({ column, shouldColumnSplited,key });

                        } else if (typeof preference == 'string') {
                            shouldColumnSplited = preference.includes('s-split-') ? true : preference.includes('e-split-') ? false : shouldColumnSplited;
                        }
                    })
                }
            </div>


            {/* <SelectBox model="city" onChange={setFieldValue} async="city" value={values.city} />

            <label htmlFor="email" style={{ display: 'block' }}>
                Email
            </label>
            <input
                id="email"
                placeholder="Enter your email"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email && touched.email ? 'text-input error' : 'text-input'}
            />
            {errors.email &&
                touched.email && <div className="input-feedback">{errors.email}</div>}

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
    </button> */}

            {/* <DisplayFormikState {...props} /> */}
        </form>
    );
}


const FormContents = withFormik({
    mapPropsToValues: () => ({ email: '', city: '' }),
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
