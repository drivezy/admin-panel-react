import React, { Component } from 'react';

import './configureSettings.component.css';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, ModalBody, ModalFooter,
    TabContent, TabPane, Nav, NavItem, NavLink, Row, Col
} from 'reactstrap';
import { HotKeys } from 'react-hotkeys';

import { Mousetrap } from 'react-hotkeys';

import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import { SetItem } from './../../Utils/localStorage.utils';
import { StoreEvent } from './../../Utils/stateManager.utils';
import $ from 'jquery';
import ThemeUtil from './../../Utils/theme.utils';
import { SetUserPreference } from './../../Utils/userPreference.utils';
import SettingsUtil from './../../Utils/settings.utils';
import { Spotlight } from './../../Components/Spotlight-Search/spotlightSearch.component';

const SpotlightTab = (keys) =>

    <Row className="spot-light" id='spotlight' >
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

export default class ConfugreSettings extends Component {

    constructor(props) {
        super(props);
        this.spotlightCompRef = React.createRef();

        this.state = {
            activeTab: '1',
            selectedSpacing: ThemeUtil.getCurrentSpacing(),
            selectedTheme: ThemeUtil.getCurrentTheme(),
            keys: []

        }
    }

    componentDidMount() {
        // document.getElementById('spotlight').addEventListener("keydown", () => {
        //     console.log("Test successful");
        // });

    }

    componentDidUpdate() {
        this.spotlightCompRef.current ? this.spotlightCompRef.current.focus() : ''
    }

    // focusSpotlight() {
    //     // Explicitly focus the text input using the raw DOM API
    //     // Note: we're accessing "current" to get the DOM node
    //     this.spotlightCompRef.current.focus();
    //   }


    themes = ThemeUtil.getThemes();

    spacing = ThemeUtil.getSpacings();

    applyChanges = async () => {
        const { selectedTheme, selectedSpacing } = this.state;
      
        ThemeUtil.setTheme(selectedTheme);

        ThemeUtil.setSpacing(selectedSpacing);

        ModalManager.closeModal();

        console.log(this.state.keys);

        // this.focusSpotlight();
        const result = await SetUserPreference('spotlight', this.state.keys)

        let value = 1

        console.log(result);

        StoreEvent({ eventName: 'launchSpotlight', data: { name: result.response } });

    }

    selectTheme = (theme) => {
        this.setState({ selectedTheme: theme });
    }

    selectSpacing = (theme) => {
        this.setState({ selectedSpacing: theme });
    }

    closeModal = () => {
        ModalManager.closeModal();
    }

    displayKeys = (keys) => {
        console.log(keys);
    }

    addKeyListener = () => {
        const tempKey = [];
        document.addEventListener('keydown', e => { this.keyboardListener(e); })
    }

    removeKeyListener = () => {
        document.removeEventListener('keydown', e => console.log(e))
    }


    toggle = (tab) => {
        if (tab == 2) {


            this.addKeyListener();
        }
        else {
            this.removeKeyListener();
        }

        if (this.state.activeTab !== tab) {


            this.setState({
                activeTab: tab
            });
        }

    }


    keyboardListener = (event) => {

        // let keys = [];
        let tempKey = [];

        event.preventDefault();

        setTimeout(() => {
            if (this.state.keys.length < 2) {
                // tempKey.push({
                //     key: event.key,
                //     keyCode: event.keyCode
                // });

                const tempKey = {
                    key: event.key,
                    keyCode: event.keyCode
                };

                // this.setState({ keys : tempKey })
                const { keys } = this.state;
                keys.push(tempKey);
                this.setState({ keys });
                // this.state.keys.push(tempKey);
                if (this.state.keys.length == 2) {
                    console.log(this.state.keys);

                }
            }

        });


    }

    render() {
        const { activeTab, selectedTheme, selectedSpacing, _handleEscKey, keys } = this.state;

        return (
            <HotKeys focused={true} attach={window} keyMap={this.keys} handlers={this.handlers}>
                <div className="configure-settings">
                    <ModalBody >
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
                        <TabContent activeTab={this.state.activeTab} onKeyPress={() => { console.log('pressed') }}>
                            <TabPane tabId="1" >
                                <Row >
                                    <Col sm="6">
                                        <Card body className="tab-card">
                                            <CardTitle>Choose Theme</CardTitle>
                                            <CardText>
                                                Select one of the below themes for your panel.


                                        </CardText>

                                            <div className="themes">
                                                {
                                                    this.themes.map((theme, key) =>
                                                        <div onClick={() => this.selectTheme(theme)} key={key} className={`${selectedTheme.class == theme.class ? 'active' : null}  ${theme.class} theme-container`}>
                                                            <div className="theme-color">
                                                            </div>
                                                            <div className="theme-name">
                                                                {theme.name}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </Card>
                                    </Col>

                                    <Col sm="6">
                                        <Card body className="tab-card">
                                            <CardTitle>Spacing</CardTitle>
                                            <CardText>
                                                Choose the spacing of elements for the panel.
                                        </CardText>

                                            <div className="spacing">
                                                {
                                                    this.spacing.map((spacing, key) =>
                                                        <div onClick={() => this.selectSpacing(spacing)} key={key} className={`${selectedSpacing.class == spacing.class ? 'active' : null}  ${selectedSpacing.class} theme-container`}>
                                                            <div className="spacing-name">
                                                                {spacing.name}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>

                                            {/* Spacing Section */}
                                            <h3>
                                            </h3>
                                            {/* Spacing Ends */}

                                        </Card>
                                    </Col>

                                </Row>
                            </TabPane>
                            <TabPane tabId="2" >

                                <SpotlightTab />

                                <div className="display-keys-card">
                                    {
                                        (keys.length == 2) &&
                                        keys.map((value, key) =>

                                            <div>
                                                <span key={key} className="display-keys">
                                                    {console.log(value)}
                                                    {value.key}
                                                </span>

                                                {key == 0 &&
                                                    <span> +
                                    </span>}
                                            </div>

                                        )

                                        //    this.displayKeys(keys)
                                    }
                                </div>

                            </TabPane>
                        </TabContent>

                    </ModalBody>
                    <ModalFooter>
                        <div>
                            <Button color="secondary" onClick={this.closeModal}>Cancel</Button>
                            <Button color="primary" onClick={() => this.applyChanges()}>Apply Changes</Button>
                        </div>
                    </ModalFooter>
                </div >
             
              {
                  <Spotlight ref={ (elem) => SettingsUtil.registerModal(elem) } />
              }

            </HotKeys>
        )
    }
}



