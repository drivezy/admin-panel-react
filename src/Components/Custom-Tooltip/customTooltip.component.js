
  /**
   *  modified Component which replace reactstrap tooltip from tooltip library
   */
import React, { Component } from 'react';
/**
 * import library:
 * Tooltip: showing some content during hover of any custom tool component
 */
import Tooltip from '@atlaskit/tooltip';
export default class CustomTooltip extends Component {
    constructor(props) {
        super(props);
   }
   
   render() {
        const { html, title, placement } = this.props;
        return (
            /* showing content in custom tool component */
            <Tooltip position={placement} content={title} >
                <span className="tooltip-element">
                    {html}
                </span>
            </Tooltip>
        )
    }
}

