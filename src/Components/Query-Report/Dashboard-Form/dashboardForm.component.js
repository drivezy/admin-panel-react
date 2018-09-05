import React, { Component } from 'react';
import './dashboardForm.css';

import _ from 'lodash';

import {
    Card, CardBody, Button
} from 'reactstrap';

// import { withFormik, Field, Form } from 'formik';
// import Yup from 'yup';
import { GetUrlParams, Location } from 'drivezy-web-utils/build/Utils/location.utils';


import DateTimePicker from './../../../Components/Date-Time-Picker/dateTimePicker.component';

import SelectBox from './../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component';

const inputElement = ({ self, preference, column, formContent }) => {

    const elements = {

        // String
        // 108: <Field autoComplete="off" className="form-control" type="string" name={column.name} placeholder={`Enter ${column.display_name}`} />,
        // String Ends

        // Single DatePicker with Timepicker 
        594: <DateTimePicker name={column.param} />,
        // Single DatePicker with Timepicker ends

        // Single DatePicker with Timepicker 
        // format='YYYY-MM' 
        109: <DateTimePicker format='YYYY-MM-DD HH:mm' onChange={self.dateChange} value={formContent[column.param]} name={column.param} />
        // Single DatePicker with Timepicker ends

    }

    return elements[column.param_type_id] || elements[108]; //uncomment this if required
}

let self = {};

class FormElements extends Component {

    constructor(props) {

        super(props);

        self = this;

        this.state = {
            formContent: this.props.formContent || {},
            payload: this.props.payload || {},
            operator: {},
            group_column: {},
            custom_column: {},
            aggregate_column: []
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps.formContent);
        this.setState({
            formContent: nextProps.formContent,
            payload: nextProps.payload
        });

    }

    /**
     * Update formContent on dateChange
     */
    dateChange = (field, value) => {
        const { formContent } = this.state;
        formContent[field] = value;
        this.setState({ formContent });
    }


    addOperator = () => {

    }

    resetForm = () => {
    }

    removeAggregation = (index) => {
        const { formContent } = this.state;
        formContent.aggregate_column.splice(index, 1);
        this.setState({ formContent });
    }

    submitForm = () => {
        const { formContent } = this.state;

        const formParam = { ...formContent };
        // console.log(formContent);

        //If there is an aggregation then stringify it and add it to the url
        if (formContent.aggregate_column && formContent.aggregate_column.length) {
            formParam.aggregate_column = JSON.stringify(formContent.aggregate_column)
        } else {
            delete formParam.aggregate_column;
        }

        Location.search(formParam);
    }

    render() {

        const { state } = this;
        const { props } = this;
        const { payload } = props;

        const { formContent } = this.state;

        // Creating a copy of formContent for modifying formContent according to 
        // form , for selec tand select pair . 

        const formParam = { ...formContent };

        formParam.group_column = [];

        const groupColumns = [];

        _.forEach(payload.columns, (column) => {
            groupColumns.push(column);
        });

        if (formContent.group_column) {
            formContent.group_column.split(',').forEach((entry) => {
                _.forEach(groupColumns, (column) => {
                    if (entry == column.column_name) {
                        formParam.group_column.push(column);
                    }
                })
            });
        }

        // Logic For group Column Ends

        formParam.aggregate_column = [];

        return (
            <form role="form" name="genericForm" >
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
                                    elem = inputElement({ self, column, formContent });
                                }

                                if (column) {
                                    return (
                                        <div key={key} className={`form-group`}>
                                            <label>{column.label || column.display_name}</label>

                                            {elem}
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
                            <SelectBox name="group_column" value={formParam.group_column} onChange={(input) => {
                                if (input) {
                                    const { formContent } = this.state;
                                    formContent.group_column = input.map((item) => item.column_name).join(',');
                                    this.setState({ formContent });
                                } else {
                                    const { formContent } = this.state;
                                    formContent.group_column = '';
                                    this.setState({ formContent });
                                }
                            }} multi="true" options={groupColumns} field="display_name"
                            //  onChange={(value) => { console.log(value); props.setFieldValue('group_column', value.map((item) => item.column_name).join(',')); }}
                            />
                        </div>

                        <div className="form-element">
                            <div className="form-label">
                                <label>
                                    Aggregations
                               </label>
                            </div>
                            <div className="select-container">
                                <div className="element-container">
                                    <SelectBox onChange={(input) => {
                                        if (input) {
                                            this.setState({ operator: input })
                                        } else {
                                            this.setState({ operator: {} })
                                        }
                                    }} options={payload.operators} value={this.state.operator} />
                                </div>
                                <div className="element-container">
                                    <SelectBox onChange={(input) => {
                                        if (input) {
                                            this.setState({ custom_column: input })
                                        } else {
                                            this.setState({ custom_column: {} })
                                        }
                                    }} options={payload.columns} field="display_name" value={this.state.custom_column} />
                                </div>

                                {/* Add Button for aggregation */}
                                <button disabled={(!this.state.operator.id || !this.state.custom_column.id)} type="button" className="btn btn-success btn-sm" onClick={() => {

                                    const param = { name: this.state.operator.name, operator: this.state.operator.id, column: this.state.custom_column.column_name };

                                    this.state.formContent.aggregate_column.push(param);

                                    this.setState({ operator: {}, custom_column: {} });
                                }} >
                                    +
                                    </button>
                                {/* Add Button Ends */}
                            </div>
                            {
                                formContent.aggregate_column
                                &&
                                <div className="active-selections">
                                    {
                                        formContent.aggregate_column.map((aggregation, key) =>
                                            <li class="am-list-group-item ">
                                                <span class="delete-icon" onClick={() => { this.removeAggregation(key); }}>
                                                    <i class="fa fa-times" aria-hidden="true"></i>
                                                </span>
                                                <span class="item-label ng-binding">
                                                    {aggregation.name} : {aggregation.column}
                                                </span>
                                            </li>
                                        )
                                    }
                                </div>
                            }
                        </div>
                    </div>


                    {/* Group Column Ends */}

                    {/* Aggregation */}

                    {/* Aggregation Ends */}

                    <div className="modal-actions">
                        <button className="btn btn-danger btn-sm" onClick={this.resetForm}>
                            Clear
                        </button>

                        <button className="btn btn-success btn-sm" onClick={this.submitForm} type="button">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

export default class DashboardForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formContent: this.props.formContent,
            payload: {
                operators: this.props.operators,
                queryData: this.props.queryParamsData,
                columns: this.props.columns || [],
                fields: this.props.fields || []
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            formContent: this.props.formContent,
            payload: {
                operators: this.props.operators,
                queryData: this.props.queryParamsData,
                columns: this.props.columns || [],
                fields: this.props.fields || []
            }
        });

    }


    render() {

        const { payload, formContent } = this.state;

        return (
            <div className="dashboard-form">
                <div className="form-wrapper">
                    {
                        payload ?
                            <FormElements formContent={formContent} payload={payload} /> : null
                    }
                </div>

            </div>
        )
    }
}
