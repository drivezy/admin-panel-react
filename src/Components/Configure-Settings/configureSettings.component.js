import React, { Component } from 'react';
import './configureSettings.component.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, ModalBody, ModalFooter,
    TabContent, TabPane, Nav, NavItem, NavLink, Row, Col
} from 'reactstrap';

import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import { SetItem } from './../../Utils/localStorage.utils';
import ThemeUtil from './../../Utils/theme.utils';

export default class ConfugreSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            selectedTheme: ThemeUtil.getCurrentTheme()
        }
    }

    themes = ThemeUtil.getThemes();

    applyChanges = () => {
        const { selectedTheme } = this.state;

        ThemeUtil.setTheme(selectedTheme);

        ModalManager.closeModal();
    }

    selectTheme = (theme) => {
        this.setState({ selectedTheme: theme });
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        const { activeTab, selectedTheme } = this.state;
        return (
            <div className="configure-settings">
                <ModalBody>
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
                                <Col sm="12">
                                    <Card body className="tab-card">
                                        <CardTitle>Configure Keys</CardTitle>
                                        <CardText>
                                            Spotlight helps you quickly access different menus in Panel . You can also search cars, vehicles, booking
                                            , cities and quickly navigate to the page by pressing enter
                                        </CardText>
                                    </Card>

                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>

                </ModalBody>
                <ModalFooter>
                    <div>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={() => this.applyChanges()}>Apply Changes</Button>
                    </div>
                </ModalFooter>
            </div>
        )
    }
}



