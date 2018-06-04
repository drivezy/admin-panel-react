// Higher Order Component
import React, { Component } from 'react';
import { withFormik, Field } from 'formik';
import { Put } from './../../Utils/http.utils';
import SelectBox from './../Forms/Components/Select-Box/selectBox';

// Our inner form component which receives our form's state and updater methods as props
const InnerForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue
}) => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="">First Name<span className="text-red">*</span></label>
                <input type="text" name="first_name" className="form-control" value={values.first_name} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="">Last Name</label>
                <input type="text" name="last_name" className="form-control" value={values.last_name} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="">Date Of Birth<span className="text-red">*</span></label>
                <input type="text" name="dob" className="form-control" value={values.dob} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label className="control-label">Gender</label>
                <Field
                    name='gender'
                    render={({ field /* _form */ }) => (
                        <SelectBox valueKey="value" field="label" name='gender' onChange={(selected) => { setFieldValue('gender', selected.value) }} value={values.gender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "others", label: "Others" }]} />
                    )}
                />
            </div>

            <div className="form-group">
                <label className="">Email</label>
                <input type="text" name="email" className="form-control" value={values.email} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="">Mobile</label>
                <input type="text" name="mobile" className="form-control" value={values.mobile} onChange={handleChange} />
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
            mobile: userContent.mobile || '',
            gender: userContent.gender || '',
            dob: userContent.dob || ''
        }

    },
    // Add a custom validation function (this can be async too!)
    // validationSchema: (props, values) => {

    // let da = {
    //     'first_name': Yup.string().required()
    // }

    // let fields = Object.keys(props.payload.columns);

    // const { columns } = props.payload;

    // fields.forEach((column) => {
    //     if (columns[column].mandatory) {
    //         da[columns[column].column_name] = Yup.string().required(columns[column].display_name + ' is required.');
    //     }
    // });

    // return Yup.object().shape(da);

    // return Yup.object().shape({
    //     friends: Yup.array()
    //         .of(
    //             Yup.object().shape({
    //                 name: Yup.string()
    //                     .min(4, 'too short')
    //                     .required('Required'), // these constraints take precedence
    //                 salary: Yup.string()
    //                     .min(3, 'cmon')
    //                     .required('Required'), // these constraints take precedence
    //             })
    //         )
    //         .required('Must have friends') // these constraints are shown if and only if inner constraints are satisfied
    //         .min(3, 'Minimum of 3 friends'),
    // })
    // },
    // Submission handler
    handleSubmit: async (
        values,
        {
            props,
            setSubmitting,
            setErrors /* setValues, setStatus, and other goodies */,
        }
    ) => {
        const result = await Put({
            url: 'user/' + props.userContent.id,
            body: {
                first_name: values.first_name,
                last_name: values.last_name,
                dob: values.dob,
                email: values.email,
                mobile: values.mobile,
                gender: values.gender
            }
        });
    },
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
        return (
            <div>
                <LicenseForm userContent={userContent} />
            </div>
        )
    }
}