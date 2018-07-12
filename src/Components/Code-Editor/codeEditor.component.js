/**
 * Opens code editor in modal 
 * https://github.com/securingsincity/react-ace is used for code editor
 * Supports javascript, php, sql, css
 * 
 * Accepts value, mode, isVisible props 
 */

import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import SelectBox from './../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import { SelectFromOptions } from './../../Utils/common.utils';
import { Get, Post, Put } from './../../Utils/http.utils';

import 'brace/mode/php';
import 'brace/mode/javascript';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import './codeEditor.css';

import ModalWrapper from './../../Wrappers/Modal-Wrapper/modalWrapper.component';
import { RECORD_URL } from './../../Constants/global.constants';

const MODES = [{ id: 1, value: 'javascript', name: 'Javascript' }, { id: 2, name: 'PHP', value: 'php' }, { id: 3, name: 'CSS', value: 'css' }, { id: 4, name: 'SQL', value: 'sql' }];
export default class CodeEditor extends Component {
    constructor(props) {
        super(props);

        const mode = SelectFromOptions(MODES, props.mode, 'value');
        this.state = {
            isModalVisible: true,
            mode,
            value: props.value || '',
            scriptId: props.scriptId || ''
        }
    }

    UNSAFE_componentWillReceivePropscomponentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value || '' });
    }

    onChange = (newValue) => {
        this.setState({ value: newValue });

    }

    editorComponent = () => {
        const { mode, value } = this.state;
        return (
            <AceEditor
                mode={mode.value}
                theme="monokai"
                name="Drivezy-Code-editor"
                width='100%'
                height='85vh'
                // onLoad={this.onLoad}
                onChange={this.onChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={value}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
        )
    }

    modalHeader = () => {
        const { mode } = this.state;
        return (
            <div className='flex code-editor-header'>
                <div className='code-title'>
                    Code editor
                </div>

                <div className='select-box-container flex'>
                    <div sm={2} className='mode-selection'>
                        <SelectBox
                            onChange={(data) => this.setState({ mode: data })}
                            value={mode}
                            options={MODES}
                            placeholder="Mode"
                            field='name'
                        />
                    </div>
                </div>
            </div>
        )
    }

    modalFooter = () => {
        return (
            <div className="modal-footer row justify-content-space-between">
                <div className="col">
                </div>
                <div className="col">
                    {/* <Button color="secondary" onClick={handleReset}>
                        Clear
                    </Button> */}
                    <button className="btn btn-primary" type="button" onClick={this.onSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        )
    }

    toggleModal = () => {
        this.setState({ isVisible: !this.state.isVisible });
        // this.setState({ modal: !this.state.modal, activeColumn: {} })
    }

    modalElement = () => {
        const { isVisible } = this.state;
        return (
            <Modal className='modal-xl' isOpen={isVisible} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                    {this.modalHeader()}
                </ModalHeader>

                <ModalBody>
                    {this.editorComponent()}
                </ModalBody>

                <ModalFooter>
                    {this.modalFooter()}
                </ModalFooter>

            </Modal>
        )
        // return (
        //     <ModalWrapper
        //         className='modal-xl'
        //         isVisible={isVisible}
        //         modalBody={this.editorComponent}
        //         modalHeader={this.modalHeader}
        //         modalFooter={this.modalFooter}
        //     />
        // );
    }

    loadScript = async (scriptId) => {
        const result = await Get({ url: 'systemScript/' + scriptId, urlPrefix: RECORD_URL });
        if (result.success) {
            this.setState({ scriptId: scriptId, isVisible: true, value: result.response.script || '' });
        }
    }

    // Open the editor
    openEditor = async (event) => {

        // If meta key or ctrl is pressed , open in new editor
        if ((event.metaKey || event.ctrlKey)) {
            // window.open(location.origin + "/codeEditor/" + this.state.scriptId, "_blank");
            return false;
        }

        // If there is script id , load it
        if (this.state.scriptId) {
            this.loadScript(this.state.scriptId);
        } else {
            // Else show plain editor
            // Create a Dummy script
            const { payload, column } = this.props;

            // Assign the name to the
            const name = payload.relationship.related_model ? payload.relationship.related_model.name : payload.relationship.name;

            var params = {
                name: name + ' Script',
                description: name + " Script for " + '',
                source_type: payload.modelHash,
                // source_type: 'Drivezy\\LaravelRecordManager\\Models\\ModelRelationship',
                // source_type: name,
                source_id: payload.data.id,
                source_column: column.name
            }

            const result = await Post({ url: 'systemScript', body: params, urlPrefix: RECORD_URL });

            if (result.success) {

                this.props.onSubmit(result.response.id, {});
                this.setState({ scriptId: result.response.id });
                // this.loadScript(result.response.id);
            }
        }
    }


    onSubmit = async () => {

        const { payload, column } = this.props;

        // const params = {
        //     script: this.state.value,
        //     script_type: '',
        //     name: '',
        //     description: ''
        // }

        // Assign the name to the
        const name = payload.relationship.related_model ? payload.relationship.related_model.name : payload.relationship.name;

        var params = {
            name: name + ' Script',
            script: this.state.value,
            description: name + " Script for " + '',
            source_type: name,
            source_id: payload.data.id,
            source_column: column.name
        }

        if (this.state.scriptId) {

            const result = await Put({ url: 'systemScript/' + this.state.scriptId, body: params, urlPrefix: RECORD_URL })
            if (result.success) {
                this.setState({ isVisible: false });
            }
        } else {

            const result = await Post({ url: 'systemScript', body: params, urlPrefix: RECORD_URL })
            if (result.success) {
                this.setState({ isVisible: false });

            }
        }
    }

    render() {
        const { buttonComponent } = this.props;
        return (
            <div>
                <div className="col inline">
                    {
                        buttonComponent ? // @TODO trigger component can be sent from parent component, as of now its not fully functional
                            // buttonComponent()
                            <Button onClick={(e) => this.openEditor(e)} color="danger">Edit Script</Button>
                            :
                            <Button onClick={(e) => this.openEditor(e)} color="primary">{this.state.scriptId ? 'Edit' : 'Add'} Script</Button>
                    }
                </div>

                <div className="col inline">
                    {
                        this.state.scriptId ?
                            <button className="btn btn-secondary" onClick={() => { this.setState({ scriptId: null }); this.props.onSubmit(null, {})}}>
                                Remove Script
                            </button>
                            :
                            null
                    }

                </div>

                {this.modalElement()}
            </div>
        )
    }

}