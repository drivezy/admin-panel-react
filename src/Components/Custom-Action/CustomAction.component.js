import React, { Component } from 'react';
import './CustomAction.css';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { ProcessForm } from './../../Utils/formMiddleware.utils';
import { ProcessPage } from './../../Utils/pageMiddleware.utils';
import { IsUndefined } from './../../Utils/common.utils';

import { CreateUrl, RemoveStarterFromThePath, EvalCondtionForNextActions, GetFormContent } from './../../Utils/generic.utils';
// import { IsUndefinedOrNull } from './../../Utils/common.utils';

// import FormCreator from './../Form-Creator/formCreator.component';

import SelectBox from './../Forms/Components/Select-Box/selectBoxForGenericForm.component';

// import ModalHeader from './../../Wrappers/Modal-Wrapper/templates/Modal-Header/modalHeader.component'
// import ModalFooter from './../../Wrappers/Modal-Wrapper/templates/Modal-Footer/modalFooter.component';

import CustomTooltip from '../Custom-Tooltip/customTooltip.component';
import _ from 'lodash';

let customMethods = {};

/**
 * Returns custom actions according to placement
 * displays dropdown ui actions
 */
export default class CustomAction extends Component {
    methods = {};
    constructor(props) {
        super(props);
        const actions = [...this.getFilteredActions(props)];
        this.state = {
            actions,
            placement: props.placement,
            dropdownOpen: false,
            genericData: props.genericData
        };
    }

    UNSAFE_componentWillReceiveProps = (nextProps = {}) => {
        const actions = [...this.getFilteredActions(nextProps)];
        this.setState({ genericData: this.props.genericData, actions });
    }

    getFilteredActions = ({ ...props }) => {
        let { actions } = props;
        const placement = props.placement || 'as_record';
        if (Array.isArray(actions)) {
            return actions.filter(action => action[placement]);
        }
        return [];
    }

    /**
     * toggle filter dropdown and re-initialise searchtext to empty
     */
    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
            searchText: ''
        });
    }

    callFunction = ({ action, listingRow }) => {
        const args = [];
        const { genericData, history, callback, source = 'model', menuDetail: menuDetailOriginal = {}, parentData = {} } = this.props;
        this.genericData = genericData;

        let menuDetail = { ...menuDetailOriginal }; // inorder to avoid double binding, which affects parent state menuDetail
        if (source == 'model') { // dont send restricted query for model
            delete menuDetail.restricted_query;
        }
        const data = RemoveStarterFromThePath({ data: listingRow, starter: genericData.starter });

        action.callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : callback) : callback;
        if (action.form_id) {
            genericData.preDefinedmethods.customForm({ action, listingRow: data, genericData, history, menuDetail, parent: parentData });
        } else if (action.execution_script) {
            // const pageContent = {
            //     data,
            //     parent: parentData,
            //     execution_script: action.execution_script
            // }

            let pageContent = GetFormContent({ action, listingRow: data, genericData, history, source, menuDetail, parent: parentData });
            pageContent = { ...pageContent, ...{ execution_script: action.execution_script } };
            ProcessPage({ pageContent });
            // script evaluation goes here
        } else if (typeof genericData.preDefinedmethods[action.identifier] == "function") {
            genericData.preDefinedmethods[action.identifier]({ action, listingRow: data, genericData, history, source, menuDetail, parent: parentData });
        } else {
            alert("The ui action " + action.id + " is not configued properly");
        }
        // if (genericData.methods && typeof genericData.methods[action.name] == "function") {
        //     // var callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : customMethods[action.callback]) : listing.callbackFunction.function;

        //     const callbackMethod = (action.callback && typeof genericData.methods[action.callback] == "function") ? genericData.methods[action.callback] : callback;
        //     const args = ConvertDependencyInjectionToArgs.call(this, action.dependency);
        //     args.reverse();
        //     args.push(callbackMethod);
        //     action.placement_id == 167 ? args.push(listingRow) : args.push("");
        //     args.reverse();

        //     genericData.methods[action.name].apply(this, args);
        // } else { // For add, edit,delete
        //     action.callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : callback) : callback;
        //     if (typeof genericData.preDefinedmethods[action.name] == "function") {
        //         genericData.preDefinedmethods[action.name]({ action, listingRow, genericData, history, source });
        //     }
        // }
    }
    /**
     * takes value in the search box and filter actions
     * @param  {object} {target={}
     * @param  {string} value}={}
     */
    searchFilter = ({ target = {}, value } = {}) => {
        const searchText = IsUndefined(value) ? target.value : '';
        const { actions = [] } = this.state;

        const filteredUserFilter = actions.filter(action => action.name.toLowerCase().includes(searchText.toLowerCase()));
        this.setState({ searchText: target.value, filteredUserFilter });
    }

    render() {
        const { listingRow = [], genericData = {}, placement = 'as_record', menuDetail = {}, position } = this.props;
        const { actions = [] } = this.state;
        let sortActions = this.state.actions;
        let sortedActions = _.orderBy(actions, 'display_order', 'asc')

        let filteredActions = sortedActions;

        // filteredActions = sortActions.filter((action) => action[placement] && placement == 'as_dropdown');
        // sortedActions = sortActions.filter((action) => action[placement] && placement != 'as_dropdown');
        const { filteredUserFilter, searchText } = this.state;
        const filters = searchText ? filteredUserFilter : filteredActions;

        if (placement == 'as_dropdown') {
            return (
                <div className='custom-actions flex'>
                    {
                        (filteredActions.length > 0) ?
                            <Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                <DropdownToggle caret
                                    className='dropdown-button'
                                    color="secondary"
                                    onClick={this.toggle}
                                    data-toggle="dropdown"
                                    aria-expanded={this.state.dropdownOpen}
                                >
                                    Actions
                            </DropdownToggle>
                                <DropdownMenu className="dropdown-menu custom-click pull-right menu-operations" right>
                                    {
                                        filteredActions.length > 1 ?
                                            <div>
                                                <div className="form-group has-feedback">
                                                    <input value={searchText} onChange={this.searchFilter} type="text" className="form-control" id="search-operation" placeholder='Search Actions' />
                                                    {/* <i onClick={() => searchText ? this.searchFilter({ value: null }) : null} className={`fa fa-${searchText ? 'times-circle cursor-pointer' : 'search'} form-control-feedback`} aria-hidden="true"></i> */}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        filters.map((action, key) => {
                                            const filterScript = action.filter_condition ? action.filter_condition.script : null;
                                            const isDisabled = !EvalCondtionForNextActions(filterScript, listingRow, genericData.starter);
                                            if (isDisabled) {
                                                return null;
                                            }
                                            return (
                                                <div className='menu-item' key={key} role="menuitem">
                                                    <a className="menu-link">
                                                        <span className="badge" onClick={() => { this.callFunction({ action, listingRow }) }}>
                                                            <i className={`fa ${action.image}`}></i>
                                                            &nbsp;
                                                            &nbsp;
                                                            {action.name}
                                                        </span>
                                                    </a>
                                                </div>
                                            )
                                        }
                                        )
                                    }
                                </DropdownMenu>
                            </Dropdown>
                            : null
                    }
                </div>
            )
        } else {
            return (
                <div className="custom-actions flex">
                    {
                        sortedActions.map((action, key) => {
                            if (!action) {
                                return null;
                            }

                            const filterScript = action.filter_condition ? action.filter_condition.script : null;
                            const isDisabled = !EvalCondtionForNextActions(filterScript, listingRow, genericData.starter);
                            if (action[placement]) {
                                const html =
                                    <span className={`button-element ${isDisabled ? 'disabled-action' : ''}`} onClick={() => { this.callFunction({ action, listingRow }) }}>
                                        <i className={`fa ${action.image}`}></i>

                                        {/* Temporaririly fix to hide the name for row actions */}
                                        {/* {
                                            ((action.placement_id == 168) || (position == 'header')) && <span className="action-label">
                                                {action.name}
                                            </span>
                                        } */}
                                    </span>

                                // </button>
                                return (
                                    <CustomTooltip placement="top" key={key} html={html} title={action.name}></CustomTooltip>
                                );
                            }
                        })
                    }
                </div>
            )
        }
    }
}
