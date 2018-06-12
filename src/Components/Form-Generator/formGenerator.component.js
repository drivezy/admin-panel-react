import React, { Component } from 'react';
import './formGenerator.css';

import FormElements from './../Form-Generator/Components/Form-Elements/formElements.component';
import FormPreview from './../Form-Generator/Components/Form-Preview/formPreview.component';

export default class FormGenerator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formOutput: props.formOutput,
            fields: props.fields,
            inputSubTypes: props.inputSubTypes
        };
    }

    render() {
        const { formOutput, fields, inputSubTypes } = this.state;
        console.log(inputSubTypes);
        return (
            <div className="form-generator">
                <div className="component-wrapper">
                    <FormElements inputSubTypes={inputSubTypes} formOutput={formOutput} fields={fields} />
                </div>
                <div className="preview-wrapper">
                    <FormPreview />
                </div>
            </div>
        )
    }
}