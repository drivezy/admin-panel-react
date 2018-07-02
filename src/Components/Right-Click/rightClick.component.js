import React, { Component } from 'react';
import './rightClick.css';

import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";

import { RemoveStarterFromThePath } from './../../Utils/generic.utils';

import { ProcessPage } from './../../Utils/pageMiddleware.utils';


let customMethods = {};
export default class RightClick extends Component {


    aggregationOperators = [{ name: 'Sum' }, { name: 'Avg' }, { name: 'Max' }, { name: 'Min' }];

    callFunction = ({ rowOption, listingRow }) => {
        let action = rowOption;
        const args = [];
        const { genericData, history, callback, source = 'model', menuDetail = {}, parentData = {} } = this.props;
        this.genericData = genericData;
        const data = RemoveStarterFromThePath({ data: listingRow, starter: genericData.starter });


        if (action.form_id) {
            action.callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : callback) : callback;
            genericData.preDefinedmethods.customForm({ action, listingRow: data, genericData, history, menuDetail, parent: parentData });
        } else {
            const pageContent = {
                data,
                parent: parentData,
                execution_script: action.execution_script
            }
            ProcessPage({ pageContent });
            // script evaluation goes here
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

        const { renderTag, rowOptions, html, className, listingRow, source } = this.props;


        const identifier = "entry " + Math.random(Math.random() * 1000);

        return (
            [
                <ContextMenuTrigger key={1} id={identifier} renderTag={renderTag} attributes={{ className }} holdToDisplay={1000}>
                    {html || ''}
                </ContextMenuTrigger>,

                <ContextMenu key={2} id={identifier}>
                    {
                        rowOptions.map((rowOption, key) => {
                            if (rowOption.as_context) {
                                return (
                                    <MenuItem key={key} >
                                        <span className="space-icon" onClick={() => { this.callFunction({ rowOption, listingRow }) }}>{rowOption.name}</span>
                                    </MenuItem>
                                )
                            } else if (typeof rowOption.onClick == 'function') {
                                return (
                                    !rowOption.subMenu ?
                                        <MenuItem key={key} onClick={() => rowOption.onClick(this.props)} data={this.props} >
                                            <i className={`fa ${rowOption.icon}`} />
                                            <span className="space-icon">{rowOption.name}</span>
                                        </MenuItem> :
                                        <SubMenu disabled={typeof rowOption.disabled == 'function' ? rowOption.disabled(this.props) : rowOption.disabled} key={key} title={[<i key={1} className={`fa ${rowOption.icon}`} />, <span key={2}> {rowOption.name}</span>]}>
                                            {
                                                this.aggregationOperators.map((operator, index) =>
                                                    <MenuItem key={index} onClick={() => rowOption.onClick(this.props, operator)} data={this.props}>
                                                        {operator.name}
                                                    </MenuItem>
                                                )

                                            }
                                        </SubMenu>
                                )
                            } else {
                                return (<MenuItem key={key} divider />);
                            }
                        })
                    }
                </ContextMenu>
            ]
        )
    }
}