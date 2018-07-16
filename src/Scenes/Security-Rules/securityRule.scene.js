import React, { Component } from 'react';
import { GetUrlParams, Location } from './../../Utils/location.utils';
import { Get, Put } from './../../Utils/http.utils';
import { BuildUrlForGetCall } from '../../Utils/common.utils';
import { GetColumnDetail } from './../../Utils/panel.utils';

import { SecurityRuleEndPoint } from './../../Constants/api.constants';
import { ROUTE_URL } from './../../Constants/global.constants';

import SelectBox from './../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component';
import AceEditor from 'react-ace';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';

import './securityRule.scene.css';

export default class SecurityRule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            rule: {}
        };

    }

    componentDidMount() {
        this.getSecurityDetail();
    }

    getSecurityDetail = async () => {
        const { id } = this.state.params;
        const apiParams = { includes: 'roles,script' };

        let url = SecurityRuleEndPoint + id;
        url = BuildUrlForGetCall(url, apiParams);
        const result = await Get({ url, urlPrefix: ROUTE_URL });
        if (result.success && result.response) {
            const { response } = result;
            // this.setState({ rule: response });
            this.state.rule = response;
            this.getColumnDetail();
        }
    }

    getColumnDetail = async () => {
        const { rule } = this.state;
        const { source_type: sourceType, source_id: sourceId } = rule;
        const result = await GetColumnDetail({ sourceType, sourceId });
        if (result.success) {
            const { response } = result;
            this.setState({ columns: response });
        }
    }

    render() {
        console.log(this.state);
        const { name = '', script: scriptObj = {} } = this.state.rule;
        const { script } = scriptObj;
        const { selectedOption } = this.state;

        return (
            <div className='security-rule-container'>
                {/* <div className="page-bar">
                    <div className="search-bar">
                        Security Rule
                    </div>
                </div> */}

                <div className='body'>
                    <form name='securityRule' className="securityRule">
                        <div className='form-row'>
                            <div className='form-group'>
                                <div className="nameInput">
                                    <label>Name</label>
                                    <input className='form-control' value={name} disabled />
                                </div>
                                <div className="columnInput">
                                    <label>Column</label>
                                    <SelectBox name="form-field-name" onChange={this.handleChange} value={selectedOption} field="name" options={[{ name: "True", id: 1 }, { name: "False", id: 0 }]} />
                                </div>
                            </div>
                        </div>

                        <div className='form-row'>
                            <div className='form-group-body'>
                                <div className="filterCondition">
                                    <label>Filter Condition</label>
                                    <input className='form-control' placeholder="Enter Filter Condition" />
                                </div>
                                <br />
                                <div className="scriptInput">
                                    <label>Script</label>
                                    <AceEditor
                                        // mode={mode.value}
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
                                        // value={value}
                                        setOptions={{
                                            enableBasicAutocompletion: true,
                                            enableLiveAutocompletion: true,
                                            enableSnippets: false,
                                            showLineNumbers: true,
                                            tabSize: 2,
                                        }}
                                    />
                                </div>
                                <br />
                                <div className="Roles">
                                    <label>Roles</label>
                                    <br />
                                    <button className="btn btn-sm btn-secondary" onClick={(e) => {
                                        e.preventDefault();
                                        ModalManager.openModal({
                                            headerText: 'Roles',
                                            modalBody: () => <div>
                                                {/* <SelectBox
                                                    onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'selectValue' })}
                                                    value={selectedOption}
                                                    field="Name"
                                                    placeholder="Select Roles"
                                                    getOptions={(input) => this.getInputRecord({ input, parentIndex, childIndex })}
                                                /> */}
                                            </div>
                                        })
                                    }}><i className="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        <div className="actions">
                            <button className="btn btn-info" onClick={() => this.closeForm(true)} style={{ margin: '8px' }}>
                                Cancel
                                    </button>
                            <button className="btn btn-success" onClick={this.submit} style={{ margin: '8px' }}>
                                Save
                                    </button>
                        </div>
                    </form>
                </div>
            </div >
        )
    }
}
