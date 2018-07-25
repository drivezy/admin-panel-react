import React, { Component } from 'react';
import './CustomAction.css';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { ProcessForm } from './../../Utils/formMiddleware.utils';
import { ProcessPage } from './../../Utils/pageMiddleware.utils';

import { CreateUrl, ConvertDependencyInjectionToArgs, RemoveStarterFromThePath } from './../../Utils/generic.utils';
// import { IsUndefinedOrNull } from './../../Utils/common.utils';

// import FormCreator from './../Form-Creator/formCreator.component';

import SelectBox from './../Forms/Components/Select-Box/selectBoxForGenericForm.component';

// import ModalHeader from './../../Wrappers/Modal-Wrapper/templates/Modal-Header/modalHeader.component'
// import ModalFooter from './../../Wrappers/Modal-Wrapper/templates/Modal-Footer/modalFooter.component';

import CustomTooltip from '../Custom-Tooltip/customTooltip.component';
import _ from 'lodash';

let customMethods = {};

let self = {};
export default class CustomAction extends Component {
    methods = {};
    constructor(props) {
        super(props);

        self = this;
        this.state = {
            dropdownOpen: false,
            actions: props.actions,
            genericData: props.genericData,
            placement: props.placement
        };
    }

    UNSAFE_componentWillReceiveProps = () => {
        this.setState({ genericData: this.props.genericData });
    }
    // componentWillReceiveProps({ genericData }) {
    //     this.setState({ genericData });
    // }

    componentDidMount = () => {
        const { actions } = this.state
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    callFunction = ({ action, listingRow }) => {
        const args = [];
        const { genericData, history, callback, source = 'model', menuDetail = {}, parentData = {} } = this.props;
        this.genericData = genericData;
        const data = RemoveStarterFromThePath({ data: listingRow, starter: genericData.starter });


        if (action.form_id) {
            action.callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : callback) : callback;
            genericData.preDefinedmethods.customForm({ action, listingRow: data, genericData, history, menuDetail, parent: parentData });
        } else if (action.execution_script) {
            const pageContent = {
                data,
                parent: parentData,
                execution_script: action.execution_script
            }
            ProcessPage({ pageContent });
            // script evaluation goes here
        } else if (typeof genericData.preDefinedmethods[action.identifier] == "function") {
            action.callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : callback) : callback;
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

    render() {
        const { actions = [], listingRow = [], genericData = {}, placement = 'as_record', position } = this.props;
        let sortActions = this.state.actions;
        sortActions = _.orderBy(actions, 'display_order', 'asc')
        return (
            <div className="custom-actions flex">
                {
                    sortActions.map((action, key) => {
                        if (!action) {
                            return null;
                        }

                        if (action[placement] && placement == 'as_dropdown') {
                            // const html =
                            //     <button type="button" data-toggle="dropdown" aria-expanded="false" aria-haspopup="true" class="dropdown-button dropdown-toggle btn btn-primary">Filter</button>
                            return (
                                <Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle} key={key}>
                                    {/* <DropdownToggle data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}> */}
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

                                            <div className="menu-item" key={key} role="menuitem">
                                                <a className="menu-link">
                                                    <span className="badge" onClick={() => { this.callFunction({ action, listingRow }) }}>
                                                        <i className={`fa ${action.image}`}></i>
                                                        &nbsp;
                                                        {action.name}
                                                    </span>
                                                </a>
                                            </div>

                                        }
                                    </DropdownMenu>
                                </Dropdown>
                            );
                        }
                        else if(action[placement]){
                            // if (action.placement_id == placement || true) {
                            const html =

                                // <button key={key}
                                //     onClick={() => {
                                //         this.callFunction({ action, listingRow });
                                //     }}
                                //     type="button" className="btn btn-sm btn-light">
                                <span className="button-element" onClick={() => { this.callFunction({ action, listingRow }) }}>
                                    {/* <i className={`fa ${action.icon}`}></i> */}
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
            </div >
        )
    }
}
