// Higher Order Component
import React, { Component } from 'react';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';

import { ModalBody } from 'reactstrap';
import { withFormik, Field } from 'formik';
import { Put } from 'common-js-util';

import SelectBox from './../Forms/Components/Select-Box/selectBox';
import { GetLookupValues } from './../../Utils/lookup.utils';

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
            <div className="modal-body">
                <div className="panel panel-info">
                    <div className="panel-body">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label className="control-label val-span">Campaign Name</label>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-strikethrough"></i>
                                        </span>
                                        <input name="Camp" type="text" className="form-control form-box requiredField" placeholder="Name" required />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label className="control-label val-span">Description</label>
                                    <textarea name="Description" type="text" className="form-control form-box requredField" placeholder="Description" required></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label className="control-label">Pick Up and Drop Time</label>
                                    <div className="input-group date-field">
                                        <span className="input-group-addon">
                                            <i className="fa fa-calendar"></i>
                                        </span>
                                        <div>
                                            <daterange-picker required="true" placeholder="Select Range" ></daterange-picker>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <label className="control-label">Start and End Time</label>
                                    <div className="input-group date-field">
                                        <span className="input-group-addon">
                                            <i className="fa fa-calendar"></i>
                                        </span>
                                        <div>
                                            <daterange-picker required="true" placeholder="Select Range" ></daterange-picker>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div className="form-group">
                                        <label className="label-color val-span">Active</label>
                                        <div className="input-group select-input-form">
                                            <span className="input-group-addon">
                                                <i className="fa fa-toggle-off"></i>
                                            </span>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div className="form-group">
                                        <label className="label-color val-span">Reusable</label>
                                        <div className="input-group select-input-form">
                                            <span className="input-group-addon">
                                                <i className="fa fa-toggle-off"></i>
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div className="form-group">
                                        <label className="label-color val-span">Cashback</label>
                                        <div className="input-group select-input-form">
                                            <span className="input-group-addon">
                                                <i className="fa fa-toggle-off"></i>
                                            </span>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div className="form-group">
                                        <label className="label-color val-span">Peak Applicable</label>
                                        <div className="input-group select-input-form">
                                            <span className="input-group-addon">
                                                <i className="fa fa-toggle-off"></i>
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            </div >
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div className="form-group border-select-filter">
                                        <label className="control-label val-span">Coupon Type</label>
                                        <div className="input-group select-input-form">
                                            <span className="input-group-addon">
                                                <i className="fa fa-chevron-down"></i>
                                            </span>
                                            <Field
                                                name='object_name'
                                                render={() => (
                                                    <SelectBox valueKey="name" field="name" onChange={(selected) => { setFieldValue('object_name', selected.value) }} value={values.object_name} options={props.couponList} />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div className="form-group">
                                        <label className="control-label val-span">Parameter&nbsp;
                                    {/* <a ng-show="addCampaignRecord.couponTypeObj.selected.value=='CouponGeneric'" ng-click="addCampaignRecord.generateParameter()"
                                                style="color:red">
                                                <span className="glyphicon glyphicon-plus"></span>
                                            </a>
                                            <a ng-show="addCampaignRecord.couponTypeObj.selected.value=='CouponAll'" ng-click="addCampaignRecord.couponBenefits()" style="color:red">
                                                <span className="glyphicon glyphicon-plus"></span>
                                            </a> */}
                                        </label>
                                        <textarea name="Param" type="text" className="form-control form-box requiredField" placeholder="Parameter" required></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" ng-show="addCampaignRecord.couponTypeObj.selected.value=='CouponAll'">
                                    <div className="form-group">
                                        <label className="control-label val-span">Validation&nbsp;
                                    {/* <a ng-show="addCampaignRecord.couponTypeObj.selected.value=='CouponAll'" ng-click="addCampaignRecord.generateGenericParameter()"
                                                style="color:red">
                                                <span className="glyphicon glyphicon-plus"></span>
                                            </a> */}
                                        </label>
                                        <textarea name="Param" type="text" className="form-control form-box requiredField" placeholder="Validation"></textarea>
                                    </div>
                                </div>

                            </div>
                        </div >
                    </div >
                </div >
            </div >
            <div className="modal-footer ">
                <div className="col-md-6 text-left">
                    <small>
                        Create New Campaign.
                    </small>
                </div>
                <div className="col-md-6">
                    <button className="btn btn-default" ng-click="addCampaignRecord.close()">Cancel</button>
                    <button className="btn btn-success" ng-disabled="campaignForm.$invalid" ng-click="addCampaignRecord.addCamp()">
                        Submit
                    </button>
                </div>
            </div>







            {/* <div className="form-group">
                <label>Coupon Type</label>
                <Field
                    name='object_name'
                    render={() => (
                        <SelectBox valueKey="name" field="name" onChange={(selected) => { setFieldValue('object_name', selected.value) }} value={values.object_name} options={props.couponList} />
                    )}
                />
            </div>
            <div className="form-group">
                <div className="margin-top-5" id="buttonWidth">
                    <button className="btn btn-primary pull-right button-blue" type="submit" disabled={isSubmitting}>
                        Save Changes
                    </button>
                </div>
            </div> */}
        </form >
    )
}



// Wrap our form with the using withFormik HoC
const CampaignForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => {

        const { campaignData } = props;

        return {
            object_name: campaignData.object_name ? campaignData.object_name : ''
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