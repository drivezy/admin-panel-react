import React, { Component } from 'react';

import './editableLabel.css';

export default class EditableLabel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            editMode: false
        };
    }


    render() {
        const { value, editMode } = this.state;
        return (
            <div className="template-root">
                {
                    editMode &&
                    <div className="transclude-container">
                        <div className="tranclude-text" ng-click="editableLabel.editMode = true;">
                            <h4 className="form-title">
                                { value }
                            </h4>
                        </div>
                        <i className="fa fa-pencil-square" aria-hidden="true"></i>
                    </div>
                }
            </div>
        )
    }
}