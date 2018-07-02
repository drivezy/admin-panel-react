// Higher Order Component
import React, { Component } from 'react';

import { withFormik, Field } from 'formik';
import { Put } from './../../Utils/http.utils';
import SelectBox from './../Forms/Components/Select-Box/selectBox';
import './userLicenseForm.component.css'
// Our inner form component which receives our form's state and updater methods as props
const InnerForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,

}) => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="name">First Name<span className="text-red">*</span></label>
                <input type="text" name="first_name" placeholder="First Name" className="form-control" value={values.first_name} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label className="name">Last Name</label>
                <input type="text" name="last_name" placeholder="Last Name" className="form-control" value={values.last_name} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="name">Date Of Birth<span className="text-red">*</span></label>
                <input type="text" name="dob" placeholder="yyyy-mm-dd" className="form-control" value={values.dob} onChange={handleChange} />
                {
                    values.detectedDob.map((dob, key) => {
                        return (
                            <small className="detected-items" key={key}>Detected DoB:
                                <span className="item" onClick={() => setFieldValue('dob', dob)}>{dob}

                                </span>
                                <br />
                            </small>
                        );
                    })
                }
            </div>

            <div className="form-group">
                <label className="name">Gender</label>
                <Field
                    name='gender'
                    render={({ field /* _form */ }) => (
                        <SelectBox valueKey="value" field="label" name='gender' placeholder={'Gender'} onChange={(selected) => { setFieldValue('gender', selected ? selected.value : values.gender) }} value={values.gender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "others", label: "Others" }]} />
                    )}
                />
            </div>

            <div className="form-group">
                <label className="name">Email</label>
                <input type="text" name="email" placeholder="Email" className="form-control" value={values.email} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="name">Mobile</label>
                <input type="text" name="mobile" placeholder="Mobile" className="form-control" value={values.mobile} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="name">License Number</label>
                <input type="text" name="license_number" placeholder="Licence Number" className="form-control" value={values.license_number} onChange={handleChange} />
                {
                    (values.detectedLicense) &&
                    values.detectedLicense.map((license, key) => {
                        return (

                            <small className="detected-items" key={key}>Detected License Number:

                                <span className="item" onClick={() => setFieldValue('license_number', license)}>{license}
                                </span>
                                <br />
                            </small>
                        );


                        console.log(license);

                    })
                }

            </div>

            <div className="type-licenses-group">
                <label className="name">Type of License<span className="text-red">*</span></label>
                <div className="licenses-checkbox">
                    <div>
                        <span> <input type="checkbox" name="license_validated_for_4_wheeler" placeholder="Is License validated for 4 wheeler" value={values.license_validated_for_4_wheeler} checked={values.license_validated_for_4_wheeler} onChange={handleChange} /></span>
                        <span className="tick-name">4 Wheeler </span>
                    </div>
                    <div>
                        <span> <input type="checkbox" name="license_validated_for_two_wheeler" placeholder="Is License validated for 2 wheeler" value={values.license_validated_for_two_wheeler} checked={values.license_validated_for_two_wheeler} onChange={handleChange} /></span>
                        <span className="tick-name">2 Wheeler with Gear  </span>
                    </div>
                    <div>
                        <span> <input type="checkbox" name="license_validated_for_two_wheeler_gearless" placeholder="Is License validated for 2 wheeler gearless" value={values.license_validated_for_two_wheeler_gearless} checked={values.license_validated_for_two_wheeler_gearless} onChange={handleChange} /></span>
                        <span className="tick-name">2 Wheeler without Gear </span>
                    </div>

                </div>
            </div>



            <div className="form-group">
                <div className="margin-top-5" id="buttonWidth">
                    <button className="btn btn-primary pull-right button-blue" type="submit" disabled={isSubmitting}>
                        Save Changes
                    </button>
                </div>
            </div>
        </form >
    );

// Wrap our form with the using withFormik HoC
const LicenseForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => {

        const { userContent, detectedDob, detectedLicense, detectedText, detectedExpiryDate } = props;

        return {
            first_name: userContent.first_name || '',
            last_name: userContent.last_name || '',

            email: userContent.email || '',
            mobile: userContent.mobile || '',
            gender: userContent.gender || '',
            dob: userContent.dob || '',
            license_number: userContent.license_number || '',
            license_validated_for_4_wheeler: userContent.license_validated_for_4_wheeler == 1 ? true : false || '',
            license_validated_for_two_wheeler: userContent.license_validated_for_two_wheeler || '',
            license_validated_for_two_wheeler_gearless: userContent.license_validated_for_two_wheeler_gearless || '',
            detectedDob: detectedDob,
            detectedLicense: detectedLicense,
            detectedText: detectedText,
            detectedExpiryDate: detectedExpiryDate
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
                gender: values.gender,
                license_validated_for_4_wheeler: values.license_validated_for_4_wheeler,
                license_validated_for_two_wheeler: values.license_validated_for_two_wheeler,
                license_validated_for_two_wheeler_gearless: values.license_validated_for_two_wheeler_gearless,
                display_name: values.first_name +' '+values.last_name

            }
        });
    },
})(InnerForm);



export default class UserLicenseForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userContent: this.props.userObj,
            detectedDob: this.props.detectedDob,
            detectedLicense: this.props.detectedLicense,
            detectedText: this.props.detectedText,
            detectedExpiryDate: this.props.detectedExpiryDate

        }
    }


    render() {
        const { userContent, detectedDob, detectedLicense, detectedText, detectedExpiryDate } = this.state;
        return (
            <div className="license-form">
                <LicenseForm userContent={userContent} detectedDob={detectedDob} detectedLicense={detectedLicense} detectedText={detectedText} detectedExpiryDate={detectedExpiryDate} />
            </div>
        )
    }
}