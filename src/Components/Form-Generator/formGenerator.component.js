import React, { Component } from 'react';
import './formGenerator.css';

import { Card, CardBody } from 'reactstrap';

import FormElement from './../Form-Generator/Components/Form-Elements/formElements.component';


export default class FormGenerator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fields: JSON.parse(props.formOutput.fields),
            inputSubTypes: props.inputSubTypes,
            formOutput: props.formOutput
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

    addInput = () => {
        let { fields } = this.state;
        fields.push({});
        this.setState({ fields });
    }

    removeInput = (key) => {
        let {fields} = this.state;
        fields.splice(key, 1);
        this.setState({ fields });
    }

    render() {
        const { inputSubTypes, fields, formOutput } = this.state;

        return (
            <div className="form-generator">

                {/* Form Title */}

                {/* Form Title Ends */}


                {/* Fields Below */}
                {
                    fields.map((formElement, key) => <FormElement key={key} onDelete={() => this.removeInput(key)} inputSubTypes={inputSubTypes} element={formElement} formOutput={formOutput}/>)
                }
                {/* Fields Ends */}


                {/* Toolbox */}
                <Card className="toolbox">
                    <CardBody className="toolbox-contents">
                        <div className="config">
                            <div className="left"></div>
                            <div className="right">
                                <button className="btn btn-secondary btn-sm" onClick={this.addInput}>
                                    Add Input
                                </button>
                            </div>
                        </div>
                        <div className="config">
                        </div>
                    </CardBody>
                </Card>
                {/* Toolbox Ends */}

            </div>
        )
    }
}