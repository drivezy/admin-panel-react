import React, { Component } from 'react';
import './CustomAction.css';

import { CreateUrl, ConvertDependencyInjectionToArgs } from './../../Utils/generic.utils';
import { IsUndefinedOrNull } from './../../Utils/common.utils';
import { Delete } from './../../Utils/http.utils';
import ToastNotifications from './../../Utils/toast.utils';

// import FormCreator from './../Form-Creator/formCreator.component';

import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';

import ModalHeader from './../../Wrappers/Modal-Wrapper/templates/Modal-Header/modalHeader.component'
// import ModalHeader from './../../Wrappers/Modal-Wrapper/templates/Modal-Header/modalHeader.component';
import ModalFooter from './../../Wrappers/Modal-Wrapper/templates/Modal-Footer/modalFooter.component';

import CustomTooltip from '../Custom-Tooltip/customTooltip.component';


let customMethods = {};

let self = {};
export default class CustomAction extends Component {
    methods = {};
    constructor(props) {
        super(props);

        self = this;
        this.state = {
            actions: props.actions,
            genericData: props.genericData
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

    callFunction = ({ action, listingRow }) => {
        const args = [];
        const { genericData, history, callback } = this.props;
        this.genericData = genericData;
        if (genericData.methods && typeof genericData.methods[action.name] == "function") {
            // var callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : customMethods[action.callback]) : listing.callbackFunction.function;

            const callbackMethod = (action.callback && typeof genericData.methods[action.callback] == "function") ? genericData.methods[action.callback] : callback;
            const args = ConvertDependencyInjectionToArgs.call(this, action.dependency);
            args.reverse();
            args.push(callbackMethod);
            action.placement_id == 167 ? args.push(listingRow) : args.push("");
            args.reverse();

            genericData.methods[action.name].apply(this, args);
        } else { // For add, edit,delete
            action.callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : callback) : callback;
            if (typeof genericData.preDefinedmethods[action.name] == "function") {
                genericData.preDefinedmethods[action.name]({ action, listingRow, genericData, history });
            }
        }
    }

    render() {
        const { actions = [], listingRow = [], genericData = {}, placement, position } = this.props;
        return (
            <div className="custom-actions">
                {
                    actions.map((action, key) => {

                        if (action.placement_id == placement) {
                            const html =

                                // <button key={key}
                                //     onClick={() => {
                                //         this.callFunction({ action, listingRow });
                                //     }}
                                //     type="button" className="btn btn-sm btn-light">
                                <span className="button-element" onClick={() => { this.callFunction({ action, listingRow }) }}>
                                    <i className={`fa ${action.icon}`}></i>

                                    {/* Temporaririly fix to hide the name for row actions */}
                                    {
                                        ((action.placement_id == 168) || (position == 'header')) && <span className="action-label">
                                            {action.name}
                                        </span>
                                    }
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