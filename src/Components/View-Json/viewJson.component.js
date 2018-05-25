import React, { Component } from 'react';
import './viewJson.css';

import ModalWrapper from './../../Wrappers/Modal-Wrapper/modalWrapper.component';

export default class ViewJson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preview: null,
            isVisible: false
        }
    }

    modalData = ({ value }) => {
        return (
            <div> <pre>{JSON.stringify(value, null, '\t')} </pre></div>
        )
    }

    openModalForViewValue = () => {
        const { isVisible, preview } = this.state;
        if (!preview) {
            return null;
        }

        const data = JSON.parse(preview);
        return (
            <ModalWrapper
                isVisible={isVisible}
                modalBody={() => this.modalData({ value: data })}
                headerText="Json View"
            />
        );
    }

    showJsonView = (value, event) => {
        this.setState({ preview: value, isVisible: true });
    }

    render() {
        const { textToView } = this.props;
        let html = textToView.substr(0, 30) + "....";
        return (
            <div className="view-json">
                <a className="text-data" onClick={(e) => this.showJsonView(textToView)}>{html}</a>
                {this.openModalForViewValue()}
            </div>
        )
    }
}
