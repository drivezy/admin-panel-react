import React, { Component } from 'react';
import './formGenerator.css';

import FormElements from './../Form-Generator/Components/Form-Elements/formElements.component';
import FormPreview from './../Form-Generator/Components/Form-Preview/formPreview.component';

export default class FormGenerator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formOutput: props.formOutput,
            fields: props.fields
        };
    }

    render() {
        const { formOutput, fields } = this.state;
        return (
            <div className="form-generator">
                <div className="component-wrapper">
                    <FormElements formOutput={formOutput} fields={fields} />
                </div>
                <div className="preview-wrapper">
                    <FormPreview />
                </div>
            </div>
        )
    }
}