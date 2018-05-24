import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

class CustomTooltip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltipOpen: false
        };
    }
    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen,
        });
    }

    render() {
        const { html, id } = this.props;
        return (
            <div id={id}>
                <Tooltip placement="auto" isOpen={this.state.tooltipOpen} target={id} toggle={this.toggle}>
                    <span>{html}</span>
                </Tooltip>
            </div>
        )
    }
}

export default CustomTooltip;