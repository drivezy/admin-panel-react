import React, { Component } from 'react';
import './sideNav.css';
import { GroupBy } from 'common-js-util/build/common.utils'
import { StoreEvent, SubscribeToEvent } from 'state-manager-utility';
import { Get, Put, Post, BuildUrlForGetCall } from 'common-js-util';
import { debounce as Debounce } from 'lodash';
import { HotKeys } from 'react-hotkeys';
import { Card } from 'reactstrap';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';



export default class Sidenav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false,
            searchBarStatus: 0,
            // onCollapse: props.onCollapse
            finalData: {}
        }

        this.debouncedAdvanceSearch = Debounce(this.advancedSearch, 300);
    }


    keyMap = {
        moveUp: 'shift+b',
    }
    handlers = {
        'moveUp': (event) => this.toggleNav(this.state.visible)
    }

    // componentDidMount() {
    //     // const main = document.getElementById("main");

    //     // if (main) {
    //     //     main.addEventListener('click', () => {
    //     //         if (this.state.visible) {
    //     //             this.toggleNav();
    //     //         }
    //     //     })
    //     // }
    //     // this.closeNav();
    // }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'searchMenu', callback: this.searchInMenus });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visible != this.props.visible) {
            this.setState({ visible: this.props.visible });
        }
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.visible != this.props.visible) {
    //         this.setState({ visible: nextProps.visible });
    //     }
    // }

    searchInMenus = (data) => {
        const menus = this.props.menus;
        let matches = [];
        menus.forEach((module) => {
            module.menus.forEach((menu) => {
                if (data != "" && menu.name.toLowerCase().indexOf(data) != -1 && menu.visible == 1) {
                    menu.module = module.name
                    matches.push(menu)
                }
            });
        });

        let sortMenu = GroupBy(matches, 'module')
        StoreEvent({ eventName: 'searchInMenu', data: sortMenu })
    }

    toggleNav = (visible = this.state.visible) => {
        this.props.onCollapse(visible);
    }

    toggleMenu = (menu) => {
        StoreEvent({ eventName: 'toggledMenu', data: menu })
    }

    toggleSearchBar = (searchBarStatus) => {
        if (searchBarStatus) {
            this.setState({ searchBarStatus })
        }
        else {
            this.setState({ searchBarStatus })
        }
    }

    navigate = (url) => {
        this.setState({ searchBarStatus: 0 });
        Location.navigate({ url: url });
    }

    // advancedSearch = (searchText) => {

    //     let values = []

    //     if (searchText.length == 10 && searchText.slice(0, 3) != "INV") {
    //         if ((parseInt(searchText).toString().length == 10) || (/[^a-zA-Z0-9]/.test(searchText) && searchText.indexOf("-") === -1)) {
    //             values.push(2);
    //         }
    //         values.push(1);
    //     }
    //     if (searchText.slice(0, 3) == "TKT") { // if the first 3 characters are tkt , its gonna be a ticket
    //         values.push(6);
    //     }
    //     if (searchText.slice(0, 3) == "INV") {
    //         values.push(8);
    //     }
    //     if ((parseInt(searchText).toString().length == 4 || parseInt(searchText).toString().length == 3) && parseInt(searchText).toString() != "NaN") {
    //         values.push(4);
    //     }
    //     if (searchText.length == 11 && searchText.indexOf("-") === -1) {
    //         if (/\s/g.test((searchText).charAt(4))) { // check if the 4th characted is space
    //             values.push(4);
    //         } else {
    //             values.push(2);
    //         }
    //     }
    //     if (!isNaN(searchText)) { // checking if it is a number , to check for booking id
    //         values.push(8);
    //     }
    //     if (searchText.length == 16) {
    //         values.push(3);
    //     }
    //     if (searchText.indexOf("-") != -1) {
    //         values.push(5)
    //     }

    //     console.log(values)
    // }

    advancedSearch = async (searchText) => {
        let url, result, body, finalData = [], tempData = [], options;

        // To search PNR

        result = await Get({ url: "bookingToken/" + searchText });
       
        // if (result.success) {
        //     result.response.name = searchText;
        //     result.response.url = 'booking/' + result.response.id;
        //     finalData.pnr = result.response   
        // }

        if (result.success) {
            tempData.pnr = []
            finalData.pnr = []

            const data = {
                heading: result.response.token,
                subheading: result.response.tentative_amount,
                lastheading: '',
                image: '',
                link: '/booking/' + result.response.id,
            }

            finalData.pnr.push(data);

        }


        // To search VENDOR
        result = await Post({ url: "searchVendor", body: { search_string: searchText }, hideMessage: true });
        if (result.success) {
            tempData.vendor = []
            finalData.vendor = []
            result.response.map((value) => {
                const data = {
                    heading: value.name,
                    subheading: value.email_id,
                    lastheading: value.primary_contact_number,
                    image: '',
                    link: '/vendor/' + value.id,
                }

                finalData.vendor.push(data);
            })
        }

        // // To search USER    
        result = await Post({ url: "searchUser", body: { search_string: searchText }, hideMessage: true });
        if (result.success) {
            tempData.user = []
            finalData.user = []
            result.response.map((value) => {
                const data = {
                    heading: value.display_name || value.mobile,
                    subheading: value.email,
                    lastheading: value.mobile,
                    image: value.image,
                    link: '/user/' + value.id,
                }

                finalData.user.push(data);
            })

        }

        //To search VEHICLE
        result = await Post({ url: "searchVehicle", body: { search_string: searchText }, hideMessage: true });
        if (result.success) {
            tempData.vehicle = []
            finalData.vehicle = []
            result.response.map((value) => {
                const data = {
                    heading: value.car.name,
                    subheading: value.registration_number,
                    lastheading: '',
                    image: value.car.image,
                    link: '/vehicle/' + value.car.id,
                }

                finalData.vehicle.push(data);
            })
        }

        //To search COUPON

        options = {
            query: 'coupon_code like %22%25' + searchText + '%25%22'
        };
        url = 'coupon';
        url = BuildUrlForGetCall(url, options);

        result = await Get({ url });
        if (result.success && result.response.length) {
            tempData.coupon = []
            finalData.coupon = []
            result.response.map((value) => {
                const data = {
                    heading: value.coupon_code,
                    subheading: value.available ? 'Available' : 'Not Available',
                    lastheading: '',
                    image: '',
                    link: '/campaign/' + value.campaign_id,
                }

                finalData.coupon.push(data);
            })
        }

        //To search TICKET

        options = {
            query: 'ticket_number like %22%25' + searchText + '%25%22'
        };
        url = 'task';
        url = BuildUrlForGetCall(url, options);

        result = await Get({ url });
        if (result.success && result.response.length) {
            tempData.ticket = []
            finalData.ticket = []
            result.response.map((value) => {
                const data = {
                    heading: value.ticket_number,
                    subheading: value.subject,
                    lastheading: '',
                    image: '',
                    link: '/ticket/' + value.id,
                }

                finalData.ticket.push(data);
            })
        }

        this.setState({ finalData });

    }

    render() {
        const { visible, searchBarStatus, finalData } = this.state;
        const { menus } = this.props;

        let myobjects = [];

        return (

            <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
                <div className="parent-sidebar">
                    <div id="mySidenav" className={`sidebar-wrapper no-scrollbar ${visible ? 'expanded' : 'collapsed'}`}>
                        <div className="sidebar-logo">
                            <div className="logo-image">
                                <span className="logo-container">
                                    <img src={require('./../../Assets/images/logo-main.png')} />
                                </span>
                                <span className="toggle-icon" onClick={() => this.toggleNav()}>
                                    <i className={`fa ${visible ? 'fa-chevron-left' : 'fa-chevron-down'}`}></i>
                                </span>

                            </div>
                            <div className="sidebar-menus">
                                <div className="menus">

                                    <div className={`menu-item ${searchBarStatus ? 'expanded' : 'collapsed'}`} onClick={() => this.toggleSearchBar(!searchBarStatus)}>

                                        <div className="menu-label">
                                            <div className="menu-icon">
                                                <i className={`menu-icon fa ${'fa-search'}`}></i>
                                            </div>
                                            <div className="item-label `${visible ? 'menu-visible' : 'menu-hide'}`">
                                                Search
                                        </div>
                                        </div>
                                    </div>

                                    {
                                        menus.map((menu, key) => (
                                            <div className="menu-item" key={key} onClick={() => this.toggleMenu(menu)}>
                                                <div className="menu-label">
                                                    <div className="menu-icon">
                                                        <i className={`menu-icon fa ${menu.image ? menu.image : 'fa-flickr'}`}></i>
                                                    </div>
                                                    <div className="item-label `${visible ? 'menu-visible' : 'menu-hide'}`">
                                                        {menu.name}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                    {
                        searchBarStatus ?
                            <Card style={{
                                zIndex: '99999', boxShadow: '4px 0 13px 0 rgba(74,74,74,.3), 30px 0 40px 0 rgba(0,0,0,.11)',
                                position: 'absolute', height: '100vh', width: '320px', minHeight: '850px', maxHeight: '120vh'
                            }} className={`${visible ? 'block' : 'none'}`}>

                                <div className="search-textbox">
                                    <i className="fa fa-times" aria-hidden="true" onClick={() => this.setState({ searchBarStatus: 0 })}></i>
                                    <input placeholder="Search" type="text" className="form-control mousetrap search-box" onChange={(e) => this.debouncedAdvanceSearch(e.target.value)} >
                                    </input>
                                </div>

                                {
                                    Object.keys(finalData).length ?
                                        Object.keys(finalData).map((menu) =>
                                            <Card className="search-bar-card">
                                                <div className="search-bar-heading">
                                                    {menu} ({Object.keys(finalData[menu]).length})
                                                </div>
                                                {Object.keys(finalData[menu]).length ?
                                                    <div>
                                                        {Object.keys(finalData[menu]).map((index) => {
                                                            return (
                                                                <div className='side-search-card' onClick={() => this.navigate(finalData[menu][index].link)}>
                                                                    <div className="search-image">
                                                                        {
                                                                            <img src={finalData[menu][index].image} width="80px" />
                                                                        }
                                                                    </div>
                                                                    <div className="search-data">
                                                                        <div className="heading">
                                                                            {finalData[menu][index].heading}
                                                                        </div>
                                                                        <div className="subheading">
                                                                            {finalData[menu][index].subheading}
                                                                        </div>
                                                                        <div className="lastheading">
                                                                            {finalData[menu][index].lastheading}
                                                                        </div>
                                                                    </div>
                                                                </div>)
                                                        })

                                                        }
                                                    </div> :
                                                    <div className="no-data-message">
                                                        No Matches Found
                                                    </div>}

                                            </Card>
                                        )
                                        : <div className="search-instruction">Enter the keyword to search</div>
                                }

                            </Card>
                            :
                            null
                    }
                </div>
            </HotKeys>
        )
    }
}