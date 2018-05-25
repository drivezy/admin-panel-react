import React, { Component } from 'react';
import { Button, Row, Col, Tooltip } from 'reactstrap';

export default class CustomTooltip extends Component {
    constructor(props) {
        const generateID = Math.random().toString(36).substr(2, 9);
        super(props);
        this.state = {
            tooltipOpen: false,
            id: `tooltip-${generateID}`
        };
    }
    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen,
        });
    }

    render() {
        const { html, title, placement } = this.props;
        return (
            <span id={this.state.id} className="tooltip-element">
                {html}
                <Tooltip placement={placement} isOpen={this.state.tooltipOpen} target={this.state.id} toggle={this.toggle}>
                    <Row>
                        <Col>
                            <span>{title}</span>
                        </Col>
                    </Row>
                </Tooltip>
            </span>
        )
    }
}
