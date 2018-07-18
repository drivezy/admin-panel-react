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
 *    closeModal={() => this.setState({ isVisible: false })}
 * />
 */

import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import './modalWrapper.component.css';

export default class ModalWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            modals: [] // Array maintained for opening multiple modals at the same time
        }
    }

    unsafe_componentwillreceiveprops(nextProps) {
        if (this.state.isVisible != nextProps.isVisible) {
            this.setState({ isVisible: nextProps.isVisible });
        }
    }

    openModal = ({ ...args }) => {
        let { modals } = this.state;
        args.isVisible = true;
        var index = modals.push({ ...args })
        this.setState({ modals });
    }

    // closeModal = ({ ...args }) => {
    //     const { onClose } = this.state;
    //     this.setState({ isVisible: false });
    //     if (typeof onClose == 'function') {
    //         onClose({ ...args });
    //     }
    // }
    closeModal = (modal, key) => {
        let { modals } = this.state;
        modals.splice(key, 1);

        this.setState({ modals });
    }


    render() {

        const { modals, size = 'lg' } = this.state;

        return (
            <div className="modals-wrapper">
                {
                    modals.map((modal, key) =>
                        <Modal key={key} size={size} isOpen={modal.isVisible} toggle={() => {
                            console.log(modal, key);
                            this.closeModal(modal, key)
                        }
                        } className={this.props.className} backdrop={this.state.backdrop}>
                            {
                                modal.modalHeader ?
                                    <ModalHeader toggle={() => {
                                        console.log(modal, key);
                                        this.closeModal(modal, key)
                                    }}>{modal.modalHeader()}</ModalHeader>
                                    :
                                    modal.headerText ?
                                        <ModalHeader toggle={() => {
                                            this.closeModal(modal, key)


                                        }}>{modal.headerText}</ModalHeader>
                                        : null
                            }

                            {
                                modal.modalBody &&
                                // <ModalBody>
                                modal.modalBody()
                                // </ModalBody>
                            }

                            {
                                modal.modalFooter &&
                                <ModalFooter>
                                    {modal.modalFooter()}
                                </ModalFooter>
                            }
                        </Modal>
                    )
                }

            </div>
        )
    }
}
