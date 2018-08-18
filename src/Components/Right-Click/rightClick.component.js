import React, { Component } from 'react';

import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";

import { RemoveStarterFromThePath } from './../../Utils/generic.utils';
import { ProcessPage } from './../../Utils/pageMiddleware.utils';

import './rightClick.css';

let customMethods = {};

export default class RightClick extends Component {

    aggregationOperators = [{ name: 'Sum' }, { name: 'Avg' }, { name: 'Max' }, { name: 'Min' }];

    // Calling function for ui actions
    callFunction = ({ rowOption, listingRow }, e) => {
        let action = rowOption;
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
            ProcessPage({ pageContent }, e);
        }
    }

    render() {

        const { renderTag, rowOptions, html, className, listingRow } = this.props;

        // Generating random identifier
        const identifier = "entry " + Math.random(Math.random() * 1000);

        return (
            [
                <ContextMenuTrigger key={1} id={identifier} renderTag={renderTag} attributes={{ className }} holdToDisplay={1000}>
                    <span className={`base-class ${html ? 'is-active' : ''}`} >{html || '.'}</span>
                </ContextMenuTrigger>,

                <ContextMenu key={2} id={identifier} className={`${className == 'generic-form-label' ? 'generic-form' : ''}`}>
                    {
                        rowOptions.map((rowOption, key) => {
                            if (rowOption.as_context) {
                                return (
                                    <MenuItem key={key} >
                                        <span className="space-icon" onClick={(e) => { this.callFunction({ rowOption, listingRow }, e) }}>{rowOption.name}</span>
                                    </MenuItem>
                                )
                            } else if (typeof rowOption.onClick == 'function') {
                                return (
                                    !rowOption.subMenu ?
                                        <MenuItem key={key} onClick={(e) => rowOption.onClick(this.props, e)} data={this.props} >
                                            <i className={`fa ${rowOption.icon}`} />
                                            <span className="space-icon">{rowOption.name}</span>
                                        </MenuItem> :
                                        <SubMenu disabled={typeof rowOption.disabled == 'function' ? rowOption.disabled(this.props) : rowOption.disabled} key={key} title={[<i key={1} className={`fa ${rowOption.icon}`} />, <span key={2}> {rowOption.name}</span>]}>
                                            {
                                                this.aggregationOperators.map((operator, index) =>
                                                    <MenuItem key={index} onClick={(e) => rowOption.onClick(this.props, operator, e)} data={this.props}>
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