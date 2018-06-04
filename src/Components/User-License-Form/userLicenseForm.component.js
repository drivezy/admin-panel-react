

// Higher Order Component
import React, { Component } from 'react';
import { withFormik } from 'formik';

// Our inner form component which receives our form's state and updater methods as props
const InnerForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
}) => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="">First Name<span className="text-red">*</span></label>
                <input type="text" name="First Name" className="form-control" value={values.first_name} onChange={handleChange}
                    onBlur={handleBlur} />
            </div>
            <div className="form-group">
                <label className="">Last Name</label>
                <input type="text" name="Last Name" className="form-control" value={values.last_name} onChange={handleChange}
                    onBlur={handleBlur} />
            </div>
            <div className="form-group">
                <label className="">Date Of Birth<span className="text-red">*</span></label>
                <input type="text" name="Date Of Birth" className="form-control" value={values.dob} onChange={handleChange}
                    onBlur={handleBlur} />
            </div>
            <div className="form-group">
                <label className="control-label">Gender</label><span className="text-red">*</span>
                <select value={values.gender} className="form-control form-box" onChange={handleChange}
                    onBlur={handleBlur}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div className="form-group">
                <label className="">Email</label>
                <input type="text" name="Email" className="form-control" value={values.email} onChange={handleChange}
                    onBlur={handleBlur} />
            </div>
            <div className="form-group">
                <label className="">Mobile</label>
                <input type="text" name="Mobile" className="form-control" value={values.mobile} onChange={handleChange}
                    onBlur={handleBlur} />
            </div>
            <div className="form-group">
                <div className="margin-top-5" id="buttonWidth">
                    <button className="btn btn-primary pull-right button-blue" type="submit" disabled={isSubmitting}>
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    );

// Wrap our form with the using withFormik HoC
const LicenseForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => {

        const { userContent } = props;

        return {
            first_name: userContent.first_name || '',
            last_name: userContent.last_name || '',
            email: userContent.email || '',
            mobile: userContent.mobile || ''
        }

    },
    // Add a custom validation function (this can be async too!)
    validate: (values, props) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
            errors.email = 'Invalid email address';
        }
        return errors;
    },
    // Submission handler
    // handleSubmit: (
    //     values,
    //     {
    //         props,
    //         setSubmitting,
    //         setErrors /* setValues, setStatus, and other goodies */,
    //     }
    // ) => {
    //     LoginToMyApp(values).then(
    //         user => {
    //             setSubmitting(false);
    //             // do whatevs...
    //             // props.updateUser(user)
    //         },
    //         errors => {
    //             setSubmitting(false);
    //             // Maybe even transform your API's errors into the same shape as Formik's!
    //             setErrors(transformMyApiErrors(errors));
    //         }
    //     );
    // },
})(InnerForm);


export default class UserLicenseForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userContent: this.props.userObj,
        }
    }

    render() {
        const { userContent } = this.state;
        console.log(userContent);
        return (
            <div>
                <LicenseForm userContent={userContent} />
            </div>
        )
    }
}

// Use <MyForm /> anywhere
// const Basic = () => (
//     <div>
//         <h1>My Form</h1>
//         <p>This can be anywhere in your application</p>
//         <MyForm />
//     </div>
// );