import React, { Component } from 'react';
import './queryDashboardForm.css';

import {
    Card, CardBody, Button
} from 'reactstrap';

import { withFormik, Field, Form } from 'formik';
import Yup from 'yup';

import DateTimePicker from './../../../Components/Date-Time-Picker/dateTimePicker.component';
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
        594: <DateTimePicker />
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
            <div className="form-row">
                <div className="picker">
                    {
                        payload.map((preference, key) => {

                            let elem, column;

                            if (preference) {
                                column = preference;
                                elem = inputElement(preference.param_type_id);
                            }
                            if (column) {
                                return (
                                    <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
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

export default class QueryDashboardForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payload: this.props.payload
        }
    }

    render() {

        const { payload } = this.state;
        console.log(payload);
        return (

            <div className="form-creator">
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








// import React, { Component } from 'react';
// import './queryForm.component.css';

// import DateTimePicker from './../../../Date-Time-Picker/dateTimePicker.component'

// export default class QueryForm extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             formData: props.formData
//         }

//     }

//     formElements = (data_type) => {
//         const element = {
//             107:<div className="data-point"> <label className="form-label"/> Number <input type="text" className="form-control" id="search-operation" placeholder='Number' /> </div>,
//             // 108:<div className="data-point"> <label className="form-label"/> String <input type="text" className="form-control" id="search-operation" placeholder='String' /> </div>,
//             109:<div className="data-point"> <label className="form-label"/> Date <input type="text" className="form-control" id="search-operation" placeholder='Date' /> </div>,
//             110:<div className="data-point"> <label className="form-label"/> Date Range <input type="text" className="form-control" id="search-operation" placeholder='Date Range' /> </div>,
//             111:<div className="data-point"> <label className="form-label"/> Boolean <input type="text" className="form-control" id="search-operation" placeholder='Boolean' /> </div>,
//             116:<div className="data-point"> <label className="form-label"/> Dropdown <input type="text" className="form-control" id="search-operation" placeholder='Dropdown' /> </div>,
//             117:<div className="data-point"> <label className="form-label"/> Reference <input type="text" className="form-control" id="search-operation" placeholder='Reference' /> </div>,
//             594:<div className="data-point"> <label className="form-label"/> DateTime <DateTimePicker  /></div>
//         }


//         return element[data_type.data_type_type_id] || element[108];
//     }




//     render() {

//         const { formData } = this.state;

//         console.log(formData);

//         return (
//             <div className="form-group">
//                 {
//                     formData.map((data, key) => this.formElements(data.param_type_id))
//                 }
//             </div>
//         )
//     }
// }