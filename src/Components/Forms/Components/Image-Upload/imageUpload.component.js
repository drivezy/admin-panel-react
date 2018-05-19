

import React, { Component } from 'react';

import './imageUpload.component.css';

import GLOBAL from './../../../../Constants/global.constants'

import Dropzone from 'react-dropzone'

export default class imageUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    onSelect = acceptedFiles => {
        if (this.props.onSelect) {
            // this.props.onSelect('file', acceptedFiles[0]);
            this.props.onSelect(this.props.name, acceptedFiles[0]);
        }
    }

    componentWillReceiveProps = (nextProps) => {
    }

    render() {
        return (
            <div className="image-upload">
                {/* className="drop-zone" */}
                <Dropzone className="drop-zone btn btn-outline-primary" onDrop={this.onSelect} >
                    Select
                </Dropzone>
            </div>
        );
    }
}