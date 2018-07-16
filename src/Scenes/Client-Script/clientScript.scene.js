import React, { Component } from 'react';
import SelectBox from './../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component';
import ScriptInput from './../../Components/Forms/Components/Script-Input/scriptInput.component';

import { GetUrlParams, Location } from './../../Utils/location.utils';

import { BuildUrlForGetCall, IsObjectHaveKeys } from './../../Utils/common.utils';
import { Get, Put, Post } from './../../Utils/http.utils';
import { GetColumnDetail } from './../../Utils/panel.utils';

import { ClientScriptEndPoint } from './../../Constants/api.constants';
import { ROUTE_URL } from './../../Constants/global.constants';

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
        if (result.success && result.response) {
            const { response } = result;
            // this.setState({ rule: response });

            const scriptPayload = {
                // method: 'edit',
                relationship: { name: response.name },
                modelHash: response.source_type,
                data: { id: response.id }
            };
            this.state.clientScript = response;
            this.state.scriptPayload = scriptPayload;
            this.setState({ scriptPayload });
            // this.getColumnDetail();
        }
    }

    getColumnDetail = async () => {
        const { clientScript } = this.state;
        const { source_type: sourceType, source_id: sourceId } = clientScript;
        const result = await GetColumnDetail({ sourceType, sourceId });
        if (result.success) {
            const { response } = result;
            this.setState({ columns: response });
        }
    }

    scriptOnChange(value) {
        console.log(value);
    }

    render() {
        console.log(this.state);
        const { scriptPayload = {}, clientScript } = this.state;
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
                    <form name='securityRule'>
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
                                {
                                    IsObjectHaveKeys(scriptPayload) &&
                                    <div className="filterCondition">
                                        <label>Script</label>
                                        <ScriptInput
                                            value={scriptObj.id}
                                            payload={scriptPayload}
                                            column={{ name: 'script' }}
                                            onChange={this.scriptOnChange}
                                        />
                                    </div>
                                }

                                <div className="columnInput">
                                    <label>Column</label>
                                    <SelectBox name="form-field-name" onChange={this.handleChange} value={selectedOption} field="name" options={[{ name: "True", id: 1 }, { name: "False", id: 0 }]} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        )
    }
}