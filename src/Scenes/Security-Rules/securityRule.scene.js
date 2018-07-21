import React, { Component } from 'react';

import { GetUrlParams, Location, ToastNotifications, ModalManager } from 'drivezy-web-utils/build/Utils';
import { Get, Put, Post, Delete, BuildUrlForGetCall, IsObjectHaveKeys } from 'common-js-util';

import ScriptInput from './../../Components/Forms/Components/Script-Input/scriptInput.component';
import SelectBox from './../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component';
import ReferenceInput from './../../Components/Forms/Components/Reference-Input/referenceInput';

import { GetColumnDetail, ExtractColumnName } from './../../Utils/panel.utils';

import { SecurityRuleEndPoint } from './../../Constants/api.constants';
import { ROUTE_URL } from './../../Constants/global.constants';


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
        const apiParams = { includes: 'roles.role,script' };

        let url = SecurityRuleEndPoint + id;
        url = BuildUrlForGetCall(url, apiParams);
        const result = await Get({ url, urlPrefix: ROUTE_URL });
        this.ruleDataFetched(result);
    }

    ruleDataFetched = (result) => {
        if (result.success && result.response) {
            const { response } = result;
            // this.setState({ rule: response });

            const scriptPayload = {
                // method: 'edit',
                relationship: { name: response.name },
                modelHash: response.source_type,
                data: { id: response.id }
            };

            this.state.rule = response;
            this.state.scriptPayload = scriptPayload;
            this.getColumnDetail();
        }
    }

    getColumnDetail = async () => {
        const { rule, selectedColumn } = this.state;
        const { source_type: sourceType, source_id: sourceId, name } = rule;

        if (selectedColumn) {
            return;
        }
        const result = await GetColumnDetail({ sourceType, sourceId });


        if (result.success) {
            const { response } = result;
            const selectedColumn = ExtractColumnName(name, result.response);
            if (IsObjectHaveKeys(selectedColumn)) {
                rule.name = rule.name.replace('.' + selectedColumn.name, '');
            }

            this.setState({ columns: response, selectedColumn, rule });
        }
    }

    saveRule = async (scriptId) => {
        const { rule, selectedColumn } = this.state;
        let { filter_condition, name } = rule;
        let url = SecurityRuleEndPoint + rule.id;

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
                filter_condition, name
            }
        }
        const result = await Put({ url, body, urlPrefix: ROUTE_URL });
        if (result.success) {
            ToastNotifications.success({ title: 'Successfully updated' });
            Location.back();
            this.ruleDataFetched(result);
        }

    }

    removeRole = async (id) => {
        const { role, rule } = this.state;
        const { source_id, source_type } = rule;

        const result = await Delete({ url: `api/record/roleAssignment/${id}`, urlPrefix: ROUTE_URL });
        if (result.success) {
            ToastNotifications.success({ title: 'Successfully deleted role' });
            if (!(Array.isArray(rule.roles) && rule.roles.length)) {
                return;
            }
            rule.roles = rule.roles.filter(role => id != role.id);
            this.setState({ rule });
        }
    }

    setRole = async () => {
        const { role, rule } = this.state;
        const { source_id, source_type } = rule;

        if (!IsObjectHaveKeys(role)) {
            ToastNotifications.error({ title: 'Error', description: 'Please select role first' });
            return;
        }
        const { id: roleId } = role;

        const result = await Post({ url: 'api/record/roleAssignment', body: { source_id, source_type, role_id: roleId }, urlPrefix: ROUTE_URL });
        if (result.success) {
            rule.roles.push(result.response);
            this.setState({ rule });
            ToastNotifications.success({ title: 'Successfully added role' });
            ModalManager.closeModal();
        }
    }

    setRuleValue = (value, field) => {
        const { rule } = this.state;
        rule[field] = value;
        this.setState({ rule });
    }

    renderAddRoleComponent = () => {
        const column = { display_name: 'Add Role', route: 'api/record/role', name: 'role' };
        const { role } = this.state;
        return (
            <div>
                <div className='modal-body'>
                    <ReferenceInput column={column} name={column.name}
                        placeholder={`Enter ${column.display_name}`}
                        // onChange={props.setFieldValue}
                        field='name'
                        isClearable={!column.required}
                        onChange={(value, event) => {
                            this.setState({ role: value });
                        }}
                        // onChange={({ ...args }) => { FormUtils.OnChangeListener(args); props.setFieldValue(args); }}
                        value={role}
                    />
                </div>
                <div className="modal-footer">
                    <div className="modal-actions row justify-content-end">

                        {/* <button className="btn btn-warning" onClick={handleReset}>
                        Reset
                    </button> */}

                        {/* <button className="btn btn-primary">
                        Cancel
                    </button> */}

                        <button className="btn btn-success" onClick={this.setRole} type="submit">
                            Submit
                    </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { columns, rule, selectedColumn, scriptPayload } = this.state;
        const { name = '' } = rule;
        const scriptObj = rule.script || {};
        const { script = '' } = scriptObj;

        return (
            <div className='security-rule-container'>
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
                                <div className="descriptionInput">
                                    <label>Filter Condition</label>
                                    <textarea
                                        placeholder='Enter Filter Condition'
                                        rows="3"
                                        value={rule.filter_condition || ''}
                                        onChange={e => this.setRuleValue(e.target.value, 'filter_condition')}
                                        className="description"
                                    />
                                    {/* <input className='form-control'
                                        value={rule.filter_condition}
                                        onChange={e => this.setRuleValue(e.target.value, 'filter_condition')}
                                        placeholder="Enter Filter Condition"
                                    /> */}

                                </div>
                            </div>
                        </div>


                        <div className='form-row'>
                            <div className='form-group'>
                                {
                                    IsObjectHaveKeys(scriptPayload) &&
                                    <div className="filterCondition col">
                                        <label>Script</label>
                                        <ScriptInput
                                            inline
                                            script={scriptObj.script}
                                            value={scriptObj.id}
                                            payload={scriptPayload}
                                            column={{ name: 'script' }}
                                            onChange={this.saveRule}
                                        />
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='form-row'>
                            <div className='form-group'>
                                <div className="roles">
                                    <div className="roles-header">
                                        <label>Roles</label>
                                        <br />
                                        <button className="btn btn-sm btn-secondary" onClick={(e) => {
                                            e.preventDefault();
                                            ModalManager.openModal({
                                                headerText: 'Roles',
                                                modalBody: this.renderAddRoleComponent
                                                // modalBody: () => <div>
                                                //     {/* <SelectBox
                                                //         onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'selectValue' })}
                                                //         value={selectedOption}
                                                //         field="Name"
                                                //         placeholder="Select Roles"
                                                //         getOptions={(input) => this.getInputRecord({ input, parentIndex, childIndex })}
                                                //     /> */}
                                                // </div>
                                            })
                                        }}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>

                                    {
                                        rule.roles ?
                                            <div className="roles-body">
                                                {
                                                    rule.roles.map((role, key) => (

                                                        <div className="role" key={key}>
                                                            <div className="role-name">
                                                                {role.id}
                                                            </div>
                                                            <div className="role-action">
                                                                <button className="btn btn-sm" onClick={(e) => {
                                                                    e.preventDefault();
                                                                    this.removeRole(role.id)
                                                                }}><i className="fa fa-times" aria-hidden="true"></i></button>
                                                            </div>
                                                        </div>

                                                    ))
                                                }
                                            </div> : <div>Loading Roles</div>
                                    }

                                </div>
                            </div>
                        </div>

                    </form>
                    <div className="actions">
                        <button className="btn btn-info" onClick={() => this.closeForm(true)} style={{ margin: '8px' }}>
                            Cancel
                                    </button>
                        <button className="btn btn-success" onClick={() => this.saveRule()} style={{ margin: '8px' }}>
                            Save
                                    </button>
                    </div>
                </div>
            </div>

        )
    }
}