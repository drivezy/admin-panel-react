import React, { Component } from 'react';
import './formGenerator.css';

import FormElement from './../Form-Generator/Components/Form-Elements/formElements.component';
import FormPreview from './Components/Form-Preview/formPreview.component.js';


export default class FormGenerator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formOutput: props.formOutput,
            inputSubTypes: props.inputSubTypes
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

    render() {
        const { formOutput, inputSubTypes } = this.state;

        const fields = JSON.parse(formOutput.fields)

        return (
            <div className="form-generator">

                {/* Form Title */}

                {/* Form Title Ends */}


                {/* Fields Below */}
                {
                    fields.map((formElement, key) => <FormElement key={key} element={formElement} />)
                }
                {/* Fields Ends */}


            </div>
        )
    }
}