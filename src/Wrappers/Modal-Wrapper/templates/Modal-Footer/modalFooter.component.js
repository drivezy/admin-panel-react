import React, { Component } from 'react';
import './modalFooter.component.css';

export default class ModalFooter extends Component {
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
            <div className="modal-footer">
                {/* <div className="row justify-content-">
                    <div className="left">

                    </div>
                    <div className="right">

                    </div>
                </div> */}


                <div className="modal-actions row justify-content-end">
                    {/* <Button color="secondary" onClick={handleReset}>
                        Clear
                    </Button>

                    <button className="btn btn-primary" type="submit">
                        Submit
                </button> */}
                </div>
            </div>
        )
    }
}
