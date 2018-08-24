import React, { Component } from 'react';
import { Collapse, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { IsObjectHaveKeys } from 'common-js-util';
import { SubscribeToEvent } from 'state-manager-utility';

import { SetPreference } from './../../Utils/preference.utils';
import { changeArrayPosition } from './../../Utils/js.utils';

import ColumnSetting from './Components/Column-Setting/columnSetting.component';

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
            formConfigurator: ''
        }
    }

    componentDidMount() {
        //const co = JSON.stringify(this.state.columns);
        // this.setState({ tempColumns: JSON.parse(co) });
        this.setState({ tempColumns: { ...this.state.columns } });
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal, activeColumn: {}, tempSelectedColumns: IsObjectHaveKeys(this.props.layout) ? this.props.layout.column_definition : [] })
    }

    expandAll = () => {
        const obj = {};
        const { parents } = this.state;
        for (let i in parents) {
            obj[parents[i]] = true;
        }
        this.setState({ list: obj });
    }

    toggleList = (index) => {
        let obj = this.state.list;

        obj[index] = !obj[index];
        this.setState({ list: obj });
    }

    userDataFetched = (data) => {
        let formConfigurator = data.hasRole && data.hasRole('form-configurator');
        // for (var i in data.access_object.roleIdentifiers) {
        //     if (data.access_object.roleIdentifiers[i] == 'form-configurator') {
        //         let formConfigurator = data.access_object.roleIdentifiers[i];
        //         this.setState({ formConfigurator });
        //     }
        // }
        this.setState({ formConfigurator });
    }

    addColumn = (column) => {

        let selectedColumns = this.state.tempSelectedColumns;

        // const regexForPickingAfterLastDot = /[^\.]+$/;
        selectedColumns.push({
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

        selectedColumns = selectedColumns.filter((entry) => {
            //console.log(column, entry);
            const isSameName = entry.column != column.column;
            if (isSameName) {
                return true;
            }
            return (column.object != entry.object);
        });

        this.setState({ tempSelectedColumns: selectedColumns });

        if (column.separator) {
            return;
        }
        else
            this.addColumnToLeft(column);
    }

    addColumnToLeft(column) {
        const { tempColumns, columns } = this.state;
        column = columns[column.index];
        if (column) {
            tempColumns[column.path] = column;
        }
        // tempColumns[column.path] = tempColumns.push(column);
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
        let ext = Math.floor(Math.random() * 1000);
        tempSelectedColumns.push({ split: true, label: "seperator", headingCollapsed: true, heading: "", separator: true, column: 'seperator' + ext });
        this.setState({ tempSelectedColumns });
    }

    removeSplit = (index, item) => {
        const { tempSelectedColumns } = this.state;
        tempSelectedColumns.splice(index, 1);
        let end;
        if (item.label.split("-")[0] == "seperator") {

        }
        else if (item.separator) {
            return tempSelectedColumns;
        }
        else {
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
        }
    };

    // applyChangesToAll = async () => {
    //     const { userId, menuId, listName, source } = this.props;
    //     let { layout } = this.props;
    //     const { tempSelectedColumns } = this.state;
    //     const result = await SetPreference({ userId, source, menuId, name: listName, selectedColumns: this.state.tempSelectedColumns, layout,override_all:1 });

    //     // const result = await SetPreference(this.props.listName, this.state.tempSelectedColumns);

    //     if (result.success) {
    //         this.setState({ modal: !this.state.modal });
    //         if (IsObjectHaveKeys(layout)) {
    //             layout.column_definition = tempSelectedColumns;
    //         } else {
    //             const { response } = result;
    //             response.column_definition = JSON.parse(response.column_definition);
    //             layout = response;
    //         }
    //         this.props.onSubmit(layout);
    //     }
    // }

    searchColumn = (event) => {
        const { tempColumns } = this.state;
        const searchedColumns = {};

        for (var i in tempColumns) {
            if (tempColumns[i].name.toString().toLowerCase().indexOf(event.target.value) != -1) {
                searchedColumns[i] = tempColumns[i];
            }
        }
        this.state.leftSearchText = event.target.value;
        this.state.searchedColumns = searchedColumns;
        this.expandAll();
    }


    applyChanges = async (overRide) => {
        const { userId, menuId, listName, source } = this.props;
        let { layout } = this.props;
        const { tempSelectedColumns } = this.state;
        const result = await SetPreference({ userId, source, menuId, name: listName, selectedColumns: this.state.tempSelectedColumns, layout, override_all: overRide ? 1 : 0 });

        // const result = await SetPreference(this.props.listName, this.state.tempSelectedColumns);

        if (result.success) {
            console.log(result);
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

    selectedColumnUpdate = (column, index) => {
        const { tempSelectedColumns } = this.state;
        tempSelectedColumns[index] = column;
        this.setState({ tempSelectedColumns });
    }

    modalWrapper() {
        const { tempColumns: columns, searchedColumns, columns: originalColumns, tempSelectedColumns, activeColumn, showSplitFlag, formConfigurator, leftSearchText } = this.state;
        const { source = 'module' } = this.props;
        const selectedIds = [];

        //console.log(showSplitFlag);

        const tempSelectedColumnsArray = Object.values(tempSelectedColumns);
        for (let value of tempSelectedColumns) {
            if (typeof value != 'string') {
                selectedIds.push(value.column);
                // selectedIds.push(parseInt(value.column.split('.').pop()));
            }
        }

        const finalColumnList = leftSearchText ? searchedColumns : columns;
        // const finalColumnList = searchedColumns && Object.keys(searchedColumns).length ? searchedColumns : columns;

        const leftColumns = _.groupBy(finalColumnList, 'parent');

        const columnKeys = Object.keys(leftColumns);
        this.state.parents = columnKeys;



        for (let key of columnKeys) {
            leftColumns[key] = leftColumns[key].filter((column) => {
                // console.log(column, selectedIds);
                const index = selectedIds.indexOf(column.name);
                // console.log(((index == -1) || (tempSelectedColumnsArray[index].object != column.parent)), column.name);
                return ((index == -1) || (tempSelectedColumnsArray[index].object != column.parent));
                // return selectedIds.indexOf(column.name) == -1
            });
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
                                    <h6 className="card-title">All Columns({leftColumns.length ? leftColumns.length : 0})</h6>

                                    <div className="input-holder">
                                        <input type="text" onChange={event => this.searchColumn(event)} className="search-box" placeholder="Search Columns" />
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
                                                                        {entry.display_name}
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
                        <Button color="info" size="sm" onClick={this.moveSelectedUp}>
                            <i className="fa fa-arrow-up"></i>
                        </Button>

                        <Button color="info" size="sm" onClick={this.moveSelectedDown}>
                            <i className="fa fa-arrow-down"></i>
                        </Button>

                        {
                            showSplitFlag == true &&
                            <Button color="secondary" size="sm" className="split" onClick={this.addSplit}>
                                V-Split
                            </Button>
                        }
                        {
                            showSplitFlag == true &&
                            <Button color="secondary" size="sm" className="split" onClick={this.addHSplit}>
                                H-Split
                            </Button>
                        }
                    </div>


                    <div className="right">

                        <div className="card">
                            <div className="card-body parent-card">
                                <div className="card-top">
                                    <h6 className="card-title">Selected Columns({tempSelectedColumns.length})</h6>
                                </div>

                                <ListGroup className="parent-group">
                                    {
                                        tempSelectedColumns.map((column, index) =>
                                            ((column.split) && (!column.separator) ?
                                                <div key={index}>
                                                    <ListGroupItem className={`${activeColumn.position === index && 'active'}`} tag="button" action key={index} onClick={() => this.selectColumn(column, index)}>
                                                        ---- {column.label} ----
                                                    <span className="close margin-top-4" data-dismiss="alert" aria-label="Close" onClick={() => this.removeSplit(index, column)}>
                                                            <i className="fa fa-times"></i>
                                                        </span>
                                                    </ListGroupItem>
                                                </div>
                                                :
                                                // Component Manages column props
                                                <ColumnSetting
                                                    source={source}
                                                    removeColumn={this.removeColumn}
                                                    columns={originalColumns}
                                                    activeColumn={activeColumn}
                                                    selectColumn={this.selectColumn}
                                                    column={{ ...column }}
                                                    index={index}
                                                    key={index}
                                                    selectedColumnUpdate={this.selectedColumnUpdate}
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
                    <div className="leftButtons">
                        {formConfigurator ?
                            <button className="btn btn-warning applyForAllButton" onClick={() => this.applyChanges(true)}>Apply For All</button>
                            : null
                        }
                    </div>
                    <div className="rightButtons">
                        <button className="btn btn-danger" onClick={this.toggleModal}>Cancel</button>
                        <Button color="primary" onClick={this.applyChanges}>Apply Changes</Button>
                    </div>
                </ModalFooter>
            </Modal >
        )
    }

    render() {
        return (
            <div className="table-settings">
                <button className="btn settings-button btn-sm" onClick={this.toggleModal}>
                    <i className="fa fa-bars"></i>
                </button>

                {
                    this.state.modal &&
                    this.modalWrapper()
                }
            </div>
        )
    }
}



