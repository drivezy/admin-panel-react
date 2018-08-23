import React, { Component } from 'react';
import './spotlightSearch.component.css';
import { Get, Put, Post } from 'common-js-util';
import { Modal, ModalBody } from 'reactstrap';
import { HotKeys } from 'react-hotkeys';
import API_HOST from './../../Constants/global.constants';
import { GetMenus } from './../../Utils/menu.utils';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';

let subMenu;



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
            searchList: [],
            querySearchList: []
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
        'moveDown': (event) => { this.traverse(1) },
        'enter': (event) => { this.onSelect(event) }
    }


    openSpotlightModal = () => {
        this.currentIndex = 0;
        if (!this.state.isOpen) {
            setTimeout(() => { this.searchInput.current.focus() }, 300);
        }
        this.setState({ isOpen: !this.state.isOpen, menus: GetMenus() });
    }

    searchMenus = (event) => {
        let searchText = event.target.value
        this.setState({ searchText: searchText });
    }

    advancedSearch = () => {
        {
            const { searchText } = this.state;
            let obj = {};
            if (searchText.length == 10 && searchText.slice(0, 3) != "INV") {
                if (parseInt(searchText).toString().length == 10) {
                    obj = 2;
                }
                else if (/[^a-zA-Z0-9]/.test(searchText) && searchText.indexOf("-") === -1) {
                    obj = 2;
                }
                else {
                    obj = 1;
                }
            }
            else if (searchText.slice(0, 3) == "TKT") { // if the first 3 characters are tkt , its gonna be a ticket
                obj = 6;
            } else if (searchText.slice(0, 3) == "INV") {
                obj = 8;
            } else if ((parseInt(searchText).toString().length == 4 || parseInt(searchText).toString().length == 3) && parseInt(searchText).toString() != "NaN") {
                obj = 4;
            } else if (searchText.length == 11 && searchText.indexOf("-") === -1) {
                if (/\s/g.test((searchText).charAt(4))) { // check if the 4th characted is space
                    obj = 4;
                } else {
                    obj = 2;
                }
            } else if (!isNaN(searchText)) { // checking if it is a number , to check for booking id
                obj = 8;
            } else if (searchText.length == 16) {
                obj = 3;
            } else if (searchText.indexOf("-") != -1) {
                obj = 5;
            }
            // else {
            //     obj = 2;     //@ToDp : Carefully write execution for this case
            // }

            this.searchVal(obj, searchText);
        }
    }

    searchVal = async (obj, searchText) => {
        let result;
        let querySearchList = []
        let url
        let body
        switch (obj) {

            // To search PNR
            case 1:
                url = "bookingToken/" + searchText;
                result = await Get({ url: url });
                if (result.success && result.response.length) {
                    result.response.name = searchText;
                    result.response.url = 'booking/' + result.response.id;
                    querySearchList.push(result.response)
                    this.setState({ querySearchList });


                    Location.navigate({ url: '/booking/' + result.response.id });
                }
                break;

            // To search User
            case 2:     //@TODO MAKE A LIST PAGE WHERE WE SHOULD REDIRECT
                // getSetValue.setValue(searchText);

                url = '/searchUsers?searchText=' + searchText;
                // url = '/searchUsers';
                const queryParam = { searchText };
                Location.navigate({ url: url });
                // Location.navigate({ url, queryParam });
                break;

            // To search Payment
            case 3:     //@TODO MAKE A LIST PAGE WHERE WE SHOULD REDIRECT
                // getSetValue.setValue(searchText);

                break;

            // To search vehicle
            case 4:     //@TODO MAKE A LIST PAGE WHERE WE SHOULD REDIRECT
                
                    url = '/searchVehicles?searchText=' + searchText;
                    // url = '/searchVehicles';
                    //const queryParam = { searchText };
                    Location.navigate({ url: url });
                
                break;

            // To search coupon
            case 5:

                body = 'coupon_code="' + searchText + '"';
                result = await Get({ url: "coupon?query=" + body });
                if (result.success && result.response.length) {
                    url = '/campaign/' + result.response[0].campaign_id;
                    Location.navigate({ url: url })
                }
                break;

            // To search Ticket
            case 6:

                // url = "/ticket/" + searchText + "\"";
                // result = await Get({ url: url });

                body = 'ticket_number="' + searchText + '"';
                result = await Get({ url: "task?query=" + body });
                if (result.success && result.response.length) {
                    url = '/ticket/' + result.response[0].id;
                    Location.navigate({ url: url })
                }
                break;

            // To search Vendor
            case 7:     //@TODO MAKE A LIST PAGE WHERE WE SHOULD REDIRECT

                break;

            // To search Invoice
            case 8:

                body = 'invoice="' + searchText + '"';
                result = await Get({ url: "expenseVoucher?query=" + body });
                if (result.response.length) {
                    url = '/expenseVoucher/' + result.response[0].id;
                    Location.navigate({ url: url })
                }
                break;

            case 9:     //@TODO MAKE A LIST PAGE WHERE WE SHOULD REDIRECT

                break;

            default:
                this.setState({ querySearchList: [] })
                break;
        }
    }


    keyboardPress = (event) => {
        if (event.target.value) {
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
            else if (event.which == 13) {

                this.redirectTo(this.state.querySearchList[this.state.querySearchList.length - 1]);

                this.advancedSearch();

            }
        }
    }

    onSelect = (event) => {
        const { searchList = [], querySearchList = [] } = this.state;
        const searchLength = searchList.length - 1;
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
        else if (event.which == 13) {
            if (searchList.length)
                this.redirectTo(searchList[searchList.length - 1][this.currentIndex]);
            else if (querySearchList.length)
                this.redirectTo(searchList[searchList.length - 1][this.currentIndex]);
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
        if (state) {
            Location.navigate({ url: '/' + state.url });
        }
    }

    render() {

        const { menus, searchText, isOpen, searchList } = this.state;
        let searchLength;
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
            const searchLength = searchText.length - 1;
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

                            <input ref={this.searchInput} id="spotlight-input" type="text" className="form-control" onKeyDown={this.keyboardPress.bind(this)} onChange={(event) => { this.currentIndex = 0; this.searchMenus(event) }} placeholder="Type to Search" aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                    </ModalBody>
                    {/* Menus matching Text */}
                    {
                        searchText
                        &&
                        matches.length != 0 &&
                        <div className="card spotlight-menu-list">
                            {/* {
                                (matches.length == 0)
                                &&
                                <div className="card-header">
                                    No matching records
                             </div>
                            } */}
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