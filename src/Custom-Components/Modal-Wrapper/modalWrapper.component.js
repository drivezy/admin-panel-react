/**
 * Modal wrapper 
 * Accepts various props such as isVisible(boolean), headerText, modalHeader, modalBody, modalFooter, closeModal(function)
 * To render header, either pass modalHeader component or header text
 * rest modalBody and modalFooter is optional
 * 
 * e.g. 
 * <ModalWrap 
 *    isVisible={isVisible}
 *    headerText="tesfh" 
 *    modalBody={() => (<h1> hudgdub</h1>)} 
 *    loseModal={() => this.setState({ isVisible: false })}
 * />
 */

import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ModalWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: props.isVisible || false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isVisible != nextProps.isVisible) {
            this.setState({ isVisible: nextProps.isVisible });
        }
    }

    toggleModal = () => {
        const { closeModal } = this.props;

        // this.setState({ isVisible: false });
        if (typeof closeModal == 'function') {
            closeModal();
        }
    }

    render() {
        const { headerText, modalHeader, modalBody, modalFooter } = this.props;
        const { isVisible } = this.state;

        return (
            <Modal isOpen={isVisible} toggle={this.toggleModal} className={this.props.className} backdrop={this.state.backdrop}>
                {
                    modalHeader ?
                        <ModalHeader toggle={this.toggleModal}>{modalHeader()}</ModalHeader>
                        :
                        headerText ?
                            <ModalHeader toggle={this.toggleModal}>{headerText}</ModalHeader>
                            : null
                }

                {
                    modalBody &&
                    <ModalBody>
                        {modalBody()}
                    </ModalBody>
                }

                {
                    modalFooter &&
                    <ModalFooter>
                        {/* <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button> */}
                        {modalFooter()}
                    </ModalFooter>
                }
            </Modal>
        )
    }
}
