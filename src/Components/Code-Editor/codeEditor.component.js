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

import { Button } from 'reactstrap';

import SelectBox from './../Forms/Components/Select-Box/selectBox';
import { SelectFromOptions } from './../../Utils/common.utils';
import { Get } from './../../Utils/http.utils';

import 'brace/mode/php';
import 'brace/mode/javascript';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import './codeEditor.css';

import ModalWrapper from './../../Wrappers/Modal-Wrapper/modalWrapper.component';

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

    onChange(newValue) {
        console.log('change', newValue);
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
                // onChange={this.onChange}
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

    modalElement = () => {
        const { isVisible } = this.state;
        return (
            <ModalWrapper
                className='modal-xl'
                isVisible={isVisible}
                modalBody={this.editorComponent}
                modalHeader={this.modalHeader}
                modalFooter={this.modalFooter}
            />
        );
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
            const result = await Get({ url: 'systemScript/' + this.state.scriptId });
            if (result.success) {
                this.setState({ isVisible: true, value: result.response.script });
            }
        } else {
            // Else show plain editor
            this.setState({ isVisible: true });
        }
    }


    onSubmit = () => {

    }

    render() {
        const { buttonComponent } = this.state;
        return (
            <div>
                {
                    buttonComponent ? // @TODO trigger component can be sent from parent component, as of now its not fully functional
                        buttonComponent()
                        :
                        <Button onClick={(e) => this.openEditor(e)} color="primary">Open Editor</Button>
                }

                {this.modalElement()}
            </div>
        )
    }

}