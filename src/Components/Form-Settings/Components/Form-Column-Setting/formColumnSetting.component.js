import React, { Component } from 'react';
import './../../../../Assets/Global-Shared/columnConfigurator.css';
import _ from 'lodash';

import { Collapse, Card, CardBody } from 'reactstrap';

import Switch from './../../../Forms/Components/Switch/switch';

export default class FormColumnSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            column: this.props.column
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.column) {
            this.setState({ column: nextProps.column });
        }
    }

    toggleSetting = () => {
        let column = this.state.column;
        column.expanded = !column.expanded;
        this.setState({ column });
    }

    columnNameChange = (event) => {
        let { column } = this.state;

        column.columnTitle = event.target.value;

        this.setState({ column });
    }

    columnUpdate = (event) => {
        event.preventDefault();
    }

    render() {
        const { column } = this.state;
        const { columns, activeColumn } = this.props;
        const { columnTitle, route } = column;

        return (
            <div className={`column-setting ${activeColumn.column == column.column ? 'active' : ''}`} >
                <div className="column-label">
                    <div className="item-label" onClick={() => this.props.selectColumn(column, this.props.index)} onDoubleClick={() => this.props.removeColumn(column)} >
                        {column.columnTitle ? column.columnTitle : (columns[column.index] ? columns[column.index].display_name : null)}
                    </div>
                    <div className="column-toggle" onClick={() => this.props.removeColumn(column)}>
                        <i className={`fa fa-trash`}></i>
                    </div>
                    <div className="column-toggle" onClick={this.toggleSetting}>
                        <i className={`fa ${column.expanded ? ' fa-chevron-down' : ' fa-chevron-right'}`}></i>
                    </div>
                </div>

                {/* // Expanded Column Configuration */}
                <Collapse isOpen={column.expanded} className="column-configuration">
                    <Card>
                        <CardBody>
                            <form onSubmit={this.columnUpdate}>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Column Header</label>
                                    <input value={columnTitle} onChange={this.columnNameChange} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Column Name" />
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <button type="button" onClick={this.toggleSetting} className="btn btn-secondary">Close</button>
                                    </div>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Collapse>
                {/* // Column Configuration Ends */}

            </div>
        )
    }
}



