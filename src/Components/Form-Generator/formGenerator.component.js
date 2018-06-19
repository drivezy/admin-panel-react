import React, { Component } from 'react';
import './formGenerator.css';

import { Card, CardBody, Button, ButtonGroup, Collapse } from 'reactstrap';

import FormElement from './../Form-Generator/Components/Form-Elements/formElements.component';
import EditableLabel from './../../Components/Form-Generator/Components/Editable-Label/editableLable.component';

import { GetLookupValues } from './../../Utils/lookup.utils';


export default class FormGenerator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fields: JSON.parse(props.formOutput.fields),
            inputSubTypes: props.inputSubTypes,
            formOutput: props.formOutput,
            methodTypes: [],
            collapse: false,
            columns: props.columns,
            tempColumns: {}
        };
    }

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

    unsafe_componentwillreceiveprops = (nextProps) => {
        this.setState({ inputSubTypes: nextProps.inputSubTypes });

    }

    componentDidMount() {
        this.getLookups();
    }


    getLookups = async () => {
        const result = await GetLookupValues(109);
        if (result.success) {
            const methodTypes = result.response;
            this.setState({ methodTypes });
        }

    }

    addInput = () => {
        let { fields } = this.state;
        fields.push({});
        this.setState({ fields });
    }

    removeInput = (key) => {
        let { fields } = this.state;
        fields.splice(key, 1);
        this.setState({ fields });
    }

    toggle = () => {
        this.setState({ collapse: !this.state.collapse });
    }

    previewForm = (fields) => {
        const { columns, tempColumns } = this.state;

        const { onSubmit } = this.props;

        fields.formContents.forEach(function (input) {
            if (input.column_type) {
                const columnId = input.column_type;
                tempColumns['temp_column' + input.column_name + columnId] = {
                    column_type: columnId,
                    ...columns[columnId], route: input.route,
                    display_column: input.display_column,
                    column_name: input.column_name,
                    display_name: input.display_name,
                    key: input.key,
                    scope: input.scope,
                    onSelect: input.onSelect
                }
            }

        });
        onSubmit({ columns: tempColumns });
    }

    render() {
        const { inputSubTypes, fields, formOutput, methodTypes } = this.state;

        return (
            <div className="form-generator">
                <div className="form-title">
                    <EditableLabel class="form-title" value={formOutput.name} placeholder="Form Title">
                    </EditableLabel>
                </div>

                {/* Form Title */}

                {/* Form Title Ends */}


                {/* Fields Below */}
                {
                    fields.map((formElement, key) => <FormElement key={key} onDelete={() => this.removeInput(key)} inputSubTypes={inputSubTypes} element={formElement} formOutput={formOutput} />)
                }
                {/* Fields Ends */}


                {/* Toolbox */}
                <div className="form-actions">
                    <div className="other-inputs">
                        <div className="form-group">
                            <input type="text" className="form-control" name="api" value={formOutput.api} placeholder="End Point" onChange={(event) => this.setState({ value: event.target.value })} />
                        </div>
                        <div className="form-actions">
                            <div className="other-inputs">
                                <ButtonGroup size="sm">
                                    {
                                        methodTypes.map((methodType, key) =>
                                            <Button key={key} value={formOutput.method_id}>{methodType.value}</Button>
                                        )
                                    }
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                    <div className="actions">
                        <button className="btn btn-secondary btn-sm" onClick={this.addInput}>
                            Add Input
                        </button>
                        <button type="button" className="btn btn-success btn-xs pull-right" onClick={() => this.previewForm({ formContents: fields })}>
                            Preview
                        </button>

                        <button type="button" className="btn btn-danger btn-xs pull-right" ng-click="formGenerator.reArrange()">
                            Re Arrange
                        </button>

                        <button type="button" className="btn btn-default btn-xs pull-right" ng-click="formGenerator.clearInputs()">
                            Clear
                        </button>
                    </div>
                </div>
                {/* Toolbox Ends */}

                {/* <div className="script-addition-block">
                    <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Toggle</Button>
                    {
                        this.scriptTypes.map((script, key) =>
                            <Collapse key={key} isOpen={this.state.collapse}>
                                <Card>
                                    <CardBody>
                                        <small className="text-muted">
                                            {script.name}
                                        </small>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        )
                    }
                </div> */}
                {/* <small className="text-info pull-right">
                    Add scripts that is to be executed before the form submission .
                </small> */}

            </div>
        )
    }
}