import React, { Component } from 'react';
import './formCreator.css';

import {
    Card, CardBody, Button
} from 'reactstrap';


import { withFormik, Field, Form } from 'formik';
import Yup from 'yup';

import { Upload, Post, Put, Get } from './../../Utils/http.utils';
import { GetChangedMethods } from './../../Utils/generic.utils';
import { IsObjectHaveKeys, IsUndefined } from './../../Utils/common.utils';

//  import SelectBox from './../Forms/Components/Select-Box/selectBox';

import SelectBox from './../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import ReferenceInput from './../Forms/Components/Reference-Input/referenceInput';
import DatePicker from './../Forms/Components/Date-Picker/datePicker';
import TimePicker from './../Forms/Components/Time-Picker/timePicker';
import ListSelect from './../Forms/Components/List-Select/listSelect';
import Switch from './../Forms/Components/Switch/switch';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import ImageUpload from './../Forms/Components/Image-Upload/imageUpload.component';
// import ImageThumbnail from './../Forms/Components/Image-Thumbnail/imageThumbnail.component';
// import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';
import FormSettings from './../Form-Settings/FormSettings.component';
import ScriptInput from './../Forms/Components/Script-Input/scriptInput.component';

import { SubscribeToEvent } from './../../Utils/stateManager.utils';
import { ExecuteScript } from './../../Utils/injectScript.utils';

import FormUtils from './../../Utils/form.utils';
import { GetUrlForFormSubmit } from './../../Utils/generic.utils';

import { ROUTE_URL } from './../../Constants/global.constants';

import { SetItem } from './../../Utils/localStorage.utils';

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

        // Static Display 
        768: <h5>{values[column.name]}</h5>,
        // Static Ends

        // Number
        2: <Field autoComplete="off" className="form-control" type="number" name={column.name} placeholder={`Enter ${column.display_name}`} />,
        // Number Ends

        // 108: <Field disabled={column.disabled} id={column.name} onChange={({ ...args }) => FormUtils.OnChangeListener(args)} name={column.name} className={`form-control ${props.errors[column.index] && props.touched[column.index] ? 'is-invalid' : ''}`} type="text" placeholder={`Enter ${column.name}`} />,

        1: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <input name={column.name} className="form-control" rows="3"
                    placeholder={`Enter ${column.display_name}`}
                    onChange={(event, ...args) => {
                        FormUtils.OnChangeListener({ column, value: event.target.value, ...event });
                        props.handleChange(event, args);
                    }}
                    autoComplete="off"
                    value={values[column.name]}
                />
            )}
        />,
        // Text Ends

        // TextArea Begins
        160: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <textarea name={column.name} placeholder={`Enter ${column.display_name}`} className="form-control" rows="3" onChange={({ ...args }) => { FormUtils.OnChangeListener(args); props.handleChange(args); }} value={values[column.name]}></textarea>
            )}
        />,
        // TextArea Ends

        // Switch Begins
        119: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <Switch name={column.name} rows="3" placeholder={`Enter ${column.display_name}`} onChange={props.setFieldValue} value={values[column.name]} />
            )}
        />,
        // Switch Ends

        // Boolean Select
        5: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <SelectBox name={column.name}
                    placeholder={`Enter ${column.display_name}`}
                    onChange={(value, event) => {
                        FormUtils.OnChangeListener({ column, value, ...event });
                        props.setFieldValue(event, value);
                    }}
                    value={values[column.name].id}
                    field="name" options={[{ name: "True", id: 1 }, { name: "False", id: 0 }]} />
                // <SelectBox name={column.name} onChange={props.setFieldValue} value={values[column.name]} field="name" options={[{ name: "True", id: 1 }, { name: "False", id: 0 }]} />
            )}
        />,
        // Boolean Ends

        // Reference Begins
        6: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <ReferenceInput column={column} name={column.name}
                    placeholder={`Enter ${column.display_name}`}
                    // onChange={props.setFieldValue}
                    onChange={(value, event) => {
                        FormUtils.OnChangeListener({ column, value, ...event });
                        props.setFieldValue(event, value);
                    }}
                    // onChange={({ ...args }) => { FormUtils.OnChangeListener(args); props.setFieldValue(args); }}
                    model={values[column.name]} />
            )}
        />,
        // Reference Ends

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

        // DatePicker
        3: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <DatePicker single={true} placeholder={`Enter ${column.display_name}`} name={column.name} onChange={props.setFieldValue} value={values[column.name]} />
            )}
        />,
        // DatePicker Ends

        // Single DatePicker with Timepicker 
        4: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <DatePicker single={true} placeholder={`Enter ${column.display_name}`} timePicker={true} name={column.name} onChange={props.setFieldValue} value={values[column.name]} />
            )}
        />,
        // Single Datepicker Ends


        // Time Picker
        746: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <TimePicker name={column.name} placeholder={`Enter ${column.display_name}`} onChange={props.setFieldValue} value={values[column.name]} />
            )}
        />,
        // Time Picker Ends

        // Script Input
        411: <ScriptInput value={values[column.name]} columns={props.payload.dictionary} payload={props.payload} column={column} name={column.name} onChange={props.setFieldValue} model={values[column.index]} />,
        // Script Input Ends

        684: 'serialize',

        // Image Upload
        708: <Field
            name={column.name}
            render={({ field /* _form */ }) => (
                <ImageUpload name={column.name} onRemove={props.onFileRemove} onSelect={props.onFileUpload} />
            )}
        />,
        // Image Upload Ends
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
                    (column_definition.length) ?
                    column_definition.map((preference, key) => {

                        let elem, column;

                        // If it is not a split
                        if (!preference.split) {
                            column = payload.dictionary[preference.index];

                            elem = inputElement({ props, values, column, shouldColumnSplited, key });

                        } else {
                            shouldColumnSplited = preference.label.includes('s-split-') ? true : preference.label.includes('e-split-') ? false : shouldColumnSplited;
                        }
                        if (column && (IsUndefined(column.visibility) || column.visibility)) {
                            return (
                                <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
                                    <label>{column.label || column.display_name}</label>
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
                : <div className="message">Looks like no columns are selected , Configure it by pressing the settings icon.</div> }
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

                <button className="btn btn-warning" onClick={handleReset}>
                    Reset
                </button>

                {/* <button className="btn btn-primary">
                    Cancel
                </button> */}

                <button className="btn btn-success" type="submit">
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
            if (!preference.split) {
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
                //console.log(result)
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

export default class FormCreator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            payload: this.props.payload,
            fileUploads: []
        }

        this.formUpdated.bind(this);
        SubscribeToEvent({ eventName: 'formChanged', callback: this.formUpdated });
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    async componentDidMount() {
        const { payload = {} } = this.props;
        const { layout, module } = payload;
        // if (!layout && module) {
        //     const res = await GetPreference(payload.modelName);
        //     console.log(res);
        //     if (res) {
        //         payload.layout = res;
        //         this.setState({ payload });
        //     }
        // }

    }

    formUpdated = (payload) => {
        setTimeout(() => {
            const { updateState } = payload;
            if (updateState) {
                this.setState({ payload });
            } else {
                this.state.payload = payload;
            }
        }, 1000);
    }

    closeModal = () => {
        ModalManager.closeModal();
    }

    /**
     * On submit press
     */
    formSubmitted = () => {
        if (typeof this.props.payload.callback == 'function') {
            this.props.payload.callback(); // callback to refresh content
        }
        ModalManager.closeModal();
    }

    layoutChanged = (selectedColumns) => {
        let { payload } = this.state;
        payload.layout = selectedColumns;

        let editedLayout = -1;
        payload.layouts.some((layout, key) => {
            if (layout.id == selectedColumns) {
                editedLayout = key;
                return true;
            }
        });

        if (editedLayout != -1) {
            payload.layouts[editedLayout] = selectedColumns;
        } else {
            payload.layouts.push(selectedColumns);
        }

        payload = ExecuteScript({ formContent: payload, scripts: payload.scripts, context: FormUtils, contextName: 'form' });
        this.setState({ payload });
    }

    pushFiles = (column, file) => {
        let fileUploads = this.state.fileUploads;

        // Check if a file is already added for the column 
        // If yes , alert user if he needs to continue 
        var alreadyPresent = -1;
        var firstTime = false;

        // self.fileUploads.filter(function (uploadedFile) {
        //     return uploadedFile.column == file.column;
        // });

        if (fileUploads.length) {
            fileUploads.forEach((uploadedFile, index) => {
                if (uploadedFile.column == column) {
                    alreadyPresent = index;
                }
            })
        } else {
            firstTime = true;
            // self.fileUploads.push(file);
            alreadyPresent = 0;
        }

        if (!firstTime && alreadyPresent != -1) {
            console.log('already present');
            // ModalService.confirm('There is an attachement for ' + file.column + ' already uploaded. Do you want to replace it?').then(function (result) {
            //     self.fileUploads[alreadyPresent] = file;
            // });
        } else {
            fileUploads.push({ column: column, image: file });
        }

        this.setState({ fileUploads });
    }

    removeFile = (index) => {
        let fileUploads = this.state.fileUploads;
        fileUploads = fileUploads.filter((file) => (file.column != index))

        // fileUploads.splice(index, 1);
        this.setState({ fileUploads });
    }

    onLayoutChange = (value) => {
        const { payload } = this.state;
        if(value){
            payload.layout = value;
            this.setState({ payload });
            SetItem(`form-layout-${payload.modelId}`, value.id);
        }
    }

    render() {
        const { payload, fileUploads } = this.state;
        const { source, modelId } = payload;
        return (
            <div className="form-creator">
                {
                    <div className="layoutSelect">
                        <SelectBox isClearable={false} onChange={(value) => this.onLayoutChange(value)} value={payload.layout} field="name" options={payload.layouts} />
                    </div>
                }

                {
                    payload.dictionary ?
                        <FormSettings source={source} modelId={modelId} onSubmit={this.layoutChanged} listName={payload.modelName} formLayout={payload.layout} columns={payload.dictionary} />
                        :
                        null
                }
                <Card>
                    {
                        payload.layout ?
                            <CardBody>
                                <FormContents fileUploads={fileUploads} removeImage={this.removeImage} onFileUpload={this.pushFiles} onFileRemove={this.removeFile} onSubmit={this.formSubmitted.bind(this)} payload={payload} />
                            </CardBody>
                            :
                            null
                    }
                </Card>
            </div>
        )
    }
}