import React, { Component } from 'react';
import './scriptInput.component.css';
import _ from 'lodash';
import { AceEditor } from 'react-ace';

import { SelectFromOptions } from 'common-js-util';

// Custom Components
import CodeEditor from './../../../Code-Editor/codeEditor.component';

const MODES = [{ id: 1, value: 'javascript', name: 'Javascript' }, { id: 2, name: 'PHP', value: 'php' }, { id: 3, name: 'CSS', value: 'css' }, { id: 4, name: 'SQL', value: 'sql' }];
export default class ScriptInput extends Component {

    constructor(props) {
        super(props);

        const mode = SelectFromOptions(MODES, props.mode, 'value');
        this.state = {
            column: this.props.column,
            mode,
            payload: this.props.payload,
            value: this.props.value || '',
            script: props.script,
            columns: this.props.columns,
            inline: props.inline
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

        const { payload, column, columns, value, script, mode } = this.state;
        const { onChange, inline } = this.props;

        return (
            <div className="script-input">
                {

                    ((column.name.indexOf('_id') == -1) && (payload.method == 'edit') && 1==2)
                        ?
                        <AceEditor
                            mode={mode.value}
                            theme="monokai"
                            name="Drivezy-Code-editor"
                            width='100%'
                            height='85vh'
                            // onLoad={this.onLoad}
                            onChange={(script) => this.setState({ script })}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={script}
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
                                        <CodeEditor inline={inline} column={column} payload={payload} onSubmit={this.onSubmit} scriptId={value} script={script} />
                                        // <CodeEditor onSubmit={this.onSubmit} buttonComponent={() => (<button onClick={() => this.editScript(value)} className="btn btn-secondary">Edit Script</button>)} scriptId={value} />
                                        :
                                        <CodeEditor inline={inline} column={column} payload={payload} onSubmit={this.onSubmit} scriptId={value} script={script}/>
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



