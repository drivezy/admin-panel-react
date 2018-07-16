import React, { Component } from 'react';
import { GetUrlParams, Location } from './../../Utils/location.utils';
import { Get, Put } from './../../Utils/http.utils';
import { BuildUrlForGetCall } from '../../Utils/common.utils';

import { SecurityRuleEndPoint, ColumnsEndPoint } from './../../Constants/api.constants';
import { ROUTE_URL } from './../../Constants/global.constants';

import SelectBox from './../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component';

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
        const apiParams = { query: `source_type='${sourceType}' and source_id=${sourceId}` }
        const url = BuildUrlForGetCall(ColumnsEndPoint, apiParams);
        const result = await Get({ url, urlPrefix: ROUTE_URL });
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
                                <div className="filterCondition">
                                    <label>Filter Condition</label>
                                    <input className='form-control' value={name} placeholder="Enter Filter Condition"/>
                                </div>
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
