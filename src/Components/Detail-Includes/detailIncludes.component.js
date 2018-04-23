import React, { Component } from 'react';
import { CategorizeDataForTabs}  from './../../Utils/genericDetail.utils';

export default class DetailIncludes extends Component {
    constructor(props) { 
        super(props);
        //responseArray
        
        this.state= { 

        };
    }

    componentWillReceiveProps(nextProps) { 
        // @TODO check if props are different
        console.log(nextProps);
        if(Object.keys(nextProps.responseArray).length)  {
            const tabs = CategorizeDataForTabs(nextProps.responseArray);
            console.log(tabs);
        }
    }

    render() {
        return (
            <div>
                detail incldues
            </div>
        )
    }
}