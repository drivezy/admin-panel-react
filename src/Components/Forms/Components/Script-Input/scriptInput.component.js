import React, { Component } from 'react';
import './scriptInput.component.css';
import _ from 'lodash';
import { AceEditor } from 'react-ace';

import { Collapse, Card, CardBody, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { Delete } from './../../../../Utils/http.utils';

import { COLUMN_TYPE } from './../../../../Constants/columnType.constants';

// Custom Components
import CodeEditor from './../../../Code-Editor/codeEditor.component';

export default class ScriptInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            column: this.props.column,
            payload: this.props.payload,
            value: this.props.value || '',
            columns: this.props.columns
        }
    }

    onSubmit = (scriptId = null) => {
        this.setState({ value: scriptId });
        this.props.onChange(scriptId, {});
    }

    toggleModal = () => {
    }

    deleteScript = async () => {
        console.log('deleted');
        this.props.onChange(null, {});
    }

    render() {

        const { payload, column, columns, value } = this.state;

        const { onChange } = this.props;

        return (
            <div className="script-input">
                {

                    ((column.name.indexOf('_id') == -1) && (payload.method == 'edit'))
                        ?
                        <AceEditor
                            mode={column.name}
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
                        :
                        <div className="editor-actions row">

                            <div className="col">
                                {
                                    value ?
                                        <CodeEditor column={column} payload={payload} onSubmit={this.onSubmit} scriptId={value} />
                                        // <CodeEditor onSubmit={this.onSubmit} buttonComponent={() => (<button onClick={() => this.editScript(value)} className="btn btn-secondary">Edit Script</button>)} scriptId={value} />
                                        :
                                        <CodeEditor column={column} payload={payload} onSubmit={this.onSubmit} scriptId={value} />
                                    // <CodeEditor onSubmit={this.onSubmit} buttonComponent={() => (<button onClick={() => this.addScript(value)} className="btn btn-secondary">Add Script</button>)} />
                                }
                            </div>
                            {/* <div className="col">
                                {
                                    value ?
                                        <button className="btn btn-secondary" onClick={() => this.onSubmit()}>
                                            Remove Script
                                        </button>
                                        :
                                        null
                                }

                            </div> */}
                        </div>
                }

            </div>
        )
    }
}



