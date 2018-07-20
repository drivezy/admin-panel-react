/*********************************************************
 * Applies the component received under filter object
 * Filter object is supposed to have path which is 
 * resolved at run time.
 * 
 *********************************************************/

import React, { Component } from 'react';
import LoadAsyncComponent from './../../Async/async';
import Filters from './../../Constants/filters';

export default class ParseComponent extends Component {
    renderData = (data) => (
        <span>{data} </span>
    )

    render() {
        const { filter: filterObj, data } = this.props;
        let Comp;
        if (filterObj && filterObj.path) {
            let filter = Filters[filterObj.name];
            try {
                Comp = LoadAsyncComponent(() => import(`./../${filter.path}`));
                return (
                    <Comp data={data} />
                )
            } catch (e) {
                console.error('Issue in filter.path');
                console.error(e);
                this.renderData(data);
            }
        }
        return this.renderData(data);
    }
}
