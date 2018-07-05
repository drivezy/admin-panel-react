import React, { Component } from 'react';
// import './formCreator.css';

import {
    Card, CardBody, Button
} from 'reactstrap';

import { withFormik, Field, Form } from 'formik';
import Yup from 'yup';

import { Upload, Post, Put, Get } from './../../../../Utils/http.utils';
import { GetChangedMethods } from './../../../../Utils/generic.utils';
import { IsObjectHaveKeys, IsUndefined } from './../../../../Utils/common.utils';

//  import SelectBox from './../Forms/Components/Select-Box/selectBox';

import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import ReferenceInput from './../../../Forms/Components/Reference-Input/referenceInput';
import DatePicker from './../../../Forms/Components/Date-Picker/datePicker';
import TimePicker from './../../../Forms/Components/Time-Picker/timePicker';
import ListSelect from './../../../Forms/Components/List-Select/listSelect';
import Switch from './../../../Forms/Components/Switch/switch';
import ModalManager from './../../../../Wrappers/Modal-Wrapper/modalManager';

import { SubscribeToEvent } from './../../../../Utils/stateManager.utils';
import FormUtils from './../../../../Utils/form.utils';
import { GetUrlForFormSubmit } from './../../../../Utils/generic.utils';
import { ROUTE_URL } from './../../../../Constants/global.constants';
// /Users/mangeshlokhande/Projects/AdminReact/src/Components/Form-Creator/formCreator.component.js
// /Users/mangeshlokhande/Projects/AdminReact/src/Components/Manage-Report/Components/Query-Form/queryForm.component.js



const DisplayFormikState = props => (
    <div style={{ margin: '1rem 0' }}>
        <h3 style={{ fontFamily: 'monospace' }} />
        <pre
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}>
            <strong>props</strong> ={' '}
            {JSON.stringify(props, null, 2)}
        </pre>
    </div>
);

const inputElement = ({ props, values, column, shouldColumnSplited, key }) => {

    const elements = {

        // Number
        107: <Field autoComplete="off" className="form-control" type="number" name={column.name} placeholder={`Enter ${column.display_name}`} />,
        // Number Ends

        // String
        108: <Field autoComplete="off" className="form-control" type="string" name={column.name} placeholder={`Enter ${column.display_name}`} />,
        // String Ends

        // DatePicker
        109: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <DatePicker single={true} name={column.name} onChange={props.setFieldValue} value={values[column.name]} />
            )}
        />,
        // DatePicker Ends

        // Single DatePicker with Timepicker 
        110: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <DatePicker single={true} timePicker={true} name={column.name} onChange={props.setFieldValue} value={values[column.name]} />
            )}
        />,
        // Single Datepicker Ends

        // Single DatePicker with Timepicker 
        594: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <DatePicker single={true} timePicker={true} name={column.name} onChange={props.setFieldValue} value={values[column.name]} />
            )}
        />,
        // Single Datepicker Ends

        // Boolean Select
        111: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <SelectBox name={column.name} onChange={props.setFieldValue} value={values[column.name]} field="name" options={[{ name: "True", id: 1 }, { name: "False", id: 0 }]} />
            )}
        />,
        // Boolean Ends

        // // TextArea Begins
        // 160: <Field
        //     name={column.name}
        //     render={({ field /* _form */ }) => (
        //         <textarea name={column.name} className="form-control" rows="3" onChange={({ ...args }) => { FormUtils.OnChangeListener(args); props.handleChange(args); }} value={values[column.name]}></textarea>
        //     )}
        // />,
        // // TextArea Ends

        // Switch Begins
        119: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <Switch name={column.name} rows="3" onChange={props.setFieldValue} value={values[column.name]} />
            )}
        />,
        // Switch Ends



        // List Select with options from api
        7: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <ListSelect column={column} name={column.name} onChange={props.setFieldValue} model={values[column.name]} />
            )}
        />,
        // List Select Ends

        // List Multi Select
        465: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <ListSelect multi={true} column={column} name={column.name} onChange={props.setFieldValue} model={values[column.name]} />
            )}
        />,
        // List Ends


        // Time Picker
        746: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <TimePicker name={column.name} onChange={props.setFieldValue} value={values[column.name]} />
            )}
        />,
        // Time Picker Ends

    }

    return elements[column.column_type_id] || elements[108];
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

    // removeImage = (image) => {
    //     console.log(image);
    // }

    const column_definition = IsObjectHaveKeys(payload.layout) ? payload.layout.column_definition : [];
    return (
        <Form role="form" name="genericForm" >
            <div className="form-row">
                {
                    column_definition.map((preference, key) => {

                        let elem, column;

                        if (typeof preference != 'string') {
                            column = payload.dictionary[preference.index];

                            elem = inputElement({ props, values, column, shouldColumnSplited, key });

                        } else if (typeof preference == 'string') {
                            shouldColumnSplited = preference.includes('s-split-') ? true : preference.includes('e-split-') ? false : shouldColumnSplited;
                        }
                        if (column && (IsUndefined(column.visibility) || column.visibility)) {
                            return (
                                <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
                                    <label htmlFor="exampleInputEmail1">{column.label || column.display_name}</label>
                                    {elem}

                                    {/* Showing Errors when there are errors */}
                                    {
                                        errors[column.column_name] && touched[column.column_name] ?
                                            <small id="emailHelp" className="form-text text-danger">
                                                {errors[column.column_name]}
                                            </small>
                                            :
                                            null
                                    }

                                    {/* Errors Ends */}
                                </div>
                            )
                        }
                    })
                }
            </div>

            {/* Uploaded file thumbnails */}
            {/* <div className="file-uploads">
                {
                    props.fileUploads.map((file, index) => (
                        <ImageThumbnail file={file} key={index} index={index} removeImage={props.removeImage} />
                    ))
                }
            </div> */}
            {/* Uploaded file thumbnails Ends*/}

            <div className="modal-actions row justify-content-end">
                <Button color="secondary" onClick={handleReset}>
                    Clear
                </Button>

                <button className="btn btn-primary" type="submit">
                    Submit
                </button>
            </div>
        </Form>
    );
}


const FormContents = withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => {

        const { payload } = props;

        let response = {}

        const column_definition = IsObjectHaveKeys(payload.layout) ? payload.layout.column_definition : [];
        column_definition.forEach(async (preference) => {
            if (typeof preference != 'string') {
                let column = payload.dictionary[preference.index];
                response[column.name] = payload.data[column.name] || '';

                // if (column.reference_model) {
                //     const url = column.reference_model.route_name;
                //     const result = await Get({ url: url + '?query=id=' + payload.data[column.name], urlPrefix: ROUTE_URL  });
                //     console.log(result);
                //     response[column.name] = result;
                // }
            }
        });

        return response;
    },
    // validationSchema: Yup.object().shape({
    //     email: Yup.string()
    //         .email('Invalid email address')
    //         .required('Email is required!'),
    // }),

    validationSchema: (props, values) => {

        let da = {}

        let fields = Object.keys(props.payload.dictionary);

        const { dictionary } = props.payload;

        fields.forEach((column) => {
            if (dictionary[column].mandatory) {
                da[dictionary[column].column_name] = Yup.string().required(dictionary[column].display_name + ' is required.');
            }
        });

        return Yup.object().shape(da);

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
    },

    handleReset: (values) => {
    },

    handleSubmit: async (values, { props, setSubmitting }) => {

        const { payload } = props;

        // Check this code shubham , 
        // Modifying the data according to backend requiremend 

        let newValues = {};
        let keys = Object.keys(values);
        keys.forEach((key) => {
            const value = values[key];

            newValues[key] = value && typeof value == 'object' ? value.id : value;
            // newValues[payload.dataModel + '.' + key] = values[key];
        })


        if (props.fileUploads.length) {
            uploadImages(props).then((result) => {
                console.log(result)
                submitGenericForm();
            });
        } else {
            submitGenericForm();
        }


        async function submitGenericForm() {
            const url = GetUrlForFormSubmit({ payload });
            const Method = payload.method == 'edit' ? Put : Post;

            const originalValues = FormUtils.getOriginalData();
            const body = GetChangedMethods(newValues, originalValues);
            const result = await Method({ url, body, urlPrefix: ROUTE_URL });
            if (result.success) {
                props.onSubmit();
            }
        }

        function uploadImages() {
            return Promise.all(props.fileUploads.map((entry) => {
                return Upload('uploadFile', entry).then((result) => {

                    values[entry.column] = result.response;

                    return result;

                }, (error) => {
                    console.log(error);
                    return error;
                }, (progress) => {
                    console.log(progress);
                    return progress;
                })
            }))

            // return Promise.all(props.fileUploads.map(entry=> Upload('uploadFile', entry)))
        }
    },
    displayName: 'BasicForm', // helps with React DevTools
})(formElements);

export default class QueryForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            payload: this.props.payload
        }

        this.formUpdated.bind(this);
        SubscribeToEvent({ eventName: 'formChanged', callback: this.formUpdated });
    }

    async componentDidMount() {
        const { payload = {} } = this.props;
        const { layout, module } = payload;

    }

    formUpdated = (form) => {
        setTimeout(() => {
            const { updateState } = form;
            if (updateState) {
                this.setState({ form });
            } else {
                this.state.form = form;
            }
        }, 1000);
    }

    render() {
        const { payload } = this.state;
        return (
            <div className="form-creator">
                <Card>
                    {
                        payload.layout ?
                            <CardBody>
                                <FormContents onSubmit={this.formSubmitted.bind(this)} payload={payload} />
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