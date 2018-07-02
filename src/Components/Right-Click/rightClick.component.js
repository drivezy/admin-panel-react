import React, { Component } from 'react';
import './rightClick.css';

import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";

export default class RightClick extends Component {


    aggregationOperators = [{ name: 'Sum' }, { name: 'Avg' }, { name: 'Max' }, { name: 'Min' }];

    render() {

        const { renderTag, rowOptions, html, className, callback, source } = this.props;

        const identifier = "entry " + Math.random(Math.random() * 1000);

        return (
            [
                <ContextMenuTrigger key={1} id={identifier} renderTag={renderTag} attributes={{ className }} holdToDisplay={1000}>
                    {html || ''}
                </ContextMenuTrigger>,

                <ContextMenu key={2} id={identifier}>
                    {
                        rowOptions.map((rowOption, key) => {
                            if (rowOption.name) {
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