import React, { Component } from 'react';

import './formElements.css';

import { Card, CardBody } from 'reactstrap';
import { withFormik, Field } from 'formik';


import EditableLabel from './../Editable-Label/editableLable.component';
import SelectBox from './../../../Forms/Components/Select-Box/selectBox';



// Our inner form component which receives our form's state and updater methods as props
const ElementFormContent = props => {
    const {
        values,
        handleSubmit,
        isSubmitting,
        setFieldValue
    } = props;

    return (
        <form onSubmit={handleSubmit}>

            <div className="element-detail">
                <div className="element-label">
                    <label>Column Name</label>

                    <Field className={`form-control`} type="text" name="label" placeholder={`Enter Label`} />
                </div>
                <div className="element-type">
                    <label>Type</label>
                    <Field
                        name='type'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="value" field="name" onChange={(selected) => { setFieldValue('type', selected.value) }} value={values.rejection_reason} options={props.inputSubTypes} />
                        )}
                    />
                </div>
            </div>


            <div className="element-detail">
                <div className="element-label">
                </div>
                <div className="element-type">
                </div>
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
const ElementForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => {

        const { inputSubTypes } = props;

        return {}

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
        // const result = await Put({
        //     url: 'userLicense/' + props.rejectdData.licenseIndex,
        //     body: {
        //         approved: values.approved,
        //         rejection_reason: values.rejection_reason
        //     }
        // });


        // props.onSubmit();
    },
})(ElementFormContent);


export default class FormElements extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formOutput: props.formOutput,
            fields: props.fields,
            inputSubTypes: props.inputSubTypes,
            type: ''
        };
    }


    render() {
        const { formOutput, fields, inputSubTypes, type } = this.state;

        return (
            <Card className="elements-wrapper">
                <CardBody className="element-contents">

                    <ElementForm types={inputSubTypes} />







                </CardBody>
            </Card>
        )
    }
}