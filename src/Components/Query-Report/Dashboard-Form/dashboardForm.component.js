import React, { Component } from 'react';
import './dashboardForm.css';

import {
    Card, CardBody, Button
} from 'reactstrap';

import { withFormik, Field, Form } from 'formik';
import Yup from 'yup';
import { GetUrlParams, Location } from 'drivezy-web-utils/build/Utils/location.utils';


import DateTimePicker from './../../../Components/Date-Time-Picker/dateTimePicker.component';

import SelectBox from './../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component';

const inputElement = ({ props, preference, column, values }) => {

    const elements = {

        // String
        // 108: <Field autoComplete="off" className="form-control" type="string" name={column.name} placeholder={`Enter ${column.display_name}`} />,
        // String Ends

        // Single DatePicker with Timepicker 
        594: <DateTimePicker onChange={props.setFieldValue} name={column.param} value={values[column.param]} />,
        // Single DatePicker with Timepicker ends

        // Single DatePicker with Timepicker 
        // format='YYYY-MM' 
        109: <DateTimePicker format='YYYY-MM-DD HH:mm' name={column.param} onChange={props.setFieldValue} value={values[column.param]} />
        // Single DatePicker with Timepicker ends

    }

    return elements[column.param_type_id] || elements[108]; //uncomment this if required
}

class formElements extends Component {

    constructor(props) {

        super(props);

        this.state = {
            operator: {},
            group_column: {},
            custom_column: {},
            aggregate_column: []
        }
    }

    addOperator = () => {

    }



    render() {
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
            setFieldValue,
            setValues,
        } = this.props;


        const { props } = this;
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

                                // If there is a preference , 
                                // find the attached column
                                if (preference) {
                                    column = preference;
                                    elem = inputElement({ props, column, values });
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
                            <SelectBox name="group_column" value={values['group_column']} multi="true" options={props.payload.columns} field="display_name" onChange={(value) => { console.log(value); props.setFieldValue('group_column', value.map((item) => item.column_name).join(',')); }} />
                        </div>

                        <div className="form-element">
                            <div className="form-label">
                                <label>
                                    Aggregations
                               </label>
                            </div>
                            <div className="select-container">
                                <div className="element-container">
                                    <SelectBox onChange={(input) => { this.setState({ operator: input }) }} options={props.payload.operators} value={this.state.operator} />
                                </div>
                                <div className="element-container">
                                    <SelectBox onChange={(input) => { this.setState({ custom_column: input }) }} options={props.payload.columns} field="display_name" value={this.state.custom_column} />
                                </div>
                                <div>
                                    <button type="button" className="btn btn-success btn-sm" onClick={() => {

                                        const param = { name: this.state.operator.name, operator: this.state.operator.id, column: this.state.custom_column.column_name };

                                        this.state.aggregate_column.push(param);

                                        props.setFieldValue('aggregate_column', this.state.aggregate_column);

                                        // props.setFieldValue('aggregate_column', JSON.stringify(this.state.aggregate_column));
                                        this.setState({ operator: '', custom_column: '' });
                                    }} >
                                        +
                                    </button>
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
}

const FormContents = withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => {

        const { payload } = props;
        const { formContent } = payload;


        return formContent;
    },
    setValues: () => {
        console.log(arguments);
    },
    addAggregation: () => {
        console.log('hello');
    },
    handleSubmit: async (values, { props, setSubmitting }) => {

        console.log(values);
        Location.search(values);
    },
    displayName: 'BasicForm', // helps with React DevTools
})(formElements);

export default class DashboardForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            payload: {
                formContent: this.props.formContent,
                operators: this.props.operators,
                queryData: this.props.queryParamsData,
                columns: this.props.columns || [],
                fields: this.props.fields || []
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            payload: {
                formContent: this.props.formContent,
                operators: this.props.operators,
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
