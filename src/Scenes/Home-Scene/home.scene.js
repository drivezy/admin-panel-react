import React, { Component } from 'react';

import './home.scene.css';


import DatePicker from './../../Components/Forms/Components/Date-Picker/datePicker';

import SelectBox from './../../Components/Forms/Components/Select-Box/selectBox';

import Switch from './../../Components/Forms/Components/Switch/switch';

import { Get } from './../../Utils/http.utils';


import { withFormik } from 'formik';
import Yup from 'yup';

export const DisplayFormikState = props =>
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
    </div>;



// Our inner form component. Will be wrapped with Formik({..})
const MyInnerForm = props => {
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
    return (
        <form onSubmit={handleSubmit}>

            <SelectBox model="city" onChange={setFieldValue} async="city" value={values.city} />


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
        </button>

            <DisplayFormikState {...props} />
        </form>
    );
};


const EnhancedForm = withFormik({
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
})(MyInnerForm);

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cities: []
        }
    }


    componentDidMount() {
        // this.getCities();
    }

    // const getOptions = (input) => {
    //     return fetch(`/users/${input}.json`)
    //       .then((response) => {
    //         return response.json();
    //       }).then((json) => {
    //         return { options: json };
    //       });
    //   }

    getCities = async (input) => {
        const url = 'city';
        const result = await Get({ url });

        if (result.success) {
            const cities = result.response.map((option) => (
                { ...option, ...{ label: option.name, value: option[this.state.key] } }
            ));


            return { options: cities };

        }
    }

    getCitiesAlso = (input) => {

        const url = 'city';
        return Get({ url }).then((result) => {
            if (result.success) {
                const cities = result.response.map((option) => (
                    { ...option, ...{ label: option.name, value: option[this.state.key] } }
                ));
                return { options: cities };
            }
        });
    }

    render() {

        const { cities } = this.state;

        return (
            <div className="home-scene">
                {/* <SelectBox getOptions={this.getCities} /> */}
            </div>
        )
    }
}