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
import $ from 'jquery';
import ThemeUtil from './../../Utils/theme.utils';



const SpotlightTab = (keys) =>

    <Row className="spot-light" id='spotlight' ref={this.spotlightCompRef}>
        <Col sm="12">
            <Card body className="tab-card">
                <CardTitle>Configure Keys</CardTitle>
                <CardText>
                    Spotlight helps you quickly access different menus in Panel . You can also search cars, vehicles, booking
                    , cities and quickly navigate to the page by pressing enter
                </CardText>
                
                <div className="custom-actions flex">
                {
                    keys.length&&
                    keys.map((value, key) => {
                        console.log(value, key);
                    })
                }
            </div >
                {/* <div class="col-md-6 col-md-offset-3">
                                <span>
                                    <div class="col-md-5">
                                        <span>{this.state.keys[0].key}</span>
                                    </div>
                                    <div class="col-md-2" ng-if="!$last">
                                        <strong style="display:inline;">+</strong>
                                    </div>
                                </span>
                </div>
                 */}
                
                {
                    this.keys ? 
                    console.log(this.keys) : null
                }

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

    componentDidMount()  {
        // document.getElementById('spotlight').addEventListener("keydown", () => {
        //     console.log("Test successful");
        // });
    
    }

    themes = ThemeUtil.getThemes();

    spacing = ThemeUtil.getSpacings();
    
    applyChanges = () => {
        const { selectedTheme, selectedSpacing } = this.state;

        ThemeUtil.setTheme(selectedTheme);

        ThemeUtil.setSpacing(selectedSpacing);

        ModalManager.closeModal();
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

    addKeyListener = () => {

        const tempKey = [];
        document.addEventListener('keydown' , e => { this.keyboardListener(e);  })
    }

    removeKeyListener = () => {
        document.removeEventListener('keydown' , e => console.log(e))
    }


    toggle = (tab) => {
        if (tab == 2) {
            // this.spotlightCompRef.current.focus()  

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

            setTimeout( () => {
                 if (this.state.keys.length < 2) {
                    tempKey.push({
                        key: event.key,
                        keyCode: event.keyCode
                    });
                    
                   // this.setState({ keys : tempKey })
                   const { keys} = this.state;
                   keys.push(tempKey);
                   this.setState({keys});
                    // this.state.keys.push(tempKey);
                    // if( this.state.keys.length == 2)
                        for(var i=0;i<2;i++){
                            for (var j=0;j<2;j++){
                                console.log(this.state.keys[j][i].key);
                            }
                        }
                            // console.log(this.state.keys);
                 }
                
            });
           
            
        }

        render() {
            const { activeTab, selectedTheme, selectedSpacing, _handleEscKey, keys } = this.state;
            return (
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
            )
        }
    }



