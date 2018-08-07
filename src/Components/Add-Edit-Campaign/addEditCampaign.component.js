// Higher Order Component
import React, { Component } from 'react';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';

import { ModalBody } from 'reactstrap';
import { withFormik, Field, Form } from 'formik';
import { Put } from 'common-js-util';

import SelectBox from './../Forms/Components/Select-Box/selectBox';
import { GetLookupValues } from './../../Utils/lookup.utils';
import DatePicker from './../Forms/Components/Date-Picker/datePicker';

// Our inner form component which receives our form's state and updater methods as props
const InnerForm = props => {
    const {
        values,
        handleSubmit,
        isSubmitting,
        setFieldValue
    } = props;

    return (

        <Form role="form" name="genericForm" >
            <div className="form-row">
                <div className="form-group col-6">
                    <label>Campaign Name</label>
                    <input ng-model="addCampaignRecord.formContent.name" name="Camp" type="text" className="form-control form-box requiredField" placeholder="Name" required />
                </div>
                <div className="form-group col-6">
                    <label className="control-label val-span">Description</label>
                    <textarea ng-model="addCampaignRecord.formContent.description" name="Description" type="text" className="form-control form-box requredField" placeholder="Description" required></textarea>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">Pickup Time</label>
                    <div className="input-group date-field">
                        <div>
                            <DatePicker placeholder={`Enter Pickup Time`} timePicker={true} name="Pickup time" onChange={props.setFieldValue} value={values.pickup_time} />
                            {/* <daterange-picker required="true" placeholder="Select Range" ng-model="addCampaignRecord.pick_drop_range" min-date="addCampaignRecord.pickup_time"></daterange-picker> */}
                        </div>
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">Drop Time</label>
                    <div className="input-group date-field">
                        <div>
                            <DatePicker placeholder={`Enter Drop Time`} timePicker={true} name="Drop time" onChange={props.setFieldValue} value={values.drop_time} />
                            {/* <daterange-picker required="true" placeholder="Select Range" ng-model="addCampaignRecord.start_end_range" min-date="addCampaignRecord.start_time"></daterange-picker> */}
                        </div>
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">Start Time</label>
                    <div className="input-group date-field">
                        <div>
                            <DatePicker placeholder={`Enter Pickup Time`} timePicker={true} name="Pickup time" onChange={props.setFieldValue} value={values.start_time} />
                            {/* <daterange-picker required="true" placeholder="Select Range" ng-model="addCampaignRecord.pick_drop_range" min-date="addCampaignRecord.pickup_time"></daterange-picker> */}
                        </div>
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">End Time</label>
                    <div className="input-group date-field">
                        <div>
                            <DatePicker placeholder={`Enter Drop Time`} timePicker={true} name="Drop time" onChange={props.setFieldValue} value={values.end_time} />
                            {/* <daterange-picker required="true" placeholder="Select Range" ng-model="addCampaignRecord.start_end_range" min-date="addCampaignRecord.start_time"></daterange-picker> */}
                        </div>
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Active</label>
                    <Field
                        name={values.active}
                        render={({ field /* _form */ }) => (
                            <div className="button-group">
                                <button className={`btn btn-sm btn-${values.active ? `success` : `default`}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        FormUtils.OnChangeListener({ values, value: true });
                                        props.setFieldValue(values.active, true);
                                    }
                                    }>True</button>

                                &nbsp;&nbsp;

                                    <button className={`btn btn-sm btn-${values.active ? "default" : "danger"}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        FormUtils.OnChangeListener({ values, value: false });
                                        props.setFieldValue(values.active, false);
                                    }
                                    }>False</button>
                            </div>
                        )}
                    />

                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Reusable</label>
                    <Field
                        name={values.reusable}
                        render={({ field /* _form */ }) => (
                            <div className="button-group">
                                <button className={`btn btn-sm btn-${values.reusable ? `success` : `default`}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        FormUtils.OnChangeListener({ values, value: true });
                                        props.setFieldValue(values.reusable, true);
                                    }
                                    }>True</button>

                                &nbsp;&nbsp;

                                    <button className={`btn btn-sm btn-${values.reusable ? "default" : "danger"}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        FormUtils.OnChangeListener({ values, value: false });
                                        props.setFieldValue(values.reusable, false);
                                    }
                                    }>False</button>
                            </div>
                        )}
                    />

                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Cashback</label>
                    <Field
                        name={values.cashback}
                        render={({ field /* _form */ }) => (
                            <div className="button-group">
                                <button className={`btn btn-sm btn-${values.cashback ? `success` : `default`}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        FormUtils.OnChangeListener({ values, value: true });
                                        props.setFieldValue(values.cashback, true);
                                    }
                                    }>True</button>

                                &nbsp;&nbsp;

                                    <button className={`btn btn-sm btn-${values.cashback ? "default" : "danger"}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        FormUtils.OnChangeListener({ values, value: false });
                                        props.setFieldValue(values.cashback, false);
                                    }
                                    }>False</button>
                            </div>
                        )}
                    />

                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Peak Applicable</label>
                    <Field
                        name={values.peak_applicable}
                        render={({ field /* _form */ }) => (
                            <div className="button-group">
                                <button className={`btn btn-sm btn-${values.peak_applicable ? `success` : `default`}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        FormUtils.OnChangeListener({ values, value: true });
                                        props.setFieldValue(values.peak_applicable, true);
                                    }
                                    }>True</button>

                                &nbsp;&nbsp;

                                    <button className={`btn btn-sm btn-${values.peak_applicable ? "default" : "danger"}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        FormUtils.OnChangeListener({ values, value: false });
                                        props.setFieldValue(values.peak_applicable, false);
                                    }
                                    }>False</button>
                            </div>
                        )}
                    />

                </div>
                <div className="form-group col-6">
                    <label>Coupon Type</label>
                    <Field
                        name='object_name'
                        render={() => (
                            <SelectBox valueKey="name" field="name" onChange={(selected) => { setFieldValue('object_name', selected.value) }} value={values.object_name} options={props.couponList} />
                        )}
                    />
                </div>
                <div className="form-group col-6">
                    <label className="control-label val-span">Parameter</label>
                    <textarea name="Param" type="text" className="form-control form-box requiredField" placeholder="Parameter" required></textarea>
                </div>
                <div className="form-group col-6">
                    <label className="control-label val-span">Validation</label>
                    <textarea name="Param" type="text" className="form-control form-box requiredField" placeholder="Validation"></textarea>
                </div>
            </div>
            <div className="modal-footer">
                <div className="modal-actions row justify-content-end">

                    {/* <button className="btn btn-warning" onClick={handleReset}>
                        Reset
                    </button> */}

                    {/* <button className="btn btn-primary">
                        Cancel
                    </button> */}

                    <button className="btn btn-success" disabled={isSubmitting} type="submit">
                        Submit
                    </button>
                </div>
            </div>
        </Form>
    )
}



// Wrap our form with the using withFormik HoC
const CampaignForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => {

        const { campaignData } = props;

        return {
            object_name: campaignData.object_name ? campaignData.object_name : '',
            cashback: campaignData.cashback ? campaignData.cashback : '',
            pickup_time: campaignData.pickup_time ? campaignData.pickup_time : '',
            drop_time: campaignData.drop_time ? campaignData.drop_time : '',
            start_time: campaignData.start_time ? campaignData.start_time : '',
            end_time: campaignData.end_time ? campaignData.end_time : ''
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
            url: 'campaign',
            body: {
                cashback: values.cashback,
                object_name: values.object_name,
                pickup_time: values.pickup_time,
                drop_time: values.drop_time,
                start_time: values.start_time,
                end_time: values.end_time
            }
        });


        props.onSubmit();
    },
})(InnerForm);


export default class AddEditCampaign extends Component {
    constructor(props) {
        super(props);

        this.state = {
            campaignData: this.props.data,
            couponList: []
        }
    }

    componentDidMount() {
        this.getLookups();
    }

    getLookups = async () => {
        const result = await GetLookupValues(60);
        if (result.success) {
            const couponList = result.response;
            this.setState({ couponList })
        }

    }

    onSubmit = () => {
        ToastNotifications.success({ title: "Campaign added successfully!" });
        ModalManager.closeModal();
    }

    render() {
        const { campaignData, couponList } = this.state;
        console.log(campaignData);
        return (
            <ModalBody>
                <div>

                    {
                        couponList &&
                        <CampaignForm onSubmit={this.onSubmit} campaignData={campaignData} couponList={couponList} />
                    }
                </div>
            </ModalBody>
        )
    }
}