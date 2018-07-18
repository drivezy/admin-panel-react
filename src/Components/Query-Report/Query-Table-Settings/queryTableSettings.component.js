import React, { Component } from 'react';
import './queryTableSettings.css';
import _ from 'lodash';

import { SetPreference } from './../../../Utils/query.utils';

import { changeArrayPosition } from './../../../Utils/js.utils';

import { Collapse, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import QueryColumnSetting from './../Query-Column-Setting/queryColumnSetting.component';
import { IsObjectHaveKeys } from './../../../Utils/common.utils';
export default class QueryTableSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            selectedColumns: this.props.selectedColumns || [],
            tempSelectedColumns: this.props.selectedColumns || [],
            columns: this.props.columns,
            list: {},
            activeColumn: {},
            tempColumns: this.props.columns
        }
    }


    // toggleModal = () => {
    //     this.setState({ modal: !this.state.modal, activeColumn: {}, tempSelectedColumns: this.props.selectedColumns })
    // }

    // toggleList = (index) => {
    //     let obj = this.state.list;
    //     obj[index] = !obj[index];
    //     this.setState({ list: obj });
    // }

    // addColumn = (column) => {
    //     let selectedColumns = this.state.tempSelectedColumns;

    //     selectedColumns.push({
    //         column: column.parent + "." + column.id, headingCollapsed: true, heading: ""
    //     });

    //     this.setState({ tempSelectedColumns: selectedColumns })
    // }

    // removeColumn = (column) => {
    //     let selectedColumns = this.state.tempSelectedColumns;

    //     selectedColumns = selectedColumns.filter((entry) => (entry.column != column.column));

    //     this.setState({ tempSelectedColumns: selectedColumns })
    // }

    // toggleColumn = (column) => {
    //     column.expanded = !column.expanded
    // }

    // selectColumn = (column, index) => {
    //     if (typeof column != 'string') {
    //         column.index = index;
    //         this.setState({ activeColumn: column });
    //     }
    // }

    // moveSelectedUp = () => {
    //     this.moveSelectedItem(-1);
    // }

    // moveSelectedDown = () => {
    //     this.moveSelectedItem(1);
    // }

    // moveSelectedItem = (key) => {
    //     let activeColumn = this.state.activeColumn;
    //     let index = this.state.activeColumn.index;
    //     let result = changeArrayPosition(this.state.tempSelectedColumns, index, index + key)
    //     activeColumn.index = result.index;
    //     this.setState({ tempSelectedColumns: result.array, activeColumn: activeColumn });
    // }

    // addSplit = () => {
    //     let ext = Math.floor(Math.random() * 1000);
    //     const selectedColumns = this.state.tempSelectedColumns;
    //     selectedColumns.push("e-split-" + ext);

    //     selectedColumns.push("s-split-" + ext);
    //     this.setState({ selectedColumns });
    // }

    // applyChanges = async () => {
    //     const result = await SetPreference(this.props.listName, this.state.tempSelectedColumns);
    //     result.success ? this.setState({ modal: !this.state.modal }) : null;
    //     this.props.onSubmit(this.state.tempSelectedColumns);
    // }

    componentDidMount() {
        //const co = JSON.stringify(this.state.columns);
        // this.setState({ tempColumns: JSON.parse(co) });
        this.setState({ tempColumns: { ...this.state.columns } });
        //SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
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
        const { tempColumns } = this.state

        // const regexForPickingAfterLastDot = /[^\.]+$/;
        selectedColumns.push({
            headingCollapsed: true, heading: "", id: column.id, object: column.parent, column: column.column_name, index: column.parent + '.' + column.column_name
            // headingCollapsed: true, heading: "", object: column.parent, column: column.name, index: column.parent + '.' + column.name
            // headingCollapsed: true, heading: "", object: column.parent.match(regexForPickingAfterLastDot)[0], column: column.name, columnObj: column
            // column: column.parent + "." + column.id, headingCollapsed: true, heading: ""
        });

        this.setState({ tempSelectedColumns: selectedColumns })
        console.log(this.state.tempSelectedColumns);
        // this.setState({ tempSelectedColumns: selectedColumns })

        //this.removeColumnFromLeft(column);

        let value = column.parent + '.' + column.id;
        delete tempColumns[value];
        this.setState({ tempColumns });

    }

    // removeColumnFromLeft(column) {
    //     const { tempColumns } = this.state;
    //     console.log(tempColumns);
    //     let value = column.parent+ '.' +column.path;
    //     // delete tempColumns['invoice_details.cgst'];
    //     delete tempColumns[value]
    //     this.setState({ tempColumns });

    // }

    removeColumn = (column) => {
        let selectedColumns = this.state.tempSelectedColumns;
        const { tempColumns } = this.state;
        selectedColumns = selectedColumns.filter((entry) => {
            //console.log(column, entry);
            const isSameName = entry.column != column.column;
            if (isSameName) {
                return true;
            }
            return (column.object != entry.object);
        });

        this.setState({ tempSelectedColumns: selectedColumns })
        //        this.addColumnToLeft(column);


        this.addColumnToLeft(column);
    }


    addColumnToLeft(column) {
        const { tempColumns, columns } = this.state;
        let tempValueOfColumn = columns[column.object + '.' + column.id];
        // tempColumns.push(tempValueOfColumn);
        const index = tempValueOfColumn.parent + '.' + tempValueOfColumn.id;
        tempColumns[index] = tempValueOfColumn;
        //tempColumns[column.path] = tempColumns.push(tempValueOfColumn);
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
        if (item.label.split("-")[0] == "seperator") {
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
        const { tempSelectedColumns } = this.state;
        const searchedColumns = {};

        for (var i in tempSelectedColumns) {
            if (tempSelectedColumns[i].name.toString().toLowerCase().indexOf(event.target.value) != -1) {
                searchedColumns[i] = tempSelectedColumns[i];
            }
        }
        this.state.leftSearchText = event.target.value;
        this.state.searchedColumns = searchedColumns;
        this.expandAll();
    }


    applyChanges = async (overRide) => {
        const { listName } = this.props;
        const { tempSelectedColumns } = this.state;
        let layout;
        const result = await SetPreference({ parameter: listName, selectedColumns: this.state.tempSelectedColumns, override_all: overRide ? 1 : 0 });


        if (result.success) {
            this.setState({ modal: !this.state.modal });
            if (IsObjectHaveKeys(layout)) {
                layout.column_definition = tempSelectedColumns;
            } else {
                const { response } = result;
                response.column_definition = JSON.parse(response.value);
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
        const { columns, tempSelectedColumns, activeColumn, tempColumns } = this.state;

        const selectedIds = [];

        for (let value of tempSelectedColumns) {
            if (typeof value != 'string') {
                selectedIds.push(value.column);
            }
            // if (typeof value != 'string') {
            //     selectedIds.push(parseInt(value.value.column.split('.').pop()));
            // }
        }


        const leftColumns = _.groupBy(tempColumns, 'parent');

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
                                        <input type="text" className="search-box" placeholder="Search Columns" />
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
                                                                        {entry.column_name}
                                                                    </div>
                                                                    <div className="icon-holder">
                                                                        <button className="add-column btn btn-sm btn-light" onClick={() => this.addColumn(entry)} >
                                                                            <i className="fa fa-external-link-square" aria-hidden="true"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>


                                                            )

                                                            )


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
                                            // Component Manages column props
                                            <QueryColumnSetting removeColumn={this.removeColumn} columns={columns} activeColumn={activeColumn} selectColumn={this.selectColumn} column={column} index={index} key={index} />
                                            // Column Setting Ends
                                        )
                                    }
                                </ListGroup>

                            </div>
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.applyChanges}>Apply Changes</Button>
                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal >
        )
    }

    render() {
        return (
            <div className="table-settings">
                <Button color="secondary" size="sm" onClick={this.toggleModal}>
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