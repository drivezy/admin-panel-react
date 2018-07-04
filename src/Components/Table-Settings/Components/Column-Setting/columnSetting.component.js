import React, { Component } from 'react';
import _ from 'lodash';
import { Collapse, Card, CardBody } from 'reactstrap';

import SelectBox from './../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import Switch from './../../../Forms/Components/Switch/switch';

import Filters from './../../../../Constants/filters';

import './columnSetting.component.css';

export default class ColumnSetting extends Component {

    constructor(props) {
        super(props);

        this.state = {
            column: this.props.column,
            // tempColumn: this.props.column
            // formContent: {}
        }

        this.filterArr = Object.values(Filters);
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

    updateColumnHyperlink = (field, value) => {

        let { column } = this.state;
        //console.log(column);

        column.route = value ? true : false;

        this.setState({ column });
    }

    columnNameChange = (event) => {
        let { column } = this.state;

        column.columnTitle = event.target.value;

        this.setState({ column });
    }

    columnUpdate = (event) => {
        event.preventDefault();
        // console.log()
    }

    render() {
        const { filterArr } = this;
        const { column } = this.state;
        const { columns, activeColumn } = this.props;
        const { columnTitle, route, filter } = column;

        //console.log(column, columns);
        return (
            <div className={`column-setting ${activeColumn.column == column.column ? 'active' : ''}`} >
                <div className="column-label">
                    <div className="item-label" onClick={() => this.props.selectColumn(column, this.props.index)} onDoubleClick={() => this.props.removeColumn(column)} >
                        {column.columnTitle ? column.columnTitle : columns[column.index].name}
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

                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">
                                        Hyperlink
                                    </label>
                                    <Switch name="route" onChange={this.updateColumnHyperlink} value={route} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">
                                        Filter
                                    </label>
                                    <SelectBox
                                        onChange={(filter) => {
                                            column.filter = filter;
                                            this.setState({ column });
                                        }}
                                        value={filter}
                                        options={filterArr}
                                        placeholder='Filter'
                                    />
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



