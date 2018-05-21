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
            value: props.value || ''
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
                <div className='code-title padding-left-10'>
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


    modalElement = () => {
        const { isVisible } = this.state;
        return (
            <ModalWrapper
                className='modal-xl'
                isVisible={isVisible}
                modalBody={this.editorComponent}
                modalHeader={this.modalHeader}
            />
        );
    }

    render() {
        const { buttonComponent } = this.state;
        return (
            <div>
                {
                    buttonComponent ? // @TODO trigger component can be sent from parent component, as of now its not fully functional
                        buttonComponent()
                        :
                        <Button onClick={() => this.setState({ isVisible: true })} color="primary">Open Editor</Button>
                }

                {this.modalElement()}
            </div>
        )
    }

}