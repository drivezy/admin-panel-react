import React, { Component } from 'react';


import {
    Card, CardBody, Button
} from 'reactstrap';

export default class QueryHeader extends Component {


    constructor(props) {
        super(props);

        this.state = {
            dataName: this.props.dataName
        }

    }

    componentDidMount(){
        console.log("WOrking");
    }

    render() {
        const { name } = this.state
        return (
            <div className="query-heading"> 
                { name }
            </div>
        )
    }
}