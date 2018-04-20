import React, { Component } from 'react';
import './sideNav.css';

export default class Sidenav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false
        }
    }

    componentDidMount() {
        const main = document.getElementById("main");

        if (main) {
            main.addEventListener('click', () => {
                if (this.state.visible) {
                    this.toggleNav();
                }
            })
        }
        this.closeNav();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible != this.props.visible) {
            this.setState({ visible: nextProps.visible });
        }
    }

    openNav = () => {
        const sideNav = document.getElementById("mySidenav");
        const main = document.getElementById("main");
        if (sideNav && main) {
            sideNav.style.width = "250px";
            main.style.marginLeft = "250px";
            document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
        }
    }

    closeNav = () => {
        const sideNav = document.getElementById("mySidenav");
        const main = document.getElementById("main");
        if (sideNav && main) {
            sideNav.style.width = "50px";
            main.style.marginLeft = "50px";
            document.body.style.backgroundColor = "white";
        }
    }

    operation(visible) {
        if (!visible) {
            this.closeNav();
        } else {
            this.openNav();
        }
    }

    toggleNav = (visible = this.state.visible) => {
        // this.state.visible = !visible;
        this.setState({ visible: !visible });
        this.operation(this.state.visible);
    }

    render() {
        const { visible } = this.state;
        this.operation(visible);
        const { menus } = this.props;
        console.log(menus);
        return (
            <div id="mySidenav" className="sidenav">
                <a href="javascript:void(0)" className="closebtn" onClick={() => this.toggleNav()}>
                    <i className={`fas ${visible ? 'fa-chevron-left' : 'fa-bars'}`}></i>
                </a>
                {
                    menus.map((menu, key) => (
                        <a href="#" key={key}>
                            {/* <div className=""> */}
                            <div className={`flex vertical-center  ${visible ? 'menu-visible' : 'menu-hide'}`}>
                                <i className={`menu-icon fas ${menu.image}`}></i>
                                <span className="menu-name">
                                    {menu.name}
                                </span>
                            </div>
                        </a>
                    ))
                }
            </div>
        )
    }
}