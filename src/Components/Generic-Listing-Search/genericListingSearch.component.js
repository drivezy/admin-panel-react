import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

import SelectBox from './../Forms/Components/Select-Box/selectBox';

import { SubscribeToEvent, UnsubscribeEvent } from './../../Utils/stateManager.utils';
//import { SelectFromOptions, BuildUrlForGetCall, IsUndefinedOrNull, IsUndefined } from './../../Utils/common.utils';

import './genericListingSearch.component.css'
import GLOBAL from './../../Constants/global.constants';

import { SelectFromOptions } from './../../Utils/common.utils';
import { Location } from './../../Utils/location.utils';
import { GetTime, TimeOperation } from './../../Utils/time.utils';
import { Get } from './../../Utils/http.utils';
import { BuildUrlForGetCall } from './../../Utils/common.utils';



// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


let activeColumn = {};



export default class ListingSearch extends React.Component {

    urlParams = Location.search();

    constructor(props) {
        super(props);

        this.state = {
            isCollapsed: true,
            filterArr: [],
            query: '',
            sort: null,
            order: null,
            activeFilter: {},
            scopes: [],
            selectedColumn: {},
            getObj: {}
        };
    }

    /**
     * Resets all columns back to only one blank query
     */
    resetColumns = () => {
        // this.state.filterArr = [this.filterObj];
        // this.state.filterArr = [];
        // this.state.filterArr.push(this.filterObj);

        this.state.filterArr = [
            [{ ...this.filterObj }]
        ];
        // this.setState({ filterArr: [this.filterObj] });
    }

    callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex }) {
        filterArr[parentIndex][childIndex].filter = filterArr[parentIndex][childIndex].filterField[0];
        this.setState({ filterArr });
        this.filterChange(filterArr[parentIndex][childIndex].filter, { parentIndex, childIndex, dontPropagateFocus: true });
    }

    /**
     * Invoked when Filter is selected
     * @param  {string} filter
     * @param  {} {parentIndex
     * @param  {} index
     * @param  {} dontPropagateFocus}
     */
    filterChange(select) {
        let valueColumnType = "input";
        let { filterArr } = this.state;

        this.setState({
            selectedColumn: select
        })

        activeColumn = select;
    }

    /**
    * Fetches async data from server and used to select reference type data
    * @param  {string} val
    * @param  {} index
    * @param  {} queryField
    */
    getInputRecord = async ({ input: val, select, queryFieldName } = {}) => {

        console.log(activeColumn);


        if (val) {
            const { filterArr } = this.state;
            const displayName = activeColumn.referenced_model.display_column;
            const queryField = queryFieldName ? queryFieldName : displayName;
            let url = activeColumn.referenced_model.route_name;
            const options = {
                query: queryField + ' like %22%25' + val + '%25%22'
            };

            if (activeColumn.sorting_type) {
                options.query += " and " + activeColumn.column.sorting_type;
            }

            url = BuildUrlForGetCall(url, options);
            const result = await Get({ url, urlPrefix: GLOBAL.ROUTE_URL });


            if (queryFieldName) {
                return result.response;
            }
            const response = result.response.map((option) => {
                return { ...option, ...{ label: option[displayName], value: option['id'] } }
            });
            return { options: response };



        }
    }


    // convertToInputField = function(obj, indexObj) {
    convertToInputField = function ({ data, attr = 'inputField', dateRange = false }) {

        let query = '';

        //console.log(data);
        //console.log(activeColumn);
        this.setState({
            getObj: data
        })

        const paramProps = {
            history: this.props.history, match: this.props.match
        };

        const urlParams = this.urlParams;

        query += activeColumn.column_name + '=' + data.id;

        urlParams.search = query;

        Location.search(urlParams, { props: paramProps });

    };

    // Initialize the controller
    initialize() {
        //const { content } = this.props;
        console.log(this.props);

        // filterObj is a basic data structure that is defined and used
        // across this controller
        // @todo Should rewrite this part
        this.filterObj = {
            selectField: {},
            filterField: this.filterType,
            column: {},
            filter: {},
            inputField: null,
            selectValue: {},
            joinMethod: " OR ",
            slot: { startDate: null, endDate: null },
        };
    }

    activeFilter = (index) => {
        this.state.activeFilter = {};
        const { filters = [] } = this.props;
        filters.forEach((filter, key) => {
            if (index == filter.id) {
                this.setState({ activeFilter: filter });
            }
        });
    }


    render() {
        const { props } = this;
        const { dictionary, history, match } = this.props;
        const { selectedColumn } = this.state;
        const { getObj } = this.state;

        console.log(selectedColumn);
        console.log(getObj);
        return (

            <div className="listing-search-container">
                {

                    <div className="listing-search-tool">
                        <div className="listing-select-tool">
                            <SelectBox onChange={(name, data) => {
                                this.filterChange(data)
                            }}
                                value={selectedColumn} field='display_name' options={dictionary} placeholder='Column' />
                        </div>
                        <div className="listing-input-tool">
                            {selectedColumn.column_type ? (
                                <SelectBox
                                    onChange={(event, data) => this.convertToInputField({ data, attr: 'selectValue' })}
                                    value={getObj}
                                    field={selectedColumn}
                                    place-holder="Search"
                                    getOptions={(input) => this.getInputRecord({ input })} />
                            ) : (
                                    <input type="text"
                                        className="input-select"
                                        placeholder={`Search ${selectedColumn.label}`}
                                    />
                                )}
                        </div>
                    </div>
                }
            </div>
        );
    }
}
