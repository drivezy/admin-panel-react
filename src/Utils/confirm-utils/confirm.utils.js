import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import './confirm-utils.css';

export class ConfirmModalComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            message: ''
        }
    }

    confirmModal({ message, callback, title = '', input = [] }) {
        this.setState({ isVisible: true, message, callback, title, input });
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

    modalData = ({ message, callback, input }) => {
        return (
            <div className="confirm-modal">
                <div className="modal-body">
                    <p>
                        {message}
                    </p>
                </div>
                {
                    input.map((column, key) => {
                        return (<div>
                            <input type='text' value={column.value} placeholder={column.placeholder}
                                onChange={e => {
                                    input[key].value = e.target.value;
                                    this.setState({ input });
                                }}
                            /> 
                        </div>
                        )
                    })
                }
                <div className="modal-footer curved-bottom">
                    <div className="action-button">
                        <button className="btn btn-secondary" onClick={(e) => this.closeModal()}>Cancel</button>
                        <button className="btn btn-danger" onClick={(e) => this.confirm(callback(input))}>Confirm</button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { isVisible, input } = this.state;
        return (
            <div>
                <Modal size="md" isOpen={isVisible} toggle={this.toggleModal} className="form-settings-modal">
                    <ModalHeader toggle={this.toggleModal}>
                        Confirm
                    </ModalHeader>
                    <ModalBody>
                        {this.modalData({ message: this.state.message, callback: this.state.callback, input })}
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
