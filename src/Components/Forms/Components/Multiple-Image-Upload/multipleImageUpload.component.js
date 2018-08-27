

import React, { Component } from 'react';
import SelectBox from './../Select-Box/selectBoxForGenericForm.component';
import DatePicker from './../Date-Picker/datePicker';

import { GetLookupValues } from './../../../../Utils/lookup.utils';
import './multipleImageUpload.component.css';
import Dropzone from 'react-dropzone';

import { ModalManager } from 'drivezy-web-utils/build/Utils';
import { MultipleUpload } from './../../../../Utils/upload.utils';

import { ROUTE_URL } from './../../../../Constants/global.constants';

export default function MultiUpload({ title, column }) {
    ModalManager.openModal({
        className: 'generic-form-container',
        headerText: title || 'Multiple Upload',
        modalBody: () => (<ImageUpload column={column} onSubmit={val => console.log(val)} />),
    });
}

class ImageUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            lookupOptions: []
        }
        this.getLookupValue();
    }

    getLookupValue = async () => {
        const result = await GetLookupValues(49);
        if (result.success) {
            this.setState({ lookupOptions: result.response });
        }
    }

    onSelect = acceptedFiles => {
        let { files } = this.state;
        files = [...files, ...acceptedFiles];

        if (this.props.onSelect) {
            this.props.onSelect(this.props.name, files);
        }
        this.setState({ files });
    }

    getFileSizeInMB(file) {
        if (!(file && typeof file == 'object')) {
            return 0;
        }
        return (file.size / (1024 * 1024)).toFixed(2);
    }

    removeFile = (index) => {
        const { files } = this.state;
        files.splice(index, 1);
        this.setState({ files });
        if (this.props.onSelect) {
            this.props.onSelect(this.props.name, files);
        }
        // if (this.props.onRemove) {
        //     this.props.onRemove(this.props.name);
        // }
    }

    uploadFiles = () => {
        const { dontUpload, onSubmit, column, source = 'booking', sourceId = '364207' } = this.props;
        const { files } = this.state;
        if (!onSubmit) {
            this.closeModal();
            return;
        }
        if (dontUpload) {
            onSubmit(files);
            this.closeModal();
            return;
        }
        if (files && files.length) {
            const data = { source: source, source_id: parseInt(sourceId), files: [] };
            files.forEach(file => {
                if (!file.uploaded) {
                    const obj = {
                        file,
                        type: file.imgType,
                        expiry: file.expiry
                    };
                    data.files.push(obj);
                }
            });

            MultipleUpload(data).then(result => {
                if (result.response) {
                    onSubmit(column, result);
                    this.closeModal();
                }
            });
        }
    }

    closeModal() {
        ModalManager.closeModal();
    }

    render() {
        const { files, lookupOptions } = this.state;
        return (
            <div className='modal-body-card'>
                <div className="image-upload image-upload-multi">
                    <div className='upload-'>
                        <Dropzone className="drop-zone-multi btn btn-outline-primary1" onDrop={this.onSelect} >
                            <img src={require('./../../../../Assets/images/Group.svg')} />
                            Choose Files to Upload
                        </Dropzone>
                    </div>

                    {
                        Array.isArray(files) && files.length ?
                            files.map((file, key) => {
                                return (
                                    <div key={key} className='file-container vertical-center'>
                                        <div className="file-progress">
                                            <div className="file-name ng-binding">
                                                {file.name}
                                            </div>
                                            <div className="file-size ng-binding">
                                                {this.getFileSizeInMB(file)} MB
                                        </div>
                                        </div>


                                        <div className='file-type flex'>
                                            <SelectBox selectClass='width-100'
                                                onChange={(value) => {
                                                    let { files } = this.state;
                                                    files[key].imgType = value.id;
                                                    this.setState({ files });
                                                }}
                                                value={file.imgType} field="value" options={lookupOptions} />
                                        </div>

                                        <div className='file-expiry'>
                                            <DatePicker
                                                single
                                                placeholder='Expiry date'
                                                onChange={(name, value) => {
                                                    let { files } = this.state;
                                                    files[key].expiry = value;
                                                    this.setState({ files })
                                                }}
                                                value={file.expiry}
                                            />
                                        </div>

                                        <div className="file-delete">
                                            <span className="delete-button" onClick={() => this.removeFile(key)}>
                                                <i className="fa fa-times" ></i>
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            null
                    }
                </div >

                <div className='modal-footer'>
                    <div>
                        <button type="button" className="btn btn-secondary" onClick={this.closeModal.bind(this)}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={this.uploadFiles.bind(this)}>Upload</button>
                    </div>
                </div>
            </div>
        );
    }
}