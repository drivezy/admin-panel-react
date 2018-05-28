import React, { Component } from 'react';
import './FormSettings.css';
import _ from 'lodash';

import { SetPreference } from './../../Utils/preference.utils';

import { changeArrayPosition } from './../../Utils/js.utils';

import { Collapse, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class FormSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            selectedColumns: this.props.selectedColumns,
            tempSelectedColumns: this.props.selectedColumns,
            columns: this.props.columns,
            list: {},
            activeColumn: {},
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal, activeColumn: {}, tempSelectedColumns: this.props.selectedColumns })
    }

    toggleList = (index) => {
        var obj = this.state.list;
        obj[index] = !obj[index];
        this.setState({ list: obj });
    }

    addColumn = (column) => {
        var selectedColumns = this.state.tempSelectedColumns;

        selectedColumns.unshift({
            column: column.parent + "." + column.id, headingCollapsed: true, heading: ""
        });

        this.setState({ tempSelectedColumns: selectedColumns })
    }

    selectColumn = (column, index) => {
        if (typeof column != 'string') {
            column.index = index;
            this.setState({ activeColumn: column });
        }
    }

    moveSelectedUp = () => {
        this.moveSelectedItem(-1);
    }

    moveSelectedDown = () => {
        this.moveSelectedItem(1);
    }

    moveSelectedItem = (key) => {
        var activeColumn = this.state.activeColumn;
        var index = this.state.activeColumn.index;
        var result = changeArrayPosition(this.state.tempSelectedColumns, index, index + key)
        activeColumn.index = result.index;
        this.setState({ tempSelectedColumns: result.array, activeColumn: activeColumn });
    }

    addSplit = () => {
        var ext = Math.floor(Math.random() * 1000);
        var selectedColumns = this.state.tempSelectedColumns;
        selectedColumns.unshift("e-split-" + ext);

        selectedColumns.unshift("s-split-" + ext);
        this.setState({ selectedColumns });
    }

    applyChanges = async () => {
        const result = await SetPreference(this.props.listName, this.state.tempSelectedColumns);
        result.success ? this.setState({ modal: !this.state.modal }) : null;
        this.props.onSubmit(this.state.tempSelectedColumns);
    }

    modalWrapper() {
        const { columns, tempSelectedColumns, activeColumn } = this.state;

        const selectedIds = [];

        for (var value of tempSelectedColumns) {
            if (typeof value != 'string') {
                selectedIds.push(parseInt(value.column.split('.').pop()));
            }
        }

        const leftColumns = _.groupBy(columns, 'parent');

        const columnKeys = Object.keys(leftColumns);

        for (var key of columnKeys) {
            leftColumns[key] = leftColumns[key].filter((column) => (
                selectedIds.indexOf(column.id) == -1
            ));
        }
        return (
            <Modal size="lg" isOpen={this.state.modal} toggle={this.toggleModal} className="form-settings">
                <ModalHeader toggle={this.toggleModal}>
                    Configure
            </ModalHeader>
                <ModalBody>
                    <div className="left">
                        <ListGroup>
                            {
                                columnKeys.map((column, index) => (
                                    <div key={index}>
                                        <ListGroupItem color="info" tag="button" action key={index} onClick={() => this.toggleList(column)}>
                                            {column}
                                        </ListGroupItem>
                                        <Collapse isOpen={this.state.list[column]}>
                                            <ListGroup>
                                                {
                                                    leftColumns[column].map((entry, key) => (
                                                        <ListGroupItem tag="button" onDoubleClick={() => this.addColumn(entry)} key={key}>{entry.column_name}</ListGroupItem>
                                                    ))
                                                }
                                            </ListGroup>
                                        </Collapse>
                                    </div>
                                ))
                            }
                        </ListGroup>
                    </div>

                    <div className="controls">
                        <Button color="primary" size="sm" onClick={this.moveSelectedUp}>
                            <i className="fa fa-arrow-up"></i>
                        </Button>
                        <Button color="primary" size="sm" onClick={this.moveSelectedDown}>
                            <i className="fa fa-arrow-down"></i>
                        </Button>
                        <Button color="primary" size="sm" onClick={this.addSplit}>
                            Add Split
                       </Button>
                    </div>

                    <div className="right">

                        {activeColumn.column ? activeColumn.column.column : null}
                        <ListGroup>
                            {
                                tempSelectedColumns.map((column, index) => (
                                    <div key={index}>
                                        {typeof column == 'string' ?
                                            <ListGroupItem tag="button" action>
                                                ---- {column} ----
                                        </ListGroupItem>
                                            : <ListGroupItem tag="button" action onClick={() => this.selectColumn(column, index)} className={`${activeColumn.column == column.column ? 'active' : ''}`}>
                                                {column.columnTitle ? column.columnTitle : columns[column.column].column_name}
                                            </ListGroupItem>
                                        }
                                    </div>
                                ))
                            }
                        </ListGroup>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.applyChanges}>Apply Changes</Button>
                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    render() {
        return (
            <div className="table-settings">
                <Button color="primary" size="sm" onClick={this.toggleModal}>
                    <i className="fa fa-cog"></i>
                </Button>

                {
                    this.state.modal &&
                    this.modalWrapper()
                }
            </div>
        )
    }
}



