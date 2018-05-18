import React, { Component } from 'react';
import './formCreator.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col
} from 'reactstrap';

import { withFormik, Field, Form } from 'formik';
import Yup from 'yup';

import { Post, Put } from './../../Utils/http.utils';

import SelectBox from './../Forms/Components/Select-Box/selectBox';
import ReferenceInput from './../Forms/Components/Reference-Input/referenceInput';
import DatePicker from './../Forms/Components/Date-Picker/datePicker';
import TimePicker from './../Forms/Components/Time-Picker/timePicker';
import ListSelect from './../Forms/Components/List-Select/listSelect';
import Switch from './../Forms/Components/Switch/switch';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import TableSettings from './../Table-Settings/TableSettings.component';



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
        107: <Field className="form-control" type="number" name={column.column_name} placeholder={`Enter ${column.display_name}`} />,
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
                <SelectBox name={column.column_name} onChange={props.setFieldValue} value={values[column.column_name]} options={[{ name: "True", id: 1 }, { name: "False", id: 0 }]} />
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

        411: 'script',
        684: 'serialize',
        708: 'upload',
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

    return (
        <Form>
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
        console.log(values);
    },
    handleSubmit: async (values, { props, setSubmitting }) => {

        const { payload } = props;

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
    },
    displayName: 'BasicForm', // helps with React DevTools
})(formElements);



export default class FormCreator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            payload: this.props.payload
        }
    }

    closeModal = () => {
        ModalManager.closeModal();
    }

    layoutChanged = (selectedColumns) => {
        let { payload } = this.state;
        payload.formPreference = selectedColumns
        this.setState({ payload });
    }

    render() {

        const { payload } = this.state;

        return (
            <div className="form-creator">
                {
                    payload.columns ?
                        <TableSettings onSubmit={this.layoutChanged} listName={payload.modelName} selectedColumns={payload.formPreference} columns={payload.columns} />
                        :
                        null
                }
                <Card>
                    <CardBody>
                        <FormContents layoutChanged={this.layoutChanged} onSubmit={this.closeModal} payload={payload} />
                    </CardBody>
                </Card>
            </div>
        )
    }
}
