import React, { Component } from 'react';

import './formElements.css';

import { Card, CardBody } from 'reactstrap';
import { withFormik, Field } from 'formik';


import EditableLabel from './../Editable-Label/editableLable.component';
import SelectBox from './../../../Forms/Components/Select-Box/selectBox';



// Our inner form component which receives our form's state and updater methods as props
const ElementFormContent = props => {
    const {
        values,
        handleSubmit,
        setFieldValue,
        handleChange
    } = props;

    return (
        <form onSubmit={handleSubmit}>

            <div className="element-detail">
                <div className="element-type">
                    <label>Type</label>
                    <Field
                        name='column_type'
                        render={({ field /* _form */ }) => (
                            <SelectBox valueKey="column_type" field="name" onChange={(selected) => { setFieldValue('column_type', selected.column_type) }} value={values.column_type} options={props.types} />
                        )}
                    />
                </div>
                <div className="element-label">
                    <label>Label</label>
                    <input type="text" name="display_name" className="form-control" value={values.display_name} onChange={handleChange} placeholder="Label" />
                </div>

                <div>
                    <button className="btn delete-button" onClick={props.onDelete}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </button>
                </div>
            </div>


            <div className="element-detail">
                <div className="element-label">
                    <label>Route</label>
                    <input type="text" name="route" value={values.route} className="form-control" onChange={handleChange} placeholder="Route" />
                </div>
                <div className="or">
                    <small>or</small>
                </div>
                <div className="element-label">
                    <label>Scope</label>
                    <input type="text" name="scope" value={values.scope} className="form-control" onChange={handleChange} placeholder="Scope" />
                </div>
            </div>

            <div className="editable-values">
                <div className="form-group">
                    <label>
                        Column Name :
                    </label>
                    {
                        props.formOutput &&
                        <EditableLabel className="field-name" value={values.column_name} placeholder={values.column_name || 'edit'}>
                        </EditableLabel>
                    }
                </div>
                <div className="form-group">
                    <label>
                        Display Column :
                    </label>
                    {
                        props.formOutput &&
                        <EditableLabel className="field-name" value={values.display_name} placeholder={values.display_column || 'edit'}>
                        </EditableLabel>
                    }
                </div>
                <div className="form-group">
                    <label>
                        Key :
                    </label>
                    {
                        props.formOutput &&
                        <EditableLabel className="field-name" value={values.key} placeholder={values.key || 'edit'}>
                        </EditableLabel>
                    }
                </div>
            </div>

        </form>
    )
}



// Wrap our form with the using withFormik HoC
const ElementForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => {

        const { element } = props;

        return {
            column_type: element.column_type || '',
            display_name: element.display_name || '',
            route: element.route || '',
            scope: element.scope || '',
            column_name: element.column_name || '',
            key: element.key || '',
        }

    },

    // Submission handler
    handleSubmit: async (
        values,
        {
            props,
            setSubmitting,
            setErrors /* setValues, setStatus, and other goodies */,
        }
    ) => {
        // const result = await Put({
        //     url: 'userLicense/' + props.rejectdData.licenseIndex,
        //     body: {
        //         approved: values.approved,
        //         rejection_reason: values.rejection_reason
        //     }
        // });


        // props.onSubmit();
    },
})(ElementFormContent);


export default class FormElements extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: props.element,
            inputSubTypes: props.inputSubTypes,
            formOutput: props.formOutput
        };
    }


    render() {
        const { element, inputSubTypes, formOutput } = this.state;

        const { onDelete } = this.props;

        return (
            <Card className="elements-wrapper">
                <CardBody className="element-contents">

                    <ElementForm element={element} types={inputSubTypes} onDelete={onDelete} formOutput={formOutput} />

                </CardBody>
            </Card>
        )
    }
}