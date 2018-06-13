import React, { Component } from 'react';

import './formBuilder.css';

import { Get } from './../../Utils/http.utils';
import { GetLookupValues } from './../../Utils/lookup.utils';

import FormPreview from './../../Components/Form-Generator/Components/Form-Preview/formPreview.component';
import FormGenerator from './../../Components/Form-Generator/formGenerator.component';

const inputTypes = [
    {
        formElements: {
            label: '',
            field: '',
            key: 'id',
            scope: '',
            display_column: 'name',
            onSelect: ''
        },
        type: 'input'
    }
];

export default class FormBuilder extends Component {

    fields = inputTypes[0];

    constructor(props) {
        super(props);

        this.state = {
            formOutput: {},
            fields: [],
            columns: {},
            inputSubTypes: [],
        };
    }

    componentDidMount() {
        const { formId } = this.props.match.params;

        if (formId) {
            this.getForm(formId);
        }
        this.getLookups();
    }

    getForm = async (formId) => {
        const url = 'formDetail/' + formId;
        const result = await Get({ url });

        if (result.success) {
            const formOutput = result.response;
            this.setState({ formOutput });
        }
    }

    getLookups = async () => {
        const { columns } = this.state;
        const result = await GetLookupValues(31);
        if (result.success) {
            const inputSubTypes = result.response;
            inputSubTypes.forEach((inputType) => {
                columns[inputType.id] = { ...inputType, column_type: inputType.id }
            })
            this.setState({ inputSubTypes, columns });
        }

    }

    formCreated = (form) => {
        console.log(form);
        this.setState({ columns: form.columns })
    }

    render() {
        const { formOutput, inputSubTypes, columns } = this.state;

        return (
            <div className="form-builder">
                {
                    formOutput.id && inputSubTypes.length ?
                        <FormGenerator inputSubTypes={inputSubTypes} formOutput={formOutput} onSubmit={this.formCreated} columns={columns} /> : null
                }
                <div className="preview-wrapper">
                    {
                        formOutput.id &&
                        <FormPreview formId={this.props.match.params.formId} columns={columns} formOutput={formOutput} />
                    }
                </div>
            </div>
        )
    }
}