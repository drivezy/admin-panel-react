import React, { Component } from 'react';
import './formCreator.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col,
    ModalBody,
    ModalFooter
} from 'reactstrap';

import { withFormik, Field, Form } from 'formik';
import Yup from 'yup';

import { Upload, Post, Put } from './../../Utils/http.utils';
import { GetPreference } from './../../Utils/generic.utils';

import SelectBox from './../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import ReferenceInput from './../Forms/Components/Reference-Input/referenceInput';
import DatePicker from './../Forms/Components/Date-Picker/datePicker';
import TimePicker from './../Forms/Components/Time-Picker/timePicker';
import ListSelect from './../Forms/Components/List-Select/listSelect';
import Switch from './../Forms/Components/Switch/switch';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import ImageUpload from './../Forms/Components/Image-Upload/imageUpload.component';
import ImageThumbnail from './../Forms/Components/Image-Thumbnail/imageThumbnail.component';
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';
import FormSettings from './../Form-Settings/FormSettings.component';
import ScriptInput from './../Forms/Components/Script-Input/scriptInput.component';


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
        768: <h5>{values[column.column_name]}</h5>,
        // Static Ends

        // Number
        107: <Field autoComplete="off" className="form-control" type="number" name={column.column_name} placeholder={`Enter ${column.display_name}`} />,
        // Number Ends

        // Text
        108: <Field className={`form-control ${props.errors[column.column_name] && props.touched[column.column_name] ? 'is-invalid' : ''}`} type="text" name={column.column_name} placeholder={`Enter ${column.display_name}`} />,
        // Text Ends

        // TextArea Begins
        160: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <textarea name={column.column_name} className="form-control" rows="3" onChange={props.handleChange} value={values[column.column_name]}></textarea>
            )}
        />,
        // TextArea Ends

        // Switch Begins
        119: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <Switch name={column.column_name} rows="3" onChange={props.setFieldValue} value={values[column.column_name]} />
            )}
        />,
        // Switch Ends

        // Boolean Select
        111: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <SelectBox name={column.column_name} onChange={props.setFieldValue} value={values[column.column_name]} field="name" options={[{ name: "True", id: 1 }, { name: "False", id: 0 }]} />
            )}
        />,
        // Boolean Ends

        // List Select with options from api
        116: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <ListSelect column={column} name={column.column_name} onChange={props.setFieldValue} model={values[column.column_name]} />
            )}
        />,
        // List Select Ends

        // List Multi Select
        465: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <ListSelect multi={true} column={column} name={column.column_name} onChange={props.setFieldValue} model={values[column.column_name]} />
            )}
        />,
        // List Ends

        // DatePicker
        109: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <DatePicker single={true} name={column.column_name} onChange={props.setFieldValue} value={values[column.column_name]} />
            )}
        />,
        // DatePicker Ends

        // Single DatePicker with Timepicker 
        110: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <DatePicker single={true} timePicker={true} name={column.column_name} onChange={props.setFieldValue} value={values[column.column_name]} />
            )}
        />,
        // Single Datepicker Ends

        // Time Picker
        746: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <TimePicker name={column.column_name} onChange={props.setFieldValue} value={values[column.column_name]} />
            )}
        />,
        // Time Picker Ends

        // Reference Begins
        117: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <ReferenceInput column={column} name={column.column_name} onChange={props.setFieldValue} model={values[column.column_name]} />
            )}
        />,
        // Reference Ends

        // Script Input
        411: <ScriptInput value={values[column.column_name]} columns={props.payload.columns} payload={props.payload} column={column} name={column.column_name} onChange={props.setFieldValue} model={values[column.column_name]} />,
        // Script Input Ends

        684: 'serialize',

        // Image Upload
        708: <Field
            name={column.column_name}
            render={({ field /* _form */ }) => (
                <ImageUpload name={column.column_name} onRemove={props.onFileRemove} onSelect={props.onFileUpload} />
            )}
        />,
        // Image Upload Ends
    }

    return elements[column.column_type];
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

    return (

        <div>
            <Form>
                <ModalBody>
                    <Card>
                        <CardBody>
                            <div className="form-row">
                                {
                                    payload.formPreference.map((preference, key) => {

                                        let elem, column;

                                        if (typeof preference != 'string') {
                                            column = payload.columns[preference.column];

                                            elem = inputElement({ props, values, column, shouldColumnSplited, key });

                                        } else if (typeof preference == 'string') {
                                            shouldColumnSplited = preference.includes('s-split-') ? true : preference.includes('e-split-') ? false : shouldColumnSplited;
                                        }

                                        if (column) {
                                            return (
                                                <div key={key} className={`${shouldColumnSplited ? 'col-6' : 'col-12'} form-group`}>
                                                    <label htmlFor="exampleInputEmail1">{column.display_name}</label>
                                                    {elem}

                                                    {/* Showing Errors when there are errors */}
                                                    {
                                                        errors[column.column_name] && touched[column.column_name] ?
                                                            <small id="emailHelp" className="form-text text-danger">
                                                                {errors[column.column_name]}
                                                            </small>
                                                            : null}

                                                    {/* Errors Ends */}
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </CardBody>
                    </Card>

                    {/* Uploaded file thumbnails */}
                    {/* <div className="file-uploads">
                {
                    props.fileUploads.map((file, index) => (
                        <ImageThumbnail file={file} key={index} index={index} removeImage={props.removeImage} />
                    ))
                }
            </div> */}
                    {/* Uploaded file thumbnails Ends*/}
                </ModalBody>

                <ModalFooter>
                    <div className="modal-actions row justify-content-end">
                        <Button color="secondary" onClick={props.onClose}>
                            Cancel
                        </Button>
                        <button className="btn btn-primary" type="submit">
                            Submit
                        </button>
                    </div>
                </ModalFooter>
            </Form>
        </div>
    );
}


const FormContents = withFormik({
    mapPropsToValues: props => {

        const { payload } = props;

        let response = {}

        payload.formPreference.forEach((preference) => {
            if (typeof preference != 'string') {
                let column = payload.columns[preference.column];
                response[column.column_name] = payload.listingRow[column.column_name] || '';
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

        let fields = Object.keys(props.payload.columns);

        const { columns } = props.payload;

        fields.forEach((column) => {
            if (columns[column].mandatory) {
                da[columns[column].column_name] = Yup.string().required(columns[column].display_name + ' is required.');
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

        if (props.fileUploads.length) {
            uploadImages(props).then((result) => {
                console.log(result)
                submitGenericForm();
            });
        } else {
            submitGenericForm();
        }

        async function submitGenericForm() {
            if (payload.method == 'edit') {
                const result = await Put({ url: payload.module + '/' + payload.listingRow.id, body: values });
                if (result.response) {
                    props.onSubmit();
                }

            } else {
                const result = await Post({ url: payload.module, body: values });
                if (result.success) {
                    props.onSubmit();
                }
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
    }

    async componentDidMount() {
        const { payload = {} } = this.props;
        const { formPreference, module } = payload;
        if (!formPreference && module) {
            const res = await GetPreference(payload.modelName);
            console.log(res);
            if (res) {
                payload.formPreference = res;
                this.setState({ payload });
            }
        }

    }

    closeModal = () => {
        ModalManager.closeModal();
    }

    /**
     * On submit press
     */
    formSubmitted = () => {
        if (this.props.payload.action && typeof this.props.payload.action.callback == 'function') {
            this.props.payload.action.callback(); // callback to refresh content
        }
        ModalManager.closeModal();
    }

    layoutChanged = (selectedColumns) => {
        let { payload } = this.state;
        payload.formPreference = selectedColumns
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

    render() {
        const { payload, fileUploads } = this.state;
        return (
            <div className="form-creator">

                {
                    payload.columns ?
                        <FormSettings onSubmit={this.layoutChanged} listName={payload.modelName} selectedColumns={payload.formPreference} columns={payload.columns} />
                        :
                        null
                }

                {
                    payload.formPreference ?
                        <FormContents onClose={this.closeModal} fileUploads={fileUploads} removeImage={this.removeImage} onFileUpload={this.pushFiles} onFileRemove={this.removeFile} onSubmit={this.formSubmitted} payload={payload} />
                        : null
                }
            </div >
        )
    }
}
