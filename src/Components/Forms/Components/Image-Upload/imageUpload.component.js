

import React, { Component } from 'react';

import './imageUpload.component.css';

import GLOBAL from './../../../../Constants/global.constants'

import Dropzone from 'react-dropzone';
import { IsUndefined } from 'common-js-util/build/common.utils';

export default class ImageUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file: {}
        }
    }

    onSelect = acceptedFiles => {
        if (this.props.onSelect) {
            // this.props.onSelect('file', acceptedFiles[0]);
            const res = this.props.onSelect(this.props.name, acceptedFiles[0]);
            if (res === false) {
                return;
            }
            this.setState({ file: acceptedFiles[0] });
        }
    }

    removeFile = () => {
        const file = {};
        this.setState({ file });

        if (this.props.onRemove) {
            this.props.onRemove(this.props.name);
        }
    }

    render() {
        const { file } = this.state;
        return (
            <div className="image-upload">
                <Dropzone className="drop-zone btn btn-outline-primary" onDrop={this.onSelect} >
                    Select
                </Dropzone>

                {/* Uploaded File */}
                {
                    file.name &&
                    <div className="uploaded-file">
                        <span className="file-label">
                            {this.props.name} : {file.name}
                        </span>
                        <span className="close-icon" onClick={() => this.removeFile()}>
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </div>
                }
                {/* Uploaded File Ends */}
            </div>
        );
    }
}