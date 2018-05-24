import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

import SelectBox from './../Forms/Components/Select-Box/selectBox';

import { SubscribeToEvent, UnsubscribeEvent } from './../../Utils/stateManager.utils';
//import { SelectFromOptions, BuildUrlForGetCall, IsUndefinedOrNull, IsUndefined } from './../../Utils/common.utils';

import './genericListingSearch.component.css'
import GLOBAL from './../../Constants/global.constants';

import { SelectFromOptions, IsUndefined } from './../../Utils/common.utils';
import { Location } from './../../Utils/location.utils';
import { GetTime, TimeOperation } from './../../Utils/time.utils';
import { Get } from './../../Utils/http.utils';
import { BuildUrlForGetCall } from './../../Utils/common.utils';
import DatePicker from './../Forms/Components/Date-Picker/datePicker';


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
            getObj: {},
            inputValue: ''
        };
    }

    /**
     * Resets all columns back to only one blank query
     */
    resetColumns = () => {
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

    convertToInputField = (data) => {
        let query = '';
        this.setState({
            getObj: data
        })

        const paramProps = {
            history: this.props.history, match: this.props.match
        };
        switch (activeColumn.column_type) {
            case 116: case 117:
                query += activeColumn.column_name + '=' + data.data.id;
                break;

            default:
                query += activeColumn.column_name + '=' + data.data;
                break;
        }

        const urlParams = this.urlParams;
        urlParams.search = query;
        Location.search(urlParams, { props: paramProps });

    };

    // Initialize the controller
    initialize() {
        //const { content } = this.props;

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

    callFunction = () => {
        let query = '';
        const urlParams = this.urlParams;

        const paramProps = {
            history: this.props.history, match: this.props.match
        };

        query += activeColumn.column_name + ' like' + this.state.inputValue;
        urlParams.search = query;
        Location.search(urlParams, { props: paramProps });

    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.callFunction();
            return;
        }

        this.setState({ inputValue: this.state.inputValue + e.key })
    }


    render() {
        const { props } = this;
        const { dictionary, history, match } = this.props;
        const { selectedColumn = {} } = this.state;
        const { referenced_model = {} } = selectedColumn;
        const { getObj } = this.state;

        return (
            <div className="listing-search-container">
                {
                    <div className="listing-search-tool">
                        <div className="listing-select-tool">
                            <SelectBox onChange={(data) => {
                                this.filterChange(data)
                            }}
                                value={selectedColumn} field='display_name' options={dictionary} placeholder='Column' />
                        </div>
                        <div className="listing-input-tool">
                            {referenced_model ? (
                                <SelectBox
                                    onChange={(data) => this.convertToInputField({ data })}
                                    value={getObj.data}
                                    field={referenced_model.display_column}
                                    place-holder="Search"
                                    getOptions={(input) => this.getInputRecord({ input })} />
                            ) :
                                (
                                    <input type="text"
                                        className="input-select"
                                        placeholder={`Search ${selectedColumn.display_name}`}
                                        onChange={event => { this.setState({ query: event.target.value }) }}
                                        onKeyPress={this.handleKeyPress}
                                    //value={value}
                                    // { data: data.target.value, event: event }
                                    //onChange={(data) => this.convertToInputField({ data: data.target.value })}
                                    //onKeyPress={(data) => this.convertToInputField({ data: data.target.value })}
                                    //value={}
                                    />
                                )
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}
