import React, { Component } from 'react';
import './rightClick.css';

import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";

export default class RightClick extends Component {


    aggregationOperators = [{ name: 'Sum' }, { name: 'Avg' }, { name: 'Max' }, { name: 'Min' }];

    constructor(props) {
        super(props);
    }

    render() {

        const { rowTemplate, renderTag, selectedColumn, listingRow, history, match, menuDetail, rowOptions } = this.props;
        let displayName;
        try {
            displayName = eval('listingRow.' + selectedColumn.path)
        } catch (e) {
            displayName = ''
        }
        return (
            <div>
                <ContextMenuTrigger renderTag={renderTag} id={listingRow.id + selectedColumn.path} holdToDisplay={1000}>
                    <span>
                        {
                            rowTemplate ?
                                rowTemplate({ listingRow, selectedColumn }) :
                                displayName
                        }
                    </span>
                </ContextMenuTrigger>

                <ContextMenu id={listingRow.id + selectedColumn.path}>
                    {
                        rowOptions.map((rowOption, key) => {
                            if (rowOption.name) {
                                return (
                                    !rowOption.subMenu ?
                                        <MenuItem key={key} onClick={() => rowOption.onClick(this.props)} data={this.props} >
                                            <i className={`fa ${rowOption.icon}`} />
                                            <span className="space-icon">{rowOption.name}</span>
                                        </MenuItem> :
                                        <SubMenu disabled={selectedColumn.path.split('.').length != 1} key={key} title={[<i key={1} className={`fa ${rowOption.icon}`} />, <span key={2}> {rowOption.name}</span>]}>
                                            {
                                                this.aggregationOperators.map((operator, index) => {
                                                    return (
                                                        <MenuItem key={index} onClick={() => rowOption.onClick(this.props, operator)} data={this.props}>
                                                            {operator.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </SubMenu>
                                )
                            } else {
                                return (<MenuItem key={key} divider />);
                            }
                        })
                    }
                </ContextMenu>
            </div>
        )
    }
}