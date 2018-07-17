import React, { Component } from 'react';
import SelectBox from './../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component';
import ScriptInput from './../../Components/Forms/Components/Script-Input/scriptInput.component';

import { GetUrlParams, Location } from './../../Utils/location.utils';

import { BuildUrlForGetCall, IsObjectHaveKeys } from './../../Utils/common.utils';
import { Get, Put, Post } from './../../Utils/http.utils';
import { GetColumnDetail, ExtractColumnName } from './../../Utils/panel.utils';
import ToastNotifications from '../../Utils/toast.utils';

import { ClientScriptEndPoint } from './../../Constants/api.constants';
import { ROUTE_URL } from './../../Constants/global.constants';

import './clientScript.scene.css';

export default class ClientScript extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...GetUrlParams(this.props), // params, queryString
            clientScript: {}
        };

        this.getClientScript();
    }

    getClientScript = async () => {
        const { id } = this.state.params;

        const apiParams = { includes: 'script,activity_type' };
        let url = ClientScriptEndPoint + id;
        url = BuildUrlForGetCall(url, apiParams);
        const result = await Get({ url, urlPrefix: ROUTE_URL });
        this.clientDataFetched(result);
    }

    clientDataFetched = (result) => {
        if (result.success && result.response) {
            const { response } = result;
            // this.setState({ rule: response });

            const scriptPayload = {
                method: 'edit',
                relationship: { name: response.name },
                modelHash: response.source_type,
                data: { id: response.id }
            };
            this.state.clientScript = response;
            this.state.scriptPayload = scriptPayload;
            // this.setState({ scriptPayload });
            this.getColumnDetail();
        }
    }


    saveClientScript = async (scriptId) => {
        const { clientScript, selectedColumn } = this.state;
        let { active, description, name } = clientScript;
        let url = ClientScriptEndPoint + clientScript.id;

        if (IsObjectHaveKeys(selectedColumn)) {
            const columnName = selectedColumn.name;
            name = name.split('.')[0];
            name += `.${columnName}`;
        } else {
            name = name.split('.')[0];
        }

        let body;

        if (scriptId) {
            body = { script_id: scriptId };
        } else {

            const inlineScriptButton = document.getElementById('submit-script-inline');
            if (inlineScriptButton && !inlineScriptButton.disabled) {
                inlineScriptButton.click();
            }

            body = {
                description, name, active
            }
        }
        const result = await Put({ url, body, urlPrefix: ROUTE_URL });
        if (result.success) {
            ToastNotifications.success({ title: 'Successfully updated' });
            Location.back();
            this.clientDataFetched(result);
        }
    }


    getColumnDetail = async () => {
        const { clientScript, selectedColumn } = this.state;
        const { source_type: sourceType, source_id: sourceId, name } = clientScript;
        if (selectedColumn) {
            return;
        }
        const result = await GetColumnDetail({ sourceType, sourceId });
        if (result.success) {
            const { response } = result;
            const selectedColumn = ExtractColumnName(name, result.response);
            if (IsObjectHaveKeys(selectedColumn)) {
                clientScript.name = clientScript.name.replace('.' + selectedColumn.name, '');
            }

            this.setState({ columns: response, clientScript, selectedColumn });
        }
    }

    scriptOnChange(value) {
        console.log(value);
    }

    setRuleValue = (value, field) => {
        const { clientScript } = this.state;
        clientScript[field] = value;
        this.setState({ clientScript });
    }

    render() {
        // console.log(this.state);
        const { scriptPayload = {}, clientScript, columns, selectedColumn } = this.state;
        const { name = '', script: scriptObj = {} } = clientScript;
        const { script = '', } = scriptObj;
        const { selectedOption } = this.state;

        return (
            <div className='security-rule-container container'>
                {/* <div className="page-bar">
                    <div className="search-bar">
                        Security Rule
                    </div>
                </div> */}

                <div className='body'>
                    <form name='securityRule' className="clientScript">
                        <div className='form-row'>
                            <div className='form-group'>
                                <div className="nameInput inputField">
                                    <label>Name</label>
                                    <input className='form-control' value={name} disabled />
                                </div>
                                <div className="columnInput inputField">
                                    <label>Column</label>
                                    <SelectBox name="form-field-name" onChange={value => this.setState({ selectedColumn: value })} value={selectedColumn} field="name" options={columns} />
                                </div>
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='form-group'>
                                <div className="typeInput inputField">
                                    <label>Type</label>
                                    <input className='form-control' />
                                </div>
                                <div className="activeInput inputField">
                                    <label>Active</label>
                                    <div class="pretty p-default p-thick p-pulse p-bigger">
                                        <input type="checkbox"
                                            value={clientScript.active ? 0 : 1}
                                            checked={clientScript.active ? 1 : 0}
                                            onChange={e => this.setRuleValue(e.target.value == '1' ? 1 : 0, 'active')}
                                        />
                                        <div class="state p-success-o">
                                            <label>&nbsp;</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='form-row'>
                            <div className='form-group'>
                                <div className="descriptionInput">
                                    <label>Description</label>
                                    <textarea
                                        placeholder='enter description'
                                        rows="3"
                                        value={clientScript.description}
                                        onChange={e => this.setRuleValue(e.target.value, 'description')}
                                        className="description"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className='form-row'>
                            <div className='form-group'>
                                {
                                    IsObjectHaveKeys(scriptPayload) &&
                                    <div className="filterCondition col">
                                        <label>Script</label>
                                        <div className="script-wrapper">
                                            <ScriptInput
                                                inline
                                                script={scriptObj.script}
                                                value={scriptObj.id}
                                                payload={scriptPayload}
                                                column={{ name: 'script' }}
                                                onChange={this.scriptOnChange}
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </form>
                    <div className="actions">
                        <button className="btn btn-info" onClick={() => this.closeForm(true)} style={{ margin: '8px' }}>
                            Cancel
                                    </button>
                        <button className="btn btn-success" onClick={() => this.saveClientScript()} style={{ margin: '8px' }}>
                            Save
                        </button>
                    </div>
                </div>
            </div>

        )
    }
}