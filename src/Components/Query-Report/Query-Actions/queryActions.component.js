import React, { Component } from 'react';


import { Collapse, Card, CardBody } from 'reactstrap';

export default class QueryActions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actions: this.props.actions
        }
    }

    componentDidMount() {
    }

    displayActions = () => {


    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // if (nextProps.column) {
        //     this.setState({ column: nextProps.column });
        // }
    }

    render() {
        const { actions } = this.state;
        return (
            <div className="display-action">


                {/* {actions.map((action, key) =>
                    <div>11</div>
                )} */}
            </div>
        )
    }
}