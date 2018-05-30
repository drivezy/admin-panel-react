import React, { Component } from 'react';
import './configureSettings.component.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, ModalFooter,
    TabContent, TabPane, Nav, NavItem, NavLink, Row, Col
} from 'reactstrap';

import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import { SetItem } from './../../Utils/localStorage.utils';


export default class ConfugreSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            selectedTheme: {}
        }
    }

    themes = [
        { theme: 'drivezy-light-theme', name: 'Light', class: 'light-theme' },
        { theme: 'drivezy-dark-theme', name: 'Dark', class: 'dark-theme' },
        { theme: 'drivezy-drivezy-theme', name: 'Drivezy', class: 'drivezy-theme' }
    ];

    applyChanges = () => {
        const { selectedTheme } = this.state;
        SetItem('CURRENT_THEME', selectedTheme);
        const div = document.getElementById('parent-admin-element');
        this.themes.forEach((themeDetail, key) => {
            if (themeDetail.theme != selectedTheme.theme) {
                div.classList.remove(themeDetail.theme);
                return;
            }

        });
        div.classList.add(selectedTheme.theme);

        ModalManager.closeModal();
    }

    selectTheme = (theme) => {
        this.selectTheme = theme;
        this.setState({ selectedTheme: theme });
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    footer = () => {
        // const self = new ConfugreSettings();
        return (
            <div>
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                <Button color="primary" onClick={() => this.applyChanges()}>Apply Changes</Button>
            </div>
        )
    }

    render() {

        const { activeTab, selectedTheme } = this.state;

        return (
            <div className="configure-settings">
                <div>
                    <Nav tabs>
                        <NavItem>
                            <NavLink className={`${activeTab == 1 ? 'active' : ''}`} onClick={() => { this.toggle('1'); }}>
                                Themes
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={`${activeTab == 2 ? 'active' : ''}`} onClick={() => { this.toggle('2'); }}>
                                Spotlight
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <Col sm="12">
                                    <Card body className="tab-card">
                                        <CardTitle>Choose Theme</CardTitle>
                                        <CardText>
                                            Select one of the below themes for your panel.


                                        </CardText>

                                        <div className="themes">
                                            {
                                                this.themes.map((theme, key) => {
                                                    return (
                                                        <div onClick={() => this.selectTheme(theme)} key={key} className={`${selectedTheme.class == theme.class ? 'active' : null}  ${theme.class} theme-container`}>
                                                            <div className="theme-color">
                                                            </div>
                                                            <div className="theme-name">
                                                                {theme.name}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col sm="6">
                                    <Card body>
                                        <CardTitle>Special Title Treatment</CardTitle>
                                        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                        <Button>Go somewhere</Button>
                                    </Card>
                                </Col>
                                <Col sm="6">
                                    <Card body>
                                        <CardTitle>Special Title Treatment</CardTitle>
                                        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                        <Button>Go somewhere</Button>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </div>
            </div>
        )
    }
}



