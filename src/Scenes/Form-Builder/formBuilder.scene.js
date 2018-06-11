import React, { Component } from 'react';
import FormGenerator from './../../Components/Form-Generator/formGenerator.component';
import { Get } from './../../Utils/http.utils';

import { SelectFromOptions } from './../../Utils/common.utils';

export default class FormBuilder extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formOutput: {},
            fields: []
        };
    }

    componentDidMount() {
        this.getForm();
    }

    getForm = async () => {
        const { fields } = this.state;
        const { formId } = this.props.match.params;
        const url = 'formDetail/' + formId;
        const result = await Get({ url });

        if (result.success) {
            const formOutput = result.response;
            console.log(formOutput);
            this.setState({ formOutput });
            formOutput.fields = JSON.parse(formOutput.fields);

            formOutput.fields.forEach(function (formElement) {
                if (typeof formElement == 'object') {
                    // Build fields with the template 
                    fields.push(this.getFormElement(formElement));
                } else {
                    fields.push(formElement);
                }
            });
        }
    }

    getFormElement(form) {
        return {
            formElements: {
                type: { selected: SelectFromOptions(inputSubTypes, form.column_type, 'column_type') },

                display_name: form.columnTitle || form.display_name, // for now sending column title in case of fallback , but this wont be required , 
                column_name: form.field || form.column_name,

                // Display column and Route are only for reference models
                route: form.route,
                display_column: form.display_column,
                key: form.key,
                onSelect: form.onSelect,
                scope: form.scope
            },
            type: 'input',
        };
    }

    formCreated = (form) => {
        console.log(form);
    }

    render() {
        const { formOutput, fields } = this.state;
        return (
            formOutput.id ? <FormGenerator formOutput={formOutput} fields={fields} onSubmit={this.formCreated()} /> : null
        )
    }
}