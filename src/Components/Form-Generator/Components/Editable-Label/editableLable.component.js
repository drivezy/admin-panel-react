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

    editMode = (editMode) => {
        if (this.state.editMode == false) {
            this.setState({ editMode: true })
        } else {
            this.setState({ editMode: false })
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.value != this.props.value) {
            this.setState({ value: this.props.value });
        }
    }


    render() {
        const { value, editMode } = this.state;
        return (
            <div className="editable-label">
                <div className="template-root">
                    {
                        editMode == false &&
                        <div className="transclude-container">
                            <div className="tranclude-text" onClick={() => this.editMode({ editMode: true })}>
                                <h4 className="form-title">
                                    {value}
                                </h4>
                            </div>
                            <i className="fa fa-pencil-square" onClick={() => this.editMode({ editMode: true })} aria-hidden="true"></i>
                        </div>
                    }
                    {
                        editMode == true &&
                        <div className="input-wrapper">
                            <input className="inputText" onBlur={() => this.editMode({ editMode: false })} type="text" onChange={(event) => this.setState({ value: event.target.value })} value={value} />
                            <i className="fa fa-check" onClick={() => this.editMode({ editMode: false })} aria-hidden="true"></i>
                        </div>
                    }
                </div>
            </div>
        )
    }
}