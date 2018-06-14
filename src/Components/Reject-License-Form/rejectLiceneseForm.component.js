// Higher Order Component
import React, { Component } from 'react';
import { ModalBody } from 'reactstrap';
import { withFormik, Field } from 'formik';
import { Put } from './../../Utils/http.utils';
import SelectBox from './../Forms/Components/Select-Box/selectBox';
import { GetLookupValues } from './../../Utils/lookup.utils';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import ToastNotifications from '../../Utils/toast.utils';

// Our inner form component which receives our form's state and updater methods as props
const InnerForm = props => {
    const {
        values,
        handleSubmit,
        isSubmitting,
        setFieldValue
    } = props;

    return (
        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <label>Reject Reason</label>
                <Field
                    name='rejection_reason'
                    render={({ field /* _form */ }) => (
                        <SelectBox valueKey="value" field="name" onChange={(selected) => { setFieldValue('rejection_reason', selected.value) }} value={values.rejection_reason} options={props.rejectionReason} />
                    )}
                />
            </div>
            <div className="form-group">
                <div className="margin-top-5" id="buttonWidth">
                    <button className="btn btn-primary pull-right button-blue" type="submit" disabled={isSubmitting}>
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    )
}



// Wrap our form with the using withFormik HoC
const RejectForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => {

        const { rejectdData, rejection_reason } = props;

        return {
            approved: rejectdData.approved,
            rejection_reason: rejection_reason || ''
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
            url: 'userLicense/' + props.rejectdData.licenseIndex,
            body: {
                approved: values.approved,
                rejection_reason: values.rejection_reason
            }
        });


        props.onSubmit();
    },
})(InnerForm);


export default class RejectLicenseForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rejectdData: this.props.rejectdData,
            rejectionReason: [],
            rejection_reason: ''
        }
    }

    componentDidMount() {
        this.getLookups();
    }

    getLookups = async () => {
        const result = await GetLookupValues(82);
        if (result.success) {
            const rejectionReason = result.response;
            this.setState({ rejectionReason })
        }

    }

    onSubmit = () => {
        ToastNotifications.success("License is Rejected");
        ModalManager.closeModal();
    }

    render() {
        const { rejectdData, rejectionReason, rejection_reason } = this.state;
        return (
            <ModalBody>
                <div>

                    {
                        rejectionReason &&
                        <RejectForm onSubmit={this.onSubmit} rejectdData={rejectdData} rejectionReason={rejectionReason} rejection_reason={rejection_reason} />
                    }
                </div>
            </ModalBody>
        )
    }
}