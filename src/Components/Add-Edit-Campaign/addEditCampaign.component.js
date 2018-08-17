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
import GenerateGenericParameter from './Generate-Generic-Parameter/GenerateGenericParameter.component';

var boolArray = [{ value: true, label: 'Yes' }, { value: false, label: 'No' }];

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
        openGenerateParameterModal,
        openGenerateGenericParameterModal,
        couponChange,
        couponType
    } = props;

    return (

        <Form role="form" name="genericForm" >
            <div className="form-row">
                <div className="form-group col-6">
                    <label>Campaign Name</label>
                    <input value={values.name} name="Campaign" type="text" onChange={handleChange} className="form-control form-box requiredField" placeholder="Name" required />
                </div>
                <div className="form-group col-6">
                    <label className="control-label val-span">Description</label>
                    <textarea value={values.description} name="Description" type="text" onChange={handleChange} className="form-control form-box requredField" placeholder="Description" required></textarea>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">Pickup Time</label>
                    <div className="date-field">
                        <DatePicker single={true} placeholder={`Enter Pickup Time`} timePicker={true} name="Pickup time" onChange={handleChange} value={values.pickup_time}/>
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">Drop Time</label>
                    <div className="date-field">
                        <DatePicker single={true} placeholder={`Enter Drop Time`} timePicker={true} name="Drop time" onChange={handleChange} value={values.drop_time}/>
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">Start Time</label>
                    <div className="date-field">
                        <DatePicker single={true} placeholder={`Enter Pickup Time`} timePicker={true} name="Pickup time" onChange={handleChange} value={values.start_time}/>
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="control-label">End Time</label>
                    <div className="date-field">
                        <DatePicker single={true} placeholder={`Enter Drop Time`} timePicker={true} name="Drop time" onChange={handleChange} value={values.end_time}/>
                    </div>
                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Active</label>
                    <Field
                        name='active'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" field="label" name='active' placeholder={'active'} onChange={(selected) => { setFieldValue('active', selected ? selected.value : null) }} value={values.active} options={boolArray} />
                        )}
                    />
                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Reusable</label>
                    <Field
                        name='reusable'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" field="label" name='reusable' placeholder={'reusable'} onChange={(selected) => { setFieldValue('reusable', selected ? selected.value : null) }} value={values.reusable} options={boolArray} />
                        )}
                    />
                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Cashback</label>
                    <Field
                        name='cashback'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" field="label" name='cashback' placeholder={'cashback'} onChange={(selected) => { setFieldValue('cashback', selected ? selected.value : null) }} value={values.cashback} options={boolArray} />
                        )}
                    />

                </div>
                <div className="form-group col-6">
                    <label className="label-color val-span">Peak Applicable</label>
                    <Field
                        name='peak_applicable'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" field="label" name='peak_applicable' placeholder={'peak_applicable'}
                             onChange={(selected) => 
                                { setFieldValue('peak_applicable', selected ? selected.value : null) }} value={values.peak_applicable} options={boolArray} />
                        )}
                    />
                        {values.peak_applicable}
                </div>
                <div className="form-group col-6">
                    <label>Coupon Type</label>
                    <Field
                        name='coupon_type'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" label="name" field="label" name='coupon_type' placeholder={'coupon_type'}
                                onChange={(selected) => {
                                    couponChange(selected.value);
                                    setFieldValue('coupon_type', selected ? selected.value : null)
                                }}
                                value={formContent.coupon_type} options={couponList} />
                        )}
                    />
                    {formContent.coupon_type}
                </div>
                <div className="form-group col-6">
                    <label className="control-label val-span">Parameter
                        {
                            couponType == "CouponGeneric" &&
                            <i style={{color: '#FF5A5F', marginLeft: '5px'}} className="fa fa-plus" onClick={() => openGenerateParameterModal()} ></i>
                        }
                        {
                            couponType == "CouponAll" &&
                            <i style={{color: '#FF5A5F', marginLeft: '5px'}} className="fa fa-plus" onClick={() => openCouponBenefitsModal() } ></i>
                        }
                    </label>
                    <textarea name="Param" type="text" className="form-control form-box requiredField" placeholder="Parameter" value={formContent.parameters}></textarea>
                </div>

                {
                 couponType == "CouponAll" &&
                <div className="form-group col-6">
                    <label className="control-label val-span">Validation
                        <i style={{color: '#FF5A5F', marginLeft: '5px'}} className="fa fa-plus" onClick={() => openGenerateGenericParameterModal()}></i>
                    </label>
                    <textarea name="Param" type="text" value={formContent.validateData} className="form-control form-box requiredField" placeholder="Validation"></textarea>
                </div>
                }

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
        props.onSubmit(values);
    },
})(InnerForm);


export default class AddEditCampaign extends Component {
    constructor(props) {
        super(props);

        this.state = {
            campaignData: this.props.data,
            couponList: [],
            formContent: JSON.parse(JSON.stringify(this.props.data)),
            couponType: null,
            isNew: (this.props.data == {}) ? true : false
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
            modalBody: () => (<GenerateParameter setParameter={this.setParameter} />)
        })
    }
    openCouponBenefitsModal = () => {
        ModalManager.openModal({
            headerText: "Coupon Benefits",
            modalBody: () => (<CouponBenefits setParameter={this.setParameter} />)
        })
    }

    openGenerateGenericParameterModal = () => {
        ModalManager.openModal({
            headerText: "Generate Parameter",
            modalBody: () => (<GenerateGenericParameter setValidation={this.setValidation} />)
        })
    }

    setParameter = (value) => {
        let {formContent} = this.state;
        formContent.parameters = value;
        this.setState({formContent});
    }

    couponChange = (value) => {
        this.setState({ couponType: value })
    }

    setValidation = (value) => {
        let {formContent} = this.state;
        formContent.validateData = value;
        this.setState({formContent});
    }

    onSubmit = async () => {
            if(this.state.isNew){
                let url = "campaign";
                let formContent = {};
                // self.formContent.object_name = self.couponTypeObj.selected.value;
                // self.formContent.pickup_time = self.pick_drop_range.startDate;
                // self.formContent.drop_time = self.pick_drop_range.endDate;
                // self.formContent.start_time = self.start_end_range.startDate;
                // self.formContent.end_time = self.start_end_range.endDate;
                // self.formContent.cashback = parseInt(self.formContent.cashback)
                // ListingFactory.addRecord(url, self.formContent)
                //     .then(function(data) {
                //         if (data.data.success == true) {
                //             self.myform = false;
                //             swl.success("Campaign has been added!");
                //             $uibModalInstance.close();
                //             callBackFunction();
                //         } else {
                //             $uibModalInstance.close();
                //             callBackFunction();
                //         }
                //     });
                const result = await Post({ url: url, body: formContent })
                if (result.success) {
                    ToastNotifications.success({ title: "Campaign added successfully!" });
                    ModalManager.closeModal();
                }
            }else{
                let url = "campaign/" + this.state.campaignObj.id;
                const result = await Put({ url: url, body: formContent })
                if (result.success) {
                    ToastNotifications.success({ title: "Campaign edited successfully!" });
                    ModalManager.closeModal();
                }
            }
       
    }

    render() {
        const { campaignData, couponList, formContent } = this.state;
        return (
            <ModalBody>
                <div>
                    {
                        couponList &&
                        <CampaignForm onSubmit={this.onSubmit} formContent={formContent} openGenerateParameterModal={this.openGenerateParameterModal} openCouponBenefitsModal={this.openCouponBenefitsModal} openGenerateGenericParameterModal={this.openGenerateGenericParameterModal} campaignData={campaignData} couponList={couponList} couponType={this.state.couponType} couponChange={this.couponChange} />
                    }
                </div>
            </ModalBody>
        )
    }
}