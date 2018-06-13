import React, { Component } from 'react';

import FormCreator from './../../../Form-Creator/formCreator.component';
import { Card, CardBody } from 'reactstrap';

import { Put, Post } from './../../../../Utils/http.utils';
import ToastNotifications from '../../../../Utils/toast.utils';

export default class FormPreview extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formOutput: props.formOutput,
            formId: props.formId,
            columns: props.columns
        };
    }

    createForm = async () => {
        const { formOutput } = this.state;
        formOutput.fields = JSON.stringify(formOutput.fields);

        if (formOutput.id) {
            const url = 'formDetail/' + formOutput.id;
            const result = await Put({ url, formOutput });
            if (result.success) {
                ToastNotifications.success("Form Updated.");
            }
        } else {
            const url = 'formDetail/' + formOutput.id;
            const result = await Post({ url, formOutput });
            if (result.success) {
                var form = result.data.response;
            }
        }
    }

    render() {
        const { formOutput, formId, columns } = this.state;
        let payload = {
            columns: columns,
            formPreference: JSON.parse(formOutput.fields),
            listingRow: formOutput
        };
        return (
            <Card>
                <div className="">
                    <h4 className="form-title">
                        Form Preview
                    </h4>
                    <CardBody>
                        {/* <form name="createdForm"> */}

                        <div className="panel">
                            <div className="panel-body">
                                <h1 className="text-center">
                                    <i className="fa fa-table" aria-hidden="true"></i>
                                </h1>

                                {
                                    payload.columns && payload.formPreference &&
                                    <FormCreator payload={payload}>
                                    </FormCreator>
                                }
                            </div>
                            <div className="panel-footer text-right">
                                <small className="text-muted">
                                    View a preview of the created form in here .
                                        </small>
                            </div>
                        </div>
                        {
                            formOutput &&
                            <div className="form-actions text-right">
                                <div className="actions">
                                    <button className="btn btn-secondary btn-xs" ng-click="formGenerator.clearForm()">
                                        Clear Form
                                    </button>

                                    <button className="btn btn-success btn-xs" ng-click="formGenerator.createForm()">
                                        {formId ? 'Update' : 'Create'} Form
                                    </button>
                                </div>
                            </div>
                        }
                        {/* </form> */}
                    </CardBody>
                    <div className="form-contents">
                        <small className="text-muted">
                            Note
                    </small>
                        <p>
                            Specify the end point to which the form is to be submitted. Mention
                        <code>&lt;endPoint/:id&gt;</code> with a colon if you need to do a
                        <span className="label label-warning">POST</span> call to an existing record.
                    </p>
                    </div>
                </div>
            </Card>
        )
    }
}