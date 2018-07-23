import React, { Component } from 'react';
import './modalHeader.component.css';

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
