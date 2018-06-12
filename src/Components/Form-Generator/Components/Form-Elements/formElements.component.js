import React, { Component } from 'react';

import './formElements.css';

import EditableLabel from './../Editable-Label/editableLable.component';
import SelectBox from './../../../Forms/Components/Select-Box/selectBox';


export default class FormElements extends Component {

    alerts = [
        'Form Builder lets you create forms that can be linked to a modal to be shown inside it. Confirm by previewing the form to save it.'
    ]

    scriptTypes = [{
        name: 'Pre load Script',
        field: 'pre_load_id',
        description: 'Pre load scripts are triggered before form initialization. Manipulate form data in here.'
    }, {
        name: 'Pre Submission Script',
        field: 'pre_submission_id',
        description: 'Pre submission scripts are triggered before the form submission. Manipulate form content according to api requirement in here.'

    }, {
        name: 'Post Submission Script',
        field: 'post_submission_id',
        description: 'Post submission scripts are triggered after the form submission.Do operations like closing modal in here.'
    }];

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
        console.log(inputSubTypes);
        return (
            <div className="elements-wrapper">
                {
                    this.alerts.length > 0 &&
                    this.alerts.map((alert, key) => <div key={key} className="alert-warning" close="formGenerator.closeAlert($index)">
                        {alert}
                    </div>)
                }
                <div className="panel-container">
                    {
                        formOutput &&
                        <EditableLabel className="form-title" value={formOutput.name} placeholder="Form Title">
                        </EditableLabel>
                    }


                    <form name="generatorForm">
                        {
                            fields.length == 0 &&
                            <div className="panel empty-panel">
                                <div className="panel-body">
                                    <p className="text-muted">
                                        Form Builder lets you create custom forms of your choice from a set of input options.
                                        </p>
                                </div>
                                <div className="panel-footer text-right">
                                    <small>
                                        Submitting the form will generate an id that you could link to use the form.
                                        </small>
                                </div>
                            </div>
                        }
                        {
                            fields.length > 0 &&
                            fields.map((input, key) => {
                                return (
                                    <div key={key}>
                                        {
                                            input.formElements &&
                                            <div className="panel selected-inputs" >
                                                <div className="panel-body">
                                                    <div ng-switch="input.type">
                                                        <div ng-switch-when="input">
                                                            <div className='form-group'>
                                                                <div className="first-row">
                                                                    <div className="input-type">
                                                                        <SelectBox
                                                                            onChange={(data) => this.setState({ type: data })}
                                                                            value={type}
                                                                            options={inputSubTypes}
                                                                            placeholder="Type"
                                                                            field='name'
                                                                        />
                                                                        {/* <custom-select-field ng-model="input.formElements.type" call-it="formGenerator.selectSubType" place-holder="Type" obj="formGenerator.inputSubTypes"
                                                                            iterate-item="name" required="true">
                                                                        </custom-select-field> */}
                                                                    </div>
                                                                    <div className="input-label">
                                                                        <div>
                                                                            <input ng-change="formGenerator.editFieldName(input,$index)" validate="required" placeholder="Label" ng-model="input.formElements.display_name"
                                                                                type="text" className="form-control" />
                                                                        </div>
                                                                    </div>

                                                                    <button type="button" className="btn btn-xs btn-delete" ng-click="formGenerator.removeElement($index)">
                                                                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                                                                    </button>
                                                                </div>
                                                                {
                                                                    (input.formElements.type && input.formElements.type.selected && input.formElements.type.selected.id == 117) || (input.formElements.type && input.formElements.type.selected && input.formElements.type.selected.id == 116) &&
                                                                    <div className="second-row">
                                                                        <div className="route-holder">
                                                                            <div className="form-group">
                                                                                <label className="sr-only" for="exampleInputEmail3">Route</label>
                                                                                <input ng-model="input.formElements.route" type="text" className="form-control" placeholder="Route" />
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <small>or</small>
                                                                        </div>
                                                                        <div className="scope-variable">
                                                                            <div className="form-group">
                                                                                <label className="sr-only" for="exampleInputEmail3">Scope</label>
                                                                                <input ng-model="input.formElements.scope" type="text" className="form-control" placeholder="Scope" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                <div className="third-row">
                                                                    <div className="column-name">
                                                                        <label>
                                                                            Column Name :
                                                                            </label>
                                                                        {
                                                                            formOutput &&
                                                                            <editable-label className="field-name" value={input.formElements.column_name} placeholder={input.formElements.column_name || 'edit'}>
                                                                            </editable-label>
                                                                        }
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Display Column :
                                                                            </label>
                                                                        {
                                                                            formOutput &&
                                                                            <editable-label className="field-name" value={input.formElements.display_column} placeholder={input.formElements.display_column || 'edit'}>
                                                                            </editable-label>
                                                                        }
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Key :
                                                                            </label>
                                                                        {
                                                                            formOutput &&
                                                                            <editable-label className="field-name" value={input.formElements.key} placeholder={input.formElements.key || 'edit'}>
                                                                            </editable-label>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {
                                                                    (input.formElements.type && input.formElements.type.selected && input.formElements.type.selected.id == 117) || (input.formElements.type && input.formElements.type.selected && input.formElements.type.selected.id == 116) &&
                                                                    <div className="on-select">
                                                                        <button type="button" type="submit" className="btn btn-danger btn-xs" ng-click="formGenerator.assignOnSelectScript(input)">
                                                                            {input.formElements.onSelect ? 'Edit Script' : 'Add onSelect Method'}
                                                                        </button>
                                                                        <div>
                                                                            <small className="">
                                                                                <code>
                                                                                    {input.formElements.onSelect}
                                                                                </code>
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            })
                        }
                    </form>
                    <small className="text-info pull-right">
                        Add scripts that is to be executed before the form submission .
                    </small>
                </div>

            </div>
        )
    }
}