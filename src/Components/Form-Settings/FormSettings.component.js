
import React, { Component } from 'react';
import './FormSettings.css';
import _ from 'lodash';

import { SetPreference } from './../../Utils/preference.utils';

import { IsObjectHaveKeys } from './../../Utils/common.utils';
import { SubscribeToEvent, UnsubscribeEvent } from './../../Utils/stateManager.utils';
import { changeArrayPosition } from './../../Utils/js.utils';

import Switch from './../Forms/Components/Switch/switch';

import { FormPreferenceEndPoint } from './../../Constants/api.constants';

import { Collapse, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import FormColumnSetting from './../../Components/Form-Settings/Components/Form-Column-Setting/formColumnSetting.component';


export default class FormSettings extends Component {

    constructor(props) {
        super(props);

        const formLayout = this.props.formLayout || {};

        this.state = {
            modal: false,
            layoutName: formLayout.name || 'Default',
            selectedColumns: formLayout.column_definition || [],
            tempSelectedColumns: Array.isArray(formLayout.column_definition) ? [...formLayout.column_definition] : [],
            columns: this.props.columns,
            list: {},
            activeColumn: {},
            formConfigurator: '',
            module: props.module
        }
    }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const formLayout = nextProps.formLayout || {};
        this.state.layoutName = formLayout.name || 'Default';
        this.state.selectedColumns = formLayout.column_definition || [];
    }

    userDataFetched = (data) => {
        let formConfigurator = data.hasRole('form-configurator');
        // for (var i in data.access_object.roleIdentifiers) {
        //     if (data.access_object.roleIdentifiers[i] == 'form-configurator') {
        //         let formConfigurator = data.access_object.roleIdentifiers[i];
        //         this.setState({ formConfigurator });
        //     }
        // }
        this.setState({ formConfigurator });
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

        selectedColumns.push({
            // display_name: column.display_name,
            object: column.parent, column: column.name, headingCollapsed: true, heading: "", index: column.name

            // column: column.parent + "." + column.id, headingCollapsed: true, heading: ""
        });


        this.setState({ tempSelectedColumns: selectedColumns })
    }

    selectColumn = (column, index) => {
        if (typeof column != 'string') {
            column.position = index;
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
        var { position } = this.state.activeColumn;
        var result = changeArrayPosition(this.state.tempSelectedColumns, position, position + key)

        activeColumn.position = result.position;

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
        tempSelectedColumns.push({ split: true, label: "s-split-" + ext });

        tempSelectedColumns.push({ split: true, label: "e-split-" + ext });
        this.setState({ tempSelectedColumns });
    }

    removeSplit = (index, item) => {
        const { tempSelectedColumns } = this.state;
        tempSelectedColumns.splice(index, 1);
        var end;
        if (item.label.split("-")[0] == "e") {
            end = item.label.replace("e", "s");
        } else if (item.label.split("-")[0] == "s") {
            end = item.label.replace("s", "e");
        }

        let endIndex = -1;

        tempSelectedColumns.some((column, key) => {
            if (column.label == end) {
                endIndex = key;
                return true;
            }
        })
        // var endIndex = tempSelectedColumns.indexOf(end);
        if (endIndex != -1) {
            tempSelectedColumns.splice(endIndex, 1);
            this.setState({ tempSelectedColumns });
        }
    };


    applyChanges = async (overRide = false) => {

        const { userId, modelId, listName, source } = this.props;
        let { formLayout } = this.props;
        const { tempSelectedColumns, layoutName } = this.state;
        if(IsObjectHaveKeys(formLayout)) {
            formLayout.name = layoutName;
        }
        const result = await SetPreference({ userId, source, menuId: modelId, name: listName || layoutName, selectedColumns: tempSelectedColumns, layout: formLayout, url: FormPreferenceEndPoint, override_all: overRide ? 1 : 0 });
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
    }

    modalWrapper() {
        // const { columns, tempSelectedColumns, selectedColumns, activeColumn, module } = this.state;
        const { columns, tempSelectedColumns, activeColumn, module, formConfigurator, layoutName } = this.state;

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
                    <input placeholder="Enter Layout Name" type='text' value={layoutName} onChange={e => this.setState({ layoutName: e.target.value })} />
                    {/* <Switch name="abc" rows="3" onChange={props.setFieldValue} value={values[column.name]} /> */}
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
                                            ((column.split) ?
                                                <ListGroupItem className={`${activeColumn.position === index && 'active'}`} tag="button" action key={index} onClick={() => this.selectColumn(column, index)}>
                                                    ---- {column.label} ----
                                                        <span className="close margin-top-4" data-dismiss="alert" aria-label="Close" onClick={() => this.removeSplit(index, column)}>
                                                        <i className="fa fa-times"></i>
                                                    </span>
                                                </ListGroupItem>
                                                :
                                                // Component Manages column props
                                                <FormColumnSetting
                                                    removeColumn={this.removeColumn}
                                                    columns={columns}
                                                    activeColumn={activeColumn}
                                                    selectColumn={this.selectColumn}
                                                    column={column}
                                                    index={index}
                                                    key={index} />
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
                    {formConfigurator ?
                        <Button color="primary" onClick={() => this.applyChanges(true)}>Apply For All</Button>
                        : null
                    }
                    <Button color="primary" onClick={this.applyChanges}>Apply Changes</Button>
                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal >
        )
    }

    render() {
        return (
            <div className="form-settings">
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
