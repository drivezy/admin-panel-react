import React, { Component } from 'react';

import './formBuilder.css';

import {
    Row, Col
} from 'reactstrap';

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
        const { columns } = this.state;
        const url = 'formDetail/' + formId;
        const result = await Get({ url });

        if (result.success) {
            const formOutput = result.response;
            const fields = JSON.parse(formOutput.fields);
            fields.forEach(function (input) {
                if (input.column_type) {
                    const columnId = input.column_type;
                    columns['temp_column' + input.column_name + columnId] = {
                        ...columns[columnId],
                        column_type: columnId,
                        route: input.route,
                        display_column: input.display_column,
                        column_name: input.column_name,
                        display_name: input.display_name,
                        key: input.key,
                        scope: input.scope,
                        onSelect: input.onSelect
                    }
                }
            });
            this.setState({ formOutput, fields, columns });
        }
    }

    getLookups = async () => {
        const result = await GetLookupValues(31);
        if (result.success) {
            const inputSubTypes = result.response;
            this.setState({ inputSubTypes });
        }

    }

    formCreated = (form) => {
        console.log(form);
        this.setState({ columns: form.columns })
    }

    render() {
        const { formOutput, inputSubTypes, columns, fields } = this.state;

        return (
            <div className="form-builder">
                <Row>
                    <Col sm="6">
                        {
                            formOutput.id && inputSubTypes.length ?
                                <FormGenerator inputSubTypes={inputSubTypes} formOutput={formOutput} onSubmit={this.formCreated} columns={columns} /> : null
                        }
                    </Col>
                    <Col sm="6">
                        <div className="preview-wrapper">
                            {
                                formOutput.id && columns &&
                                <FormPreview formId={this.props.match.params.formId} columns={columns} formOutput={formOutput} fields={fields} />
                            }
                        </div>
                    </Col>
                </Row>


            </div>
        )
    }
}