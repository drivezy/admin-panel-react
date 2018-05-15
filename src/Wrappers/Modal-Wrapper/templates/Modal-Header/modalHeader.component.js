import React, { Component } from 'react';
import './modalHeader.component.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container,
    Row, Col,
    ModalHeader
} from 'reactstrap';

import { withFormik, Field, Form } from 'formik';
import Yup from 'yup';

import TableSettings from './../../../../Components/Table-Settings/TableSettings.component';
// import {}
// import { Post, Put } from './../../Utils/http.utils';

export default class ModalHeaderComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    closeModal = () => {
        // ModalManager.closeModal();
    }

    render() {

        const { payload } = this.props;

        return (
            <div className="">
                <div className="row justify-content-">

                    {/* <div className="left"> */}
                        {/* <ModalHeader toggle={this.toggle}>Modal title</ModalHeader> */}

                    {/* </div> */}
                    {/* <div className="right">

                    </div> */}
                </div>
            </div>
        )
    }
}
