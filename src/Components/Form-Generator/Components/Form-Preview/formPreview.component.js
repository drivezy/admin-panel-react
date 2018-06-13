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
            formContent: {},
            tempColumns: {},
            formId: props.formId
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
                // ToastNotifications.info('' +
                //     'Your form has been created successfully.Use the id ' + form.id + ' to use the form inside a modal by adding ' +
                //     '<kbd>ModalService.customModal(' + form.id + ')</kbd>' + '. We will add on more ways you can use it. ').result.then(function (result) {
                //         formOutput.fields = JSON.stringify(formOutput.fields);
                //     })
            }
        }
    }

    clearForm = () => {
        this.initializeForm();
    }

    initializeForm() {

    }

    render() {
        const { formOutput, formContent, tempColumns, formId } = this.state;
        return (
            <Card>
                <div className="">
                    <h4 className="form-title">
                        Form Preview
                    </h4>
                    <CardBody>
                        <form name="createdForm">
                            {
                                formOutput.fields && formOutput.fields.length &&
                                <div className="panel">
                                    <div className="panel-body">
                                        <h1 className="text-center">
                                            <i className="fa fa-table" aria-hidden="true"></i>
                                        </h1>

                                        <FormCreator payload={formOutput.fields}>
                                        </FormCreator>
                                    </div>
                                    <div className="panel-footer text-right">
                                        <small className="text-muted">
                                            View a preview of the created form in here .
                                        </small>
                                    </div>
                                </div>
                            }
                            {
                                formOutput &&
                                <div className="form-actions text-right">
                                    <div className="actions">
                                        <button className="btn btn-default btn-xs" ng-click="formGenerator.clearForm()">
                                            Clear Form
                                    </button>

                                        <button className="btn btn-success btn-xs" ng-click="formGenerator.createForm()">
                                            {formId ? 'Update' : 'Create'} Form
                                    </button>
                                    </div>
                                </div>
                            }
                        </form>
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