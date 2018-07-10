import React, { Component } from 'react';
import { SSL_OP_NO_QUERY_MTU } from 'constants';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import ModalWrapper from './../../Wrappers/Modal-Wrapper/modalWrapper.component';
import './confirm-utils.css';

export class ConfirmModalComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            message: ''
        }
    }

    confirmModal({ message, callback }) {
        this.setState({ isVisible: true, message, callback });
    }

    confirm = (callback) => {
        this.setState({ isVisible: false });
    }

    toggle = () => {
        this.setState({ isVisible: !this.state.isVisible });
    }

    closeModal = () => {
        this.setState({ isVisible: false })
    }

    modalData = ({ message, callback }) => {
        return (
            <div className="confirm-modal">
                <div className="modal-body">
                    <p>
                        {message}
                    </p>
                </div>
                <div className="modal-footer curved-bottom">
                    <div className="action-button">
                        <button className="btn btn-secondary" onClick={(e) => this.closeModal()}>Cancel</button>
                        <button className="btn btn-danger" onClick={(e) => this.confirm(callback())}>Confirm</button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { isVisible, message, callback } = this.state;
        return (
            <div>
                <Modal size="md" isOpen={isVisible} toggle={this.toggleModal} className="form-settings-modal">
                    <ModalHeader toggle={this.toggleModal}>
                        Confirm
                    </ModalHeader>
                    <ModalBody>
                        {this.modalData({ message: this.state.message, callback: this.state.callback })}
                    </ModalBody>
                </Modal>
                {/* <ModalWrapper
                    size='md'
                    isVisible={isVisible}
                    modalBody={<this.modalData message={this.state.message} callback={this.state.callback} />}
                    // modalBody={() => this.modalData({ message: this.state.message, callback: this.state.callback })}
                    headerText="Confirm"
                /> */}
            </div>
        )
    }
}

export class ConfirmUtils {
    _currentGlobalLoader = null;
    static RegisterConfirm(ref) {
        this._currentGlobalLoader = ref;
    }
    static confirmModal({ message, callback }) {
        if (this._currentGlobalLoader && this._currentGlobalLoader.confirmModal) {
            this._currentGlobalLoader.confirmModal({ message, callback });
        }
    }
}
