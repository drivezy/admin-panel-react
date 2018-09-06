import React, { Component } from 'react';

import './moreLess.component.css';

export default class MoreLess extends Component {

    constructor(props){
        super(props);

        this.state = {
            expanded: true
        }
    }

    expand = () =>{
        const { expanded } = this.state;
        this.setState({ expanded : !expanded })
    }

    render() {
        const { expanded } = this.state;
        const { data } = this.props;


        return (
            data.length > 50 ?
            <div className="data"> 
                <div className={`${expanded ? `less` : `more` }`}>     
                    {data} 
                </div>
                <a onClick={(e) => {e.preventDefault(); this.expand();}}>&nbsp;&nbsp;&nbsp;{expanded ? '...Show More' : 'Show Less'}</a>
            </div>
            :
            <div className="data">
                {data}
            </div>
        )
    }
}