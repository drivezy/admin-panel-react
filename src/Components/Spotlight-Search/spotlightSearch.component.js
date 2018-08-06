import React, { Component } from 'react';
import './spotlightSearch.component.css';

import { Modal, ModalBody } from 'reactstrap';
import { HotKeys } from 'react-hotkeys';

import { GetMenus } from './../../Utils/menu.utils';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';

let subMenu;

// let searchLength = 0;

export class Spotlight extends Component {

    constructor(props) {
        super(props);

        this.searchInput = React.createRef();

        this.menuItem = React.createRef();

        this.state = {
            isOpen: false,
            menus: [],
            searchText: '',
            activeMenu: {},
            searchList: []
            // searchLength: 0
        }
    }

    currentIndex = 0;


    keyboardControlMap = {
        moveUp: 'up',
        moveDown: 'down',
        enter: 'enter'
    }

    keyboardHandlers = {
        'moveUp': (event) => { this.traverse(0) },
        'moveDown': (event) => {  this.traverse(1) },
        'enter': (event) => { this.onSelect(event)}
    }


    openSpotlightModal = () => {
        if (!this.state.isOpen) {
            setTimeout(() => { this.searchInput.current.focus() }, 300);
        }
        this.setState({ isOpen: !this.state.isOpen, menus: GetMenus() });
    }

    searchMenus = (event) => {
        this.setState({ searchText: event.target.value });
    }

    keyboardPress = (event) => {
        if (this.state.searchText) {
            if (event.which == 40) {
                this.searchInput.current.blur();
                var menus = document.getElementsByClassName('spotlight-menu-list')[0];
                if (menus) {
                    subMenu = menus.querySelectorAll('.list-group-item')[0]
                    subMenu.focus();
                    subMenu.classList.add('hovered');
                }
            } else if (event.which == 38) {
                this.searchInput.current.blur();
            }
        }
    }

    onSelect = (event) => {
        const { searchList = [] } = this.state
        const  searchLength  = searchList.length-1;
        if (event.which == 40) {
            this.searchInput.current.blur();
            var menus = document.getElementsByClassName('spotlight-menu-list')[0];
            if (menus) {
                subMenu = menus.querySelectorAll('.list-group-item')[0]
                subMenu.focus();
                subMenu.classList.add('hovered');
            }
        } else if (event.which == 38) {
            this.searchInput.current.blur();
        }
        else if (event.which == 13){
            this.redirectTo(searchList[searchLength][this.currentIndex]);
        }
    }

    traverse = (direction) => {
        subMenu.classList.remove('hovered');
        if (direction) {
            if (subMenu.nextSibling) {
                this.currentIndex++;
                subMenu = subMenu.nextSibling;
                subMenu.classList.add('hovered');
            }
        } else {
            if (subMenu.previousSibling) {
                this.currentIndex--;
                subMenu = subMenu.previousSibling;
                subMenu.classList.add('hovered');
            }
        }
    }

    redirectTo = (state) => {
        
        this.setState({ isOpen: !this.state.isOpen });
        Location.navigate({ url: '/'+state.url });
    }

    render() {

        const { menus, searchText, isOpen, searchList } = this.state;

        if (isOpen) {
            // document.getElementById('spotlight-input').focus();
        }

        let matches = [];

        if (searchText) {
            const { searchList = [] } = this.state
            menus.modules.forEach((module) => {
                module.menus.forEach((menu) => {
                    if (menu.name.toLowerCase().indexOf(searchText) != -1) {
                        menu.visible ? matches.push(menu) : null
                    }
                });
            });
            searchList.push(matches);
            //this.searchLength = searchText.length-1;
            // this.setState({searchLength: searchText.length-1});
        }

        return (
            <HotKeys attach={window} focused={true} keyMap={this.keyboardControlMap} handlers={this.keyboardHandlers}>

                <Modal autoFocus={true} size="lg" isOpen={isOpen} toggle={this.openSpotlightModal} fade={false} className="spotlight-search-modal">
                    <ModalBody>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">
                                    <i className="fa fa-search"></i></span>
                            </div>

                            {/* <TypeaheadComponent onChange={this.redirectTo} options={matches} /> */}

                            <input ref={this.searchInput} id="spotlight-input" type="text" className="form-control" onKeyDown={this.keyboardPress.bind(this)} onChange={(event) => {this.currentIndex = 0; this.searchMenus(event)}} placeholder="Type to Search" aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                    </ModalBody>
                    {/* Menus matching Text */}
                    {
                        searchText
                        &&
                        <div className="card spotlight-menu-list">
                            {
                                (matches.length == 0)
                                &&
                                <div className="card-header">
                                    No matching records
                             </div>
                            }
                            <ul className="list-group list-group-flush">
                                {
                                    matches.slice(0, 10).map((match, key) => (
                                            <li
                                            ref={this.menuItem} 
                                            onKeyDown={this.onSelect} 
                                            onClick={() => this.redirectTo(match)} key={key}
                                            className="list-group-item">{match.name}
                                            </li>
                                ))
                                }
                            </ul>
                        </div>
                    }
                    {/* Menus Ends */}

                </Modal>
            </HotKeys>
        )
    }
}