import React, { Component } from 'react';
import './dashboardForm.css';

import {
    Card, CardBody, Button
} from 'reactstrap';

import { withFormik, Field, Form } from 'formik';
import Yup from 'yup';

import DateTimePicker from './../../../Components/Date-Time-Picker/dateTimePicker.component';

import SelectBox from './../../../Components/Forms/Components/Select-Box/selectBox';

// import { Upload, Post, Put, Get } from './../../../../Utils/http.utils';
// import { GetChangedMethods } from './../../../../Utils/generic.utils';
// import { IsObjectHaveKeys, IsUndefined } from './../../../../Utils/common.utils';

//  import SelectBox from './../Forms/Components/Select-Box/selectBox';

// import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
// import ReferenceInput from './../../../Forms/Components/Reference-Input/referenceInput';
// import DatePicker from './../../../Forms/Components/Date-Picker/datePicker';
// import DateTimePicker from './../../../Date-Time-Picker/dateTimePicker.component'
// import TimePicker from './../../../Forms/Components/Time-Picker/timePicker';
// import ListSelect from './../../../Forms/Components/List-Select/listSelect';
// import Switch from './../../../Forms/Components/Switch/switch';
// import ModalManager from './../../../../Wrappers/Modal-Wrapper/modalManager';

// import { SubscribeToEvent } from './../../../../Utils/stateManager.utils';
// import FormUtils from './../../../../Utils/form.utils';
// import { GetUrlForFormSubmit } from './../../../../Utils/generic.utils';
// import { ROUTE_URL } from './../../../../Constants/global.constants';
// /Users/mangeshlokhande/Projects/AdminReact/src/Components/Form-Creator/formCreator.component.js
// /Users/mangeshlokhande/Projects/AdminReact/src/Components/Manage-Report/Components/Query-Form/queryForm.component.js



// const DisplayFormikState = props => (
//     <div style={{ margin: '1rem 0' }}>
//         <h3 style={{ fontFamily: 'monospace' }} />
//         <pre
//             style={{
//                 background: '#f6f8fa',
//                 fontSize: '.65rem',
//                 padding: '.5rem',
//             }}>
//             <strong>props</strong> ={' '}
//             {JSON.stringify(props, null, 2)}
//         </pre>
//     </div>
// );

// const inputElement = ({ props, values, column, shouldColumnSplited, key }) => {

const inputElement = (payload) => {

    const elements = {

        // String
        // 108: <Field autoComplete="off" className="form-control" type="string" name={column.name} placeholder={`Enter ${column.display_name}`} />,
        // String Ends

        // Single DatePicker with Timepicker 
        594: <DateTimePicker />,
        // Single DatePicker with Timepicker ends

        // Single DatePicker with Timepicker 
        109: <DateTimePicker />
        // Single DatePicker with Timepicker ends

    }

    return elements[payload] || elements[108]; //uncomment this if required
}

const formElements = props => {

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

    const { payload } = props;

    let shouldColumnSplited = false;

    return (
        <Form role="form" name="genericForm" >
            <div className="form-elements">


                {/* Parameters repeated to form the fields  */}
                <div className="picker">
                    {
                        payload.fields.map((preference, key) => {

                            let elem, column;

                            if (preference) {
                                column = preference;
                                elem = inputElement(preference.param_type_id);
                            }
                            if (column) {
                                return (
                                    <div key={key} className={`form-group`}>
                                        <label>{column.label || column.display_name}</label>

                                        {elem}

                                        {/* Showing Errors when there are errors */}
                                        {/* {
                                            errors[column.column_name] && touched[column.column_name] ?
                                                <small id="emailHelp" className="form-text text-danger">
                                                    {errors[column.column_name]}
                                                </small>
                                                :
                                                null
                                        } */}

                                        {/* Errors Ends */}
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                {/* Parameters repeated end  */}

                {/* Group Column */}

                <div className="select-elements">
                    <div className="form-element">
                        <div className="form-label">
                            <label>
                                Group Column
                           </label>

                        </div>
                        <SelectBox multi="true" options={props.payload.columns} field="display_name" onChange={(value) => { props.handleChange }} />
                    </div>

                    <div className="form-element">
                        <div className="form-label">
                            <label>
                                Aggregations
                           </label>
                        </div>
                        <div className="select-container">
                            <div className="element-container">
                                <SelectBox />
                            </div>
                            <div className="element-container">
                                <SelectBox options={props.payload.columns} field="display_name" onChange={(value) => { props.handleChange }} />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Group Column Ends */}

                {/* Aggregation */}

                {/* Aggregation Ends */}

                <div className="modal-actions">
                    <Button className="btn btn-primary btn-sm" onClick={handleReset}>
                        Clear
                    </Button>

                    <Button className="btn btn-success btn-sm" onSubmit={handleSubmit} type="submit">
                        Submit
                    </Button>
                </div>
            </div>
        </Form>
    );
}


const FormContents = withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => {

        const { payload } = props;


    },
    displayName: 'BasicForm', // helps with React DevTools
})(formElements);

export default class DashboardForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            payload: {
                queryData: this.props.queryParamsData,
                columns: this.props.columns || [],
                fields: this.props.fields || []
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            payload: {
                queryData: this.props.queryParamsData,
                columns: this.props.columns || [],
                fields: this.props.fields || []
            }
        });

    }


    render() {

        const { payload } = this.state;

        return (
            <div className="dashboard-form">
                <Card>
                    {
                        payload ?
                            <CardBody>
                                <FormContents payload={payload} />
                            </CardBody>
                            :
                            null
                    }
                </Card>
            </div>
        )
    }
}
