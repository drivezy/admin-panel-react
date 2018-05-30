import React, { Component } from 'react';
import './spotlightSearch.component.css';

// import { Link } from 'react-router-dom';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


import { GetMenus } from './../../Utils/menu.utils';
import { Location } from './../../Utils/location.utils';
import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';

export class Spotlight extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            menus: [],
            searchText: ''
        }
    }

    openModal = () => {
        this.setState({ isOpen: !this.state.isOpen, menus: GetMenus() });
    }

    searchMenus = (text) => {
        this.setState({ searchText: text });
    }

    redirectTo = (state) => {
        this.setState({ isOpen: !this.state.isOpen });
        Location.navigate({ url: state.url });
    }

    render() {

        const { menus, searchText, isOpen } = this.state;

        if (isOpen) {
            // document.getElementById('spotlight-input').focus();
        }

        let matches = [];

        if (searchText) {
            menus.forEach((module) => {
                module.menus.forEach((menu) => {
                    if (menu.name.toLowerCase().indexOf(searchText) != -1) {
                        matches.push(menu);
                    }
                });
            });
        }

        return (
            <Modal autoFocus={true} size="lg" isOpen={isOpen} toggle={this.openModal} fade={false} className="spotlight-search-modal">
                <ModalBody>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                <i className="fa fa-search"></i></span>
                        </div>
                        <input id="spotlight-input" type="text" className="form-control" onChange={(event) => this.searchMenus(event.target.value)} placeholder="Type to Search" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                </ModalBody>

                {/* Menus matching Text */}

                {
                    searchText
                    &&
                    <div className="card">
                        {
                            (matches.length == 0)
                            &&
                            <div className="card-header">
                                No matching records
                            </div>
                        }
                        <ul className="list-group list-group-flush">
                            {matches.slice(0, 5).map((match, key) => (<li onClick={() => this.redirectTo(match)} key={key} className="list-group-item">{match.name}</li>))}
                        </ul>
                    </div>
                }

                {/* Menus Ends */}
            </Modal>
        )
    }
}


