// Higher Order Component
import React, { Component } from 'react';
import { ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';

import { ModalBody } from 'reactstrap';
import { withFormik, Field, Form } from 'formik';
import { Put } from 'common-js-util';

import SelectBox from './../Forms/Components/Select-Box/selectBox';
import { GetLookupValues } from './../../Utils/lookup.utils';
import DatePicker from './../Forms/Components/Date-Picker/datePicker';
import GenerateParameter from './Generate-Parameter/generateParameter.component';
import CouponBenefits from './Coupon-Benefits/couponBenifits.component';

var boolArray = [{value: true, label: 'Yes'},{value: false, label: 'No'}];

var temp = [{ name:"Coupon3HourOffCampaign", id:'12', value:"Coupon3HourOffCampaign"},{ name:"Coupon3HourOffCampaign", id:'12', value:"Coupon3HourOffCampaign"}]

// Our inner form component which receives our form's state and updater methods as props
const InnerForm = props => {
    const {
        values,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        handleChange,
        formContent,
        couponList,
        openCouponBenefitsModal,
        openGenerateParameterModal
    } = props;

    return (

        <Form role="form" name="genericForm" >
            <div className="form-row">
                <div className="form-group col-6">
                    <label>Campaign Name</label>
                    <input value={formContent.name} name="Camp" type="text" className="form-control form-box requiredField" placeholder="Name" required />
                </div>
                <div className="form-group col-6">
                    <label className="control-label val-span">Description</label>
                    <textarea value={formContent.description} name="Description" type="text" className="form-control form-box requredField" placeholder="Description" required></textarea>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">Pickup Time</label>
                    <div className="date-field">
                        <DatePicker single={true} placeholder={`Enter Pickup Time`} timePicker={true} name="Pickup time" onChange={handleChange} value={formContent.pickup_time} />
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">Drop Time</label>
                    <div className="date-field">
                        <DatePicker single={true} placeholder={`Enter Drop Time`} timePicker={true} name="Drop time" onChange={handleChange} value={formContent.drop_time} />
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">Start Time</label>
                    <div className="date-field">
                        <DatePicker single={true} placeholder={`Enter Pickup Time`} timePicker={true} name="Pickup time" onChange={handleChange} value={formContent.start_time} />
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">End Time</label>
                    <div className="date-field">
                        <DatePicker single={true} placeholder={`Enter Drop Time`} timePicker={true} name="Drop time" onChange={handleChange} value={formContent.end_time} />
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Active</label>
                    <Field
                        name='active'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" field="label" name='active' placeholder={'active'} onChange={(selected) => { setFieldValue('active', selected ? selected.value : null) }} value={values.gender} options={boolArray} />
                        )}
                    />
                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Reusable</label>
                    <Field
                        name='reusable'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" field="label" name='reusable' placeholder={'reusable'} onChange={(selected) => { setFieldValue('reusable', selected ? selected.value : null) }} value={values.gender} options={boolArray} />
                        )}
                    />
                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Cashback</label>
                    <Field
                        name='cashback'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" field="label" name='cashback' placeholder={'cashback'} onChange={(selected) => { setFieldValue('cashback', selected ? selected.value : null) }} value={values.gender} options={boolArray} />
                        )}
                    />

                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Peak Applicable</label>
                    <Field
                        name='peak_applicable'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" field="label" name='peak_applicable' placeholder={'peak_applicable'} onChange={(selected) => { setFieldValue('peak_applicable', selected ? selected.value : null) }} value={values.gender} options={boolArray} />
                        )}
                    />

                </div>
                <div className="form-group col-6">
                    <label>Coupon Type</label>
                    <Field
                        name='coupon_type'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" label="name" field="label" name='coupon_type' placeholder={'coupon_type'} onChange={(selected) => { setFieldValue('coupon_type', selected ? selected.value : null) }} value={values.gender} options={temp} />
                        )}
                    />
                </div>
                <div className="form-group col-6">
                    <label className="control-label val-span">Parameter
                        {
                            
                            <i className="fa fa-plus" onClick={()=> openGenerateParameterModal()} ></i>
                        }
                    </label>
                    <textarea name="Param" type="text" className="form-control form-box requiredField" placeholder="Parameter" required></textarea>
                </div>
                <div className="form-group col-6">
                    <label className="control-label val-span">Validation <i className="fa fa-plus" onClick={()=> openCouponBenefitsModal()}></i> </label>
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

        const { campaignData, formContent } = props;

        return {
            formContent
            // object_name: campaignData.object_name ? campaignData.object_name : '',
            // cashback: campaignData.cashback ? campaignData.cashback : '',
            // pickup_time: campaignData.pickup_time ? campaignData.pickup_time : '',
            // drop_time: campaignData.drop_time ? campaignData.drop_time : '',
            // start_time: campaignData.start_time ? campaignData.start_time : '',
            // end_time: campaignData.end_time ? campaignData.end_time : ''
        }

    },
   
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
            couponList: [],
            formContent: JSON.parse(JSON.stringify(this.props.data))
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

    openGenerateParameterModal = () => {
        ModalManager.openModal({
            headerText: "Generate Parameter",
            modalBody: () => (<GenerateParameter />)
        })
    }
    openCouponBenefitsModal = () => {
        ModalManager.openModal({
            headerText: "Coupon Benefits",
            modalBody: () => (<CouponBenefits />)
        })
    }

    onSubmit = () => {
        ToastNotifications.success({ title: "Campaign added successfully!" });
        ModalManager.closeModal();
    }

    render() {
        const { campaignData, couponList, formContent } = this.state;
        return (
            <ModalBody>
                <div>
                    {
                        couponList &&
                        <CampaignForm onSubmit={this.onSubmit} formContent={formContent} openGenerateParameterModal={this.openGenerateParameterModal} openCouponBenefitsModal={this.openCouponBenefitsModal} campaignData={campaignData} couponList={couponList} />
                    }
                </div>
            </ModalBody>
        )
    }
}