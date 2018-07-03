import React, { Component } from 'react';
import { Collapse, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';

import { SetPreference } from './../../Utils/preference.utils';
import { changeArrayPosition } from './../../Utils/js.utils';
import { IsObjectHaveKeys } from './../../Utils/common.utils';

import ColumnSetting from './Components/Column-Setting/columnSetting.component';

import { SubscribeToEvent, UnsubscribeEvent } from './../../Utils/stateManager.utils';

import './TableSettings.css';

export default class TableSettings extends Component {

    constructor(props) {
        super(props);

        const layout = this.props.layout || {};
        this.state = {
            modal: false,
            selectedColumns: layout.column_definition || [],
            tempSelectedColumns: layout.column_definition || [],
            columns: this.props.columns,
            list: {},
            activeColumn: {},
            showSplitFlag: this.props.showSplitFlag,
            hasFormConfiguratorRole: ''
        }
    }

    componentDidMount() {
        const co = JSON.stringify(this.state.columns);
        // this.setState({ tempColumns: JSON.parse(co) });
        this.setState({ tempColumns: { ...this.state.columns } });
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal, activeColumn: {}, tempSelectedColumns: IsObjectHaveKeys(this.props.layout) ? this.props.layout.column_definition : [] })
    }

    toggleList = (index) => {
        let obj = this.state.list;
        obj[index] = !obj[index];
        this.setState({ list: obj });
    }

    userDataFetched = (data) => {
        for (var i in data.access_object.roleIdentifiers) {
            if (data.access_object.roleIdentifiers[i] == 'form-configurator') {
                let hasFormConfiguratorRole = data.access_object.roleIdentifiers[i];
                this.setState({ hasFormConfiguratorRole });
            }
        }
    }

    addColumn = (column) => {

        let selectedColumns = this.state.tempSelectedColumns;

        // const regexForPickingAfterLastDot = /[^\.]+$/;
        selectedColumns.unshift({
            headingCollapsed: true, heading: "", object: column.parent, column: column.name, index: column.parent + '.' + column.name
            // headingCollapsed: true, heading: "", object: column.parent, column: column.name, index: column.parent + '.' + column.name
            // headingCollapsed: true, heading: "", object: column.parent.match(regexForPickingAfterLastDot)[0], column: column.name, columnObj: column
            // column: column.parent + "." + column.id, headingCollapsed: true, heading: ""
        });

        this.state.tempSelectedColumns = selectedColumns;
        // this.setState({ tempSelectedColumns: selectedColumns })
        this.removeColumnFromLeft(column);
    }

    removeColumnFromLeft(column) {
        const { tempColumns } = this.state;
        delete tempColumns[column.path];
        this.setState({ tempColumns });
    }

    removeColumn = (column) => {
        let selectedColumns = this.state.tempSelectedColumns;

        selectedColumns = selectedColumns.filter((entry) => (entry.column != column.column));

        this.setState({ tempSelectedColumns: selectedColumns })
        this.addColumnToLeft(column);
    }

    addColumnToLeft(column) {
        const { tempColumns, columns } = this.state;
        column = columns[column.index];
        tempColumns[column.path] = column;
    }

    searchResult = (event) => {
        let searchValue = event.target.value;
    }

    toggleColumn = (column) => {
        column.expanded = !column.expanded
    }

    selectColumn = (column, index) => {
        // if (typeof column != 'string') {
        column.position = index;
        this.setState({ activeColumn: column });
        // }
    }

    moveSelectedUp = () => {
        this.moveSelectedItem(-1);
    }

    moveSelectedDown = () => {
        this.moveSelectedItem(1);
    }

    moveSelectedItem = (key) => {
        let activeColumn = this.state.activeColumn;
        let { position } = this.state.activeColumn;
        let result = changeArrayPosition(this.state.tempSelectedColumns, position, position + key)
        activeColumn.position = result.position;
        this.setState({ tempSelectedColumns: result.array, activeColumn: activeColumn });
    }

    addSplit = () => {
        const { tempSelectedColumns } = this.state;
        let ext = Math.floor(Math.random() * 1000);
        tempSelectedColumns.push({ split: true, label: "s-split-" + ext });

        tempSelectedColumns.push({ split: true, label: "e-split-" + ext })
        this.setState({ tempSelectedColumns });
    }

    addHSplit = () => {
        const { tempSelectedColumns } = this.state;
        tempSelectedColumns.push({ split: true, label: "seperator", headingCollapsed: true, heading: "" });
        this.setState({ tempSelectedColumns });
    }

    removeSplit = (index, item) => {
        const { tempSelectedColumns } = this.state;
        tempSelectedColumns.splice(index, 1);
        let end;
        if (item.label.split("-")[0] == "s") {
            end = item.label.replace("s", "e");
        } else if (item.label.split("-")[0] == "e") {
            end = item.label.replace("e", "s");
        }

        let endIndex;

        for (let i in tempSelectedColumns) {
            if (tempSelectedColumns[i].label == end) {
                endIndex = i;
            }
        }

        tempSelectedColumns.splice(endIndex, 1);
        return tempSelectedColumns;
    };

    applyChangesToAll = async () => {
        const { userId, menuId, listName, source } = this.props;
        let { layout } = this.props;
        const { tempSelectedColumns } = this.state;
        const result = await SetPreference({ userId, source, menuId, name: listName, selectedColumns: this.state.tempSelectedColumns, layout,override_all:1 });

        // const result = await SetPreference(this.props.listName, this.state.tempSelectedColumns);

        if (result.success) {
            this.setState({ modal: !this.state.modal });
            if (IsObjectHaveKeys(layout)) {
                layout.column_definition = tempSelectedColumns;
            } else {
                const { response } = result;
                response.column_definition = JSON.parse(response.column_definition);
                layout = response;
            }
            this.props.onSubmit(layout);
        }
    }



    applyChanges = async () => {
        const { userId, menuId, listName, source } = this.props;
        let { layout } = this.props;
        const { tempSelectedColumns } = this.state;
        const result = await SetPreference({ userId, source, menuId, name: listName, selectedColumns: this.state.tempSelectedColumns, layout });

        // const result = await SetPreference(this.props.listName, this.state.tempSelectedColumns);

        if (result.success) {
            this.setState({ modal: !this.state.modal });
            if (IsObjectHaveKeys(layout)) {
                layout.column_definition = tempSelectedColumns;
            } else {
                const { response } = result;
                response.column_definition = JSON.parse(response.column_definition);
                layout = response;
            }
            this.props.onSubmit(layout);
        }
    }

    modalWrapper() {
        const { tempColumns: columns, columns: originalColumns, tempSelectedColumns, activeColumn, showSplitFlag, hasFormConfiguratorRole } = this.state;
        //console.log(columns);
        const { source = 'module' } = this.props;
        const selectedIds = [];

        //console.log(showSplitFlag);

        for (let value of tempSelectedColumns) {
            if (typeof value != 'string') {
                selectedIds.push(value);
                // selectedIds.push(parseInt(value.column.split('.').pop()));
            }
        }

        const leftColumns = _.groupBy(columns, 'parent');

        const columnKeys = Object.keys(leftColumns);

        for (let key of columnKeys) {
            leftColumns[key] = leftColumns[key].filter((column) => (
                selectedIds.indexOf(column.id) == -1
            ));
        }
        return (
            <Modal size="lg" isOpen={this.state.modal} toggle={this.toggleModal} className="table-settings">
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
                                        <input type="text" onClick={(event) => this.searchResult} className="search-box" placeholder="Search Columns" />
                                    </div>
                                </div>

                                <ListGroup className="parent-group">
                                    {
                                        columnKeys.map((column, index) => (
                                            <div key={index}>

                                                <div className="column-group" onClick={() => this.toggleList(column)}>
                                                    <div className="column-label">
                                                        {column}
                                                    </div>
                                                    <div className="icon-holder">
                                                        <i className={`fa ${!this.state.list[column] ? 'fa-plus' : 'fa-minus'}`} aria-hidden="true"></i>
                                                    </div>
                                                </div>

                                                <Collapse isOpen={this.state.list[column]} className="columns-wrapper">


                                                    <ListGroup className="inner-columns">
                                                        {
                                                            leftColumns[column].map((entry, key) => (

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
                                                            ))
                                                        }
                                                    </ListGroup>
                                                </Collapse>
                                            </div>
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

                        {
                            showSplitFlag == true &&
                            <Button color="primary" size="sm" onClick={this.addSplit}>
                                Add Split
                            </Button>
                        }
                        {
                            showSplitFlag == true &&
                            <Button color="primary" size="sm" onClick={this.addHSplit}>
                                H-Split
                            </Button>
                        }
                    </div>


                    <div className="right">

                        <div className="card">
                            <div className="card-body parent-card">
                                <div className="card-top">
                                    <h6 className="card-title">Selected Columns</h6>
                                </div>

                                <ListGroup className="parent-group">
                                    {
                                        tempSelectedColumns.map((column, index) =>
                                            ((column.split) ?
                                                <ListGroupItem tag="button" action key={index} onClick={() => this.selectColumn(column, index)}>
                                                    ---- {column.label} ----
                                                    <span className="close margin-top-4" data-dismiss="alert" aria-label="Close" onClick={() => this.removeSplit(index, column)}>
                                                        <i className="fa fa-times"></i>
                                                    </span>
                                                </ListGroupItem>
                                                :
                                                // Component Manages column props
                                                <ColumnSetting
                                                    source={source}
                                                    removeColumn={this.removeColumn}
                                                    columns={originalColumns}
                                                    activeColumn={activeColumn}
                                                    selectColumn={this.selectColumn}
                                                    column={column}
                                                    index={index}
                                                    key={index}
                                                />
                                                // Column Setting Ends
                                            )
                                        )
                                    }
                                </ListGroup>

                            </div>
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    {hasFormConfiguratorRole ?
                        <Button color="primary" onClick={this.applyChangesToAll}>Apply For All</Button>
                        : null
                    }
                    <div className="rightButtons">
                        <Button color="primary" onClick={this.applyChanges}>Apply Changes</Button>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </div>
                </ModalFooter>
            </Modal >
        )
    }

    render() {
        return (
            <div className="table-settings">
                <Button color="secondary" size="sm" onClick={this.toggleModal} className="settingBtn">
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



