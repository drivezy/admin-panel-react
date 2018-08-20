import React, { Component } from 'react';
import './partnerDealAdd.component.css';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Get, Post} from 'common-js-util';
import { API_HOST } from './../../../../Constants/global.constants';

export default class DealAdd extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            financingOptions: [],
            carsOptions:[]
        }
    }
    /**
     * For Getting Financing Options in Select Box
     */
    getFinancingOptions = async() => {
        const result = await Get({
            url: "lookupValue?query=lookup_type=93&limit=100",
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ financingOptions: result.response });
        }
    }
    /**
     * For Getting Cars Options in Select Box
     * Passing city_id from data of the detail page
     */
    getCars = async() => {
        const result = await Get({
            url: `car?query=city_id=2&active=1&limit=200`, //replace 2 with city_id
            urlPrefix: API_HOST
        });
        if (result.success) {
            this.setState({ carsOptions: result.response });
        }
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal })
    }

    render() {
        return (
            <Modal size="lg" isOpen={this.state.modal} toggle={this.toggleModal} className="partner-deal-add">
                <ModalHeader toggle={this.toggleModal}>
                    Add Deal
                    <button type="button" class="btn btn-xs btn-info">
                        <i class="fa fa-get-pocket"></i>
                    </button>
                    <button type="button" class="btn btn-xs btn-info">
                        <i class="fa fa-hdd-o"></i>
                    </button>
                </ModalHeader>

                <ModalBody>
                    
                </ModalBody>

            </Modal>
        );
    }
}