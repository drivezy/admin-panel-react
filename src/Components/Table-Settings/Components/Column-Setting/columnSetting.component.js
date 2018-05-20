import React, { Component } from 'react';
import './columnSetting.component.css';
import _ from 'lodash';

// import { SetPreference } from './../../Utils/preference.utils';

// import { changeArrayPosition } from './../../Utils/js.utils';

import { Collapse, Card, CardBody, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Switch from './../../../Forms/Components/Switch/switch';

export default class TableSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            column: this.props.column
        }
    }

    toggleSetting = () => {
        let column = this.state.column;
        column.expanded = !column.expanded;
        this.setState(column);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const { column } = this.state;
        const { columns } = this.props;

        return (

            <div className="column-setting">
                <div className="column-label">
                    <div className="item-label" onClick={() => this.props.selectColumn(column)}>
                        {column.columnTitle ? column.columnTitle : columns[column.column].column_name}
                    </div>
                    <div className="column-toggle" onClick={this.toggleSetting}>
                        <i className="fa fa-chevron-down"></i>
                    </div>
                </div>

                {/* // Expanded Column Configuration */}
                <Collapse isOpen={column.expanded} className="column-configuration">
                    <Card>
                        <CardBody>
                            <form>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Column Header</label>
                                    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Column Name" />
                                </div>

                                <div class="form-group">
                                    <label for="exampleInputEmail1">
                                        Hyperlink
                                                                </label>
                                    <Switch name="column_hyperlink" />
                                </div>
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </form>
                        </CardBody>
                    </Card>
                </Collapse>
                {/* // Column Configuration Ends */}

            </div>
        )
    }
}



