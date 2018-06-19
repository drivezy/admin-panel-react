
import React, { Component } from 'react';
import './FormSettings.css';
import _ from 'lodash';

import { SetPreference } from './../../Utils/preference.utils';

// import { changeArrayPosition } from './../../Utils/js.utils';

import { IsObjectHaveKeys } from './../../Utils/common.utils';
import { changeArrayPosition } from './../../Utils/js.utils';

import { FormPreferenceEndPoint } from './../../Constants/api.constants';

import { Collapse, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import FormColumnSetting from './../../Components/Form-Settings/Components/Form-Column-Setting/formColumnSetting.component';

export default class FormSettings extends Component {

    constructor(props) {
        super(props);

        const formLayout = this.props.formLayout || {};

        this.state = {
            modal: false,
            selectedColumns: formLayout.column_definition || [],
            tempSelectedColumns: formLayout.column_definition || [],
            columns: this.props.columns,
            list: {},
            activeColumn: {},
            module: props.module
        }
    }

    componentDidMount() {
    }

    unsafe_componentwillreceiveprops(nextProps) {
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal, activeColumn: {}, tempSelectedColumns: IsObjectHaveKeys(this.props.formLayout) ? this.props.formLayout.column_definition : [] })
        // this.setState({ modal: !this.state.modal, activeColumn: {} })
    }

    toggleList = (index) => {
        var obj = this.state.list;
        obj[index] = !obj[index];
        this.setState({ list: obj });
    }

    addColumn = (column) => {
        var selectedColumns = this.state.tempSelectedColumns;

        selectedColumns.unshift({
            // display_name: column.display_name,
            object: column.parent, column: column.name, headingCollapsed: true, heading: "", index: column.name

            // column: column.parent + "." + column.id, headingCollapsed: true, heading: ""
        });

        this.setState({ tempSelectedColumns: selectedColumns })
    }

    selectColumn = (column, index) => {
        if (typeof column != 'string') {
            // column.index = index;
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

    removeColumn = (column) => {
        var selectedColumns = this.state.tempSelectedColumns;

        selectedColumns = selectedColumns.filter((entry) => (entry.column != column.column));

        this.setState({ tempSelectedColumns: selectedColumns })
    }

    addSplit = () => {
        const { tempSelectedColumns } = this.state;
        var ext = Math.floor(Math.random() * 1000);
        tempSelectedColumns.unshift("e-split-" + ext);

        tempSelectedColumns.unshift("s-split-" + ext);
        this.setState({ tempSelectedColumns });
    }

    removeSplit = (index, item) => {
        const { tempSelectedColumns } = this.state;
        tempSelectedColumns.splice(index, 1);
        var end;
        if (item.split("-")[0] == "e") {
            end = item.replace("e", "s");
        } else if (item.split("-")[0] == "s") {
            end = item.replace("s", "e");
        }
        var endIndex = tempSelectedColumns.indexOf(end);
        tempSelectedColumns.splice(endIndex, 1);
        this.setState({ tempSelectedColumns });
    };

    applyChanges = async () => {

        const { userId, modelId, listName, source } = this.props;
        let { formLayout } = this.props;
        const { tempSelectedColumns } = this.state;
        const result = await SetPreference({ userId, source, menuId: modelId, name: listName, selectedColumns: tempSelectedColumns, layout: formLayout, url: FormPreferenceEndPoint });
        // const result = await SetPreference(this.props.listName, this.state.tempSelectedColumns);

        // result.success ? this.setState({ modal: !this.state.modal }) : null;
        // this.props.onSubmit(this.state.tempSelectedColumns);
        if (result.success) {
            this.setState({ modal: !this.state.modal });
            if (IsObjectHaveKeys(formLayout)) {
                formLayout.column_definition = tempSelectedColumns;
            } else {
                const { response } = result;
                response.column_definition = JSON.parse(response.column_definition);
                formLayout = response;
            }
            this.props.onSubmit(formLayout);
        }


        // const result = await SetPreference(this.props.listName, this.state.tempSelectedColumns);
        // result.success ? this.setState({ modal: !this.state.modal }) : null;
        // this.props.onSubmit(this.state.tempSelectedColumns);
    }

    modalWrapper() {
        // const { columns, tempSelectedColumns, selectedColumns, activeColumn, module } = this.state;
        const { columns, tempSelectedColumns, activeColumn, module } = this.state;

        const selectedIds = [];

        for (var value of tempSelectedColumns) {
            if (typeof value != 'string') {
                selectedIds.push(value.column);
            }
        }

        let leftColumns = [];
        // const leftColumns = _.groupBy(columns, 'parent');

        const columnKeys = Object.keys(columns);
        // const columnKeys = [module];

        for (var key of columnKeys) {
            if (selectedIds.indexOf(columns[key].name) == -1) {
                leftColumns.push(columns[key]);
            }
            // leftColumns[key] = columns[key].filter((column) => (
            //     selectedIds.indexOf(column.id) == -1
            // ));
        }

        return (
            <Modal size="lg" isOpen={this.state.modal} toggle={this.toggleModal} className="form-settings-modal">
                <ModalHeader toggle={this.toggleModal}>
                    Configure
            </ModalHeader>
                <ModalBody>
                    <div className="left">

                        <div className="card" >
                            <div className="card-body parent-card">

                                <div className="card-top">
                                    <h6 className="card-title">All Columns</h6>

                                    <div className="input-holder">
                                        <input type="text" className="search-box" placeholder="Search Columns" />
                                    </div>
                                </div>
                                <ListGroup className="parent-group">
                                    {
                                        leftColumns.map((entry, key) => (
                                            <div key={key} className="column-group" onDoubleClick={() => this.addColumn(entry)} >
                                                <div className="column-label">
                                                    {entry.name}
                                                </div>
                                                <div className="icon-holder">
                                                    <button className="add-column btn btn-sm btn-light" onClick={() => this.addColumn(entry)} >
                                                        <i className="fa fa-external-link-square" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            // <ListGroupItem tag="button" onDoubleClick={() => this.addColumn(entry)} key={key}>{entry.column_name}</ListGroupItem>
                                        ))
                                    }
                                </ListGroup>
                            </div>
                        </div>
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
                        <div className="card">
                            <div className="card-body parent-card">
                                {activeColumn.column ? activeColumn.column.column : null}
                                <ListGroup className="parent-group">
                                    {
                                        tempSelectedColumns.length > 0 &&
                                        tempSelectedColumns.map((column, index) =>
                                            ((typeof column == 'string') ?
                                                <ListGroupItem tag="button" action key={index}>
                                                    <span>---- {column} ----</span>
                                                    <span className="close margin-top-4" data-dismiss="alert" aria-label="Close" onClick={() => this.removeSplit(index, column)}>
                                                        <i className="fa fa-times"></i>
                                                    </span>
                                                </ListGroupItem>
                                                :
                                                // Component Manages column props
                                                <FormColumnSetting removeColumn={this.removeColumn} columns={columns} activeColumn={activeColumn} selectColumn={this.selectColumn} column={column} index={index} key={index} />
                                                // Column Setting Ends
                                            )
                                        )
                                    }
                                    {/* {
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
                                    } */}
                                </ListGroup>
                            </div>
                        </div>
                    </div>

                </ModalBody >
                <ModalFooter>
                    <Button color="primary" onClick={this.applyChanges}>Apply Changes</Button>
                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal >
        )
    }

    render() {
        return (
            <div className="form-settings">
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
