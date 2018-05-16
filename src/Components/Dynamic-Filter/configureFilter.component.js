import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

import { SubscribeToEvent, UnsubscribeEvent } from './../../Utils/stateManager.utils';
import { SelectFromOptions, BuildUrlForGetCall } from './../../Utils/common.utils';
import { RawStringQueryToObject } from './../../Utils/dynamicFilter.utils';
import { Get } from './../../Utils/http.utils';
import { GetTime } from './../../Utils/time.utils';

import SelectBox from './../Forms/Components/Select-Box/selectBox';

import GLOBAL from './../../Constants/global.constants';

import './dynamicFilter.css';

export default class ConfigureDynamicFilter extends Component {
    stringFilterArr = [" LIKE ", " NOT LIKE ", " IS NULL ", " IS NOT NULL "];
    numericFilterArr = [" = ", " != ", " > ", " >= ", " < ", " <= ", " IS NULL ", " IS NOT NULL "];
    booleanFilterArr = [" = ", " != ", " IS NULL ", " IS NOT NULL "];
    dateFilterArr = [" =", " != ", " BETWEEN ", " NOT BETWEEN ", " > ", " >= ", " < ", " <= ", " IS NULL ", " IS NOT NULL "];
    filterType = [" = ", " != ", " LIKE ", " NOT LIKE ", " > ", " >= ", " < ", " <= ", " IS NULL ", " IS NOT NULL "];
    booleanObj = [{
        id: 1,
        name: "Yes"
    }, {
        id: 0,
        name: "No"
    }];
    sorts = ["desc", "asc"];
    scopes = [];
    dateFormat = GLOBAL.DATE_FORMAT;
    firstLoad = true;

    urlParams = {};

    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true,
            filterArr: [],
            query: '',
            sort: {},
            order: {},
            activeFilter: {}
        };
        SubscribeToEvent({ eventName: 'ToggleAdvancedFilter', callback: this.listenToggleAdvancedFilter });
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }

    componentWillUnmount() {
        UnsubscribeEvent({ eventName: 'ToggleAdvancedFilter', callback: this.listenToggleAdvancedFilter });
        UnsubscribeEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }

    userDataFetched = (data) => {
        this.setState({ currentUser: data });
    }

    listenToggleAdvancedFilter = (collapse, filterContent) => {
        // urlParams = $location.search();

        // Filter Content from portlet table is assigned to
        // content here so , the input fields are preselected
        if (filterContent) {
            // self.content = filterContent;
        }

        if (this.firstLoad) { // makes sure initialize is called only once
            this.firstLoad = false;
            this.initialize();
        }

        if (!collapse) {
            const active_filter = this.urlParams.filter;

            // IF there is an active filter then add that first 
            if (active_filter && !this.urlParams.query) {
                this.resetColumns();
                this.activeFilter(active_filter);
                this.prepopulate(this.state.activeFilter.filter_query);
            } else if (this.urlParams.query) {
                this.prepopulate(this.urlParams.query);
            } else {
                this.resetColumns();
            }
        }

        this.setState({ isCollapsed: collapse });
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

    /**
     * Adds 'or' column query for given index
     * @param  {int} index
     */
    makeOr(index) {
        const { filterArr } = this.state;
        filterArr[index].push({ ...this.filterObj });
        this.setState({ filterArr });
    }

    /**
     * Adds and column
     */
    addColumn = () => {
        const { filterArr } = this.state;
        const arr = [];
        arr.push({ ...this.filterObj });
        filterArr.push(arr);
        this.setState({ filterArr });
    };

    // Invoked when column is selected
    columnChange = async (column, { parentIndex, childIndex, setValue = false }) => {
        const { filterArr } = this.state;

        if (setValue) {
            filterArr[parentIndex][childIndex].column = column;
            this.setState({ filterArr });
        }
        // var defer = $q.defer();

        // inputFiled , filter.selected and html are variables. initializing it with null
        filterArr[parentIndex][childIndex].inputField = null; // variable used by the third input
        filterArr[parentIndex][childIndex].filter = null; // variable used by the second filter
        // html for the third input is dynamically built considering the first and second inputs ,
        // .html will save the html content which is dynamically injected to the template
        filterArr[parentIndex][childIndex].html = null;

        let selectedFieldToBeReturned;
        switch (column.column_type) {
            // if column type is number
            case 107:
                filterArr[parentIndex][childIndex].filterField = this.numericFilterArr;
                filterArr[parentIndex][childIndex].inputField = 0;

                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;

            // if Column type is string
            case 108:
                // for a column of type string , stringFilterArr is to be assiged to second filter
                filterArr[parentIndex][childIndex].filterField = this.stringFilterArr;
                filterArr[parentIndex][childIndex].inputField = null;
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;

            // if column type is date
            case 109:
                this.dateFormat = "YYYY-MM-DD";
                filterArr[parentIndex][childIndex].filterField = this.dateFilterArr;
                filterArr[parentIndex][childIndex].inputField = GetTime(this.dateFormat);
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;

            // if column type is datetime
            case 110:
                filterArr[parentIndex][childIndex].filterField = this.dateFilterArr;
                filterArr[parentIndex][childIndex].inputField = GetTime('YYYY-MM-DD HH:mm:ss');
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;

            // if column type is boolean
            case 111:
                filterArr[parentIndex][childIndex].filterField = this.booleanFilterArr;
                filterArr[parentIndex][childIndex].selectValue.selected = this.booleanObj[0];
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;
            // defer.resolve(filterArr[parentIndex][childIndex].inputField);

            // if Column is referenced type: dropdown
            case 116:
                filterArr[parentIndex][childIndex].filterField = this.booleanFilterArr;
                if (column.referenced_model_id) {
                    var url = column.referenced_model.route_name;
                    if (column.sorting_type) {
                        url += "?query=" + column.sorting_type;
                    }

                    const res = await Get(url);
                    filterArr[parentIndex][childIndex].referenceObj = res.data.response;
                    this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                    return filterArr[parentIndex][childIndex].referenceObj;
                    // defer.resolve(filterArr[parentIndex][childIndex].referenceObj);
                }

            // if Column is referenced type
            case 117:
                filterArr[parentIndex][childIndex].filterField = this.booleanFilterArr;

                filterArr[parentIndex][childIndex].inputField = null;
                filterArr[parentIndex][childIndex].selectValue = {};
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].referenceObj;

            default:
                filterArr[parentIndex][childIndex].inputField = null;
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;
        }
    }

    callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex }) {
        filterArr[parentIndex][childIndex].filter = filterArr[parentIndex][childIndex].filterField[0];
        this.setState({ filterArr });
        this.filterChange(filterArr[parentIndex][childIndex].filter, { parentIndex, childIndex, dontPropagateFocus: true });
        // @TODO add focus once rest development is done
        // setTimeout(function () {
        //     var obj = {
        //         valueColumnType: "select",
        //         focusElement: "filter",
        //         indexObj: indexObj
        //     };
        //     focusFilterField(obj);
        // });
    }

    /**
     * Invoked when Filter is selected
     * @param  {string} filter
     * @param  {} {parentIndex
     * @param  {} index
     * @param  {} dontPropagateFocus}
     */
    filterChange(filter, { parentIndex, childIndex, dontPropagateFocus, setValue }) {
        let valueColumnType = "input";
        const { filterArr } = this.state;

        if (setValue) {
            filter = filter.value; // @TODO once select box is fixed, remove this line
            filterArr[parentIndex][childIndex].filter = filter;
            // filterArr[parentIndex][childIndex].filter = filter;
            this.setState({ filterArr });
        }
        const column = filterArr[parentIndex][childIndex].column;

        // html, inputField are fields used by different filters, so initiailizing it
        filterArr[parentIndex][childIndex].html = null;

        if (filter.includes("IS NULL") || filter.includes("IS NOT NULL")) {
            return false;
        }
        let child;
        switch (column.column_type) {
            case 107: // column type number
                filterArr[parentIndex][childIndex].html = (<input type='text' className='form-control' ng-model='b.inputField' placeholder='Input Value' />);
                break;

            case 108: // column type string
                filterArr[parentIndex][childIndex].html = <input type='text' className='form-control' ng-model='b.inputField' placeholder='Input Value' />;
                break;

            // @TODO add date field
            // case 109: // if a date picker is required
            //     dateInput(filter, indexObj, self.dateFormat);
            //     break;

            // case 110: // Datetime
            //     self.dateFormat = 'YYYY-MM-DD HH:mm:00';
            //     dateInput(filter, indexObj);
            //     break;

            case 111:
                child = filterArr[parentIndex][childIndex];
                filterArr[parentIndex][childIndex].html = (<SelectBox onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex })} value={child.selectValue} options={this.booleanObj} field='name' place-holder="Select Value" />);
                // filterArr[parentIndex][childIndex].html = (<custom-select-field ng-model="b.selectValue" extra-params="{parentIndex: $parent.$childIndex, childIndex: $childIndex}" call-it="configureFilter.convertToInputField" place-holder="Select Value" iterate-item="name" obj="configureFilter.booleanObj" />);
                valueColumnType = "select";
                break;

            case 116: // for reference data , prefilled
                child = filterArr[parentIndex][childIndex];
                filterArr[parentIndex][childIndex].inputField = null;
                filterArr[parentIndex][childIndex].html = (<SelectBox onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex })} value={child.selectValue} options={child.referenceObj} field='name' place-holder="Select Value" />);
                // filterArr[parentIndex][childIndex].html = (<custom-select-field ng-model="b.selectValue" extra-params="{parentIndex: $parent.$childIndex, childIndex: $childIndex}" call-it="configureFilter.convertToInputField" place-holder="Select Value" iterate-item="{{b.column.selected.referenced_model.display_column}}" obj="b.referenceObj" />);
                valueColumnType = "select";
                break;

            case 117: // for reference : async
                filterArr[parentIndex][childIndex].inputField = null;

                if (filterArr[parentIndex][childIndex].column.selected.referenced_model.name == "User" && !filterArr[parentIndex][childIndex].asyncResults) {
                    filterArr[parentIndex][childIndex].asyncResults = [{
                        id: this.state.currentUser.id,
                        email: "Current User"
                    }];
                }

                filterArr[parentIndex][childIndex].html = (
                    <SelectBox
                        onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex })}
                        value={child.selectValue}
                        field={child.column.selected.referenced_model.display_column}
                        place-holder="Select Value"
                        getOptions={(input) => this.getInputRecord({ input, parentIndex, childIndex })}
                    />
                );
                // filterArr[parentIndex][childIndex].html = (<custom-select-field required="true" ng-model="b.selectValue" call-it="configureFilter.convertToInputField" extra-params="{parentIndex: $parent.$childIndex, childIndex: $childIndex}" place-holder="Type to load data" iterate-item="{{b.column.selected.referenced_model.display_column}}" async="configureFilter.getInputRecord(search,{parentIndex: $parent.$childIndex, childIndex: $childIndex})" obj="b.asyncResults" />);
                break;

            default:
                filterArr[parentIndex][childIndex].inputField = "";
                if (filter != " IS NULL " && filter != " IS NOT NULL ") {
                    filterArr[parentIndex][childIndex].html = (<input type="text" className="form-control" ng-model="b.inputField" placeholder="Input Value" />);
                }
                break;
        }

        this.setState({ filterArr });
        // @TODO focus later
        // if (!dontPropagateFocus) {
        //     $timeout(function () {
        //         var obj = {
        //             focusElement: "value",
        //             valueColumnType: valueColumnType,
        //             indexObj: indexObj
        //         };
        //         focusFilterField(obj);
        //     });
        // }
    }

    /**
     * Fetches async data from server and used to select reference type data
     * @param  {string} val
     * @param  {} index
     * @param  {} queryField
     */
    getInputRecord = async ({ input: val, parentIndex, childIndex, queryField }) => {
        if (val) {
            const { filterArr } = this.state;
            queryField = queryField ? queryField : filterArr[parentIndex][childIndex].column.selected.referenced_model.display_column;
            let url = filterArr[parentIndex][childIndex].column.selected.referenced_model.route_name;
            const options = {
                query: queryField + " like \"%" + val + "%\""
            };
            // If a sorting type is specified append it
            if (filterArr[parentIndex][childIndex].column.selected.sorting_type) {
                options.query += " and " + filterArr[parentIndex][childIndex].column.selected.sorting_type;
            }
            url = BuildUrlForGetCall(url, options);
            const response = await Get({ url });
            // Assign the results to array for async ui select

            // @TODO User
            // if (filterArr[parentIndex][childIndex].column.selected.referenced_model.name == "User") {
            //     filterArr[parentIndex][childIndex].asyncResults = [{
            //         id: UserFactory.getUser().id,
            //         email: "Current User"
            //     }];
            // } else {
            //     filterArr[parentIndex][childIndex].asyncResults = [];
            // }

            // // Push the content to the array
            // Array.prototype.push.apply(filterArr[parentIndex][childIndex].asyncResults, response.data.response);
            // this.setState({ filterArr });
            return response.data.response;
        }
    }

    // convertToInputField = function(obj, indexObj) {
    convertToInputField = function ({ data, parentIndex, childIndex }) {
        if (data) {
            const { filterArr } = this.state;
            filterArr[parentIndex][childIndex].inputField = data.id;
            this.setState({ filterArr });
        }
    };

    /**
     * This function is called only if there is something in the url already and filters are to be prefilled
     * once the modal is opened Function prepolates the filterArray with what is in the url
     * @param  {string} query
     */
    prepopulate = async (query) => {
        const filterArr = this.state.filterArr;
        const parentQueries = query.split(" AND ");

        parentQueries.forEach((parentValue, parentIndex) => {
            filterArr[parentIndex] = [];
            const queries = parentValue.split(" OR ");

            queries.forEach(async (value, key) => {
                filterArr[parentIndex].push({ ...this.filterObj });

                // splits each query row to different component
                const queryObj = RawStringQueryToObject(value);

                // assign the value of second params, used in daterange picker
                filterArr[parentIndex][key].slot.endDate = queryObj.secondInputField;

                filterArr[parentIndex][key].column = SelectFromOptions(this.filterObj.selectField, queryObj.selectedColumn, "column_name");

                if (filterArr[parentIndex][key].column.column_type == 116) {
                    const res = await this.columnChange(filterArr[parentIndex][key].column, {
                        parentIndex: parentIndex,
                        childIndex: key
                    })
                    filterArr[parentIndex][key].selectValue = SelectFromOptions(res, queryObj.selectedInput, 'id');

                } else if (filterArr[parentIndex][key].column.column_type == 111) { // Check if column type is boolean
                    filterArr[parentIndex][key].selectValue = SelectFromOptions(this.booleanObj, queryObj.selectedInput, 'id');
                } else if (filterArr[parentIndex][key].column.column_type == 108) {
                    filterArr[parentIndex][key].inputField = queryObj.selectedInput;
                } else if (filterArr[parentIndex][key].column.column_type == 107) { // Check if column type is number
                    queryObj.selectedInput = parseInt(queryObj.selectedInput);
                } else if (filterArr[parentIndex][key].column.column_type == 117) { // If the column is of reference type
                    // If selectedInput is currentUser / change it to currentUser id
                    if (queryObj.selectedInput == 'currentUser') {
                        queryObj.selectedInput = this.state.currentUser.id;
                        filterArr[parentIndex][key].asyncResults = [{
                            id: this.state.currentUser.id,
                            email: 'Current User'
                        }];
                        // defined the asyncResults array and assign it to the the select field
                        filterArr[parentIndex][key].selectValue = filterArr[parentIndex][key].asyncResults[0];
                    } else {
                        const res = await this.getInputRecord(queryObj.selectedInput, {
                            parentIndex: parentIndex,
                            index: key
                        }, 'id');
                        filterArr[parentIndex][key].asyncResults = res;
                        filterArr[parentIndex][key].selectValue = filterArr[parentIndex][key].asyncResults[0];
                    }
                } else {
                    this.columnChange(filterArr[parentIndex][key].column, {
                        parentIndex: parentIndex,
                        childIndex: key
                    });
                }

                this.filterChange(queryObj.selectedFilter, {
                    parentIndex: parentIndex,
                    childIndex: key
                });
                // assign the selected value of input field , first value
                filterArr[parentIndex][key].slot.startDate = queryObj.selectedInput;
                filterArr[parentIndex][key].inputField = queryObj.selectedInput;
                filterArr[parentIndex][key].slot.endDate = queryObj.secondInputField;

                filterArr[parentIndex][key].filter = queryObj.selectedFilter;
                this.setState({ filterArr });
            });
        });
    }

    // Initialize the controller
    initialize() {
        const { content } = this.props;

        // filterObj is a basic data structure that is defined and used
        // across this controller
        // @todo Should rewrite this part
        this.filterObj = {
            selectField: content.dictionary,
            filterField: this.filterType,
            column: {},
            filter: {},
            inputField: null,
            selectValue: {},
            joinMethod: " OR ",
            slot: {},
            // variable added to store the ngModel variable
            // @todo should remove inputField & secondInputField if slot is better
        };

        // If sort is specified in the url , from the predefined options ,
        // assign to sort varialble in accordance to the value of this.urlParams
        if (this.urlParams.sort) {
            this.state.sort = SelectFromOptions(this.sorts, this.urlParams.sort);
        }

        // If order is specified , assign it to object considering the dictionary
        if (this.urlParams.order) {
            this.state.order = SelectFromOptions(content.dictionary, this.urlParams.order, "column_name");
        }

        // var active_filter = $location.search().filter;
        let active_filter;

        // IF there is an active filter then add that first 
        if (active_filter) {
            this.activeFilter(active_filter)
            this.state.query = this.state.activeFilter.filter_query + ' AND ';
        } else {
            this.state.query = '';
        }
        this.setState({ order: this.state.order });
    }

    activeFilter = (index) => {
        this.activeFilter = {};
        this.filters.forEach((filter, key) => {
            if (index == filter.id) {
                this.setState({ activeFilter: filter });
            }
        });
    }

    removeThisRow = ({ parentIndex, childIndex }) => {
        const { filterArr } = this.state;
        filterArr[parentIndex].splice(childIndex, 1);
        if (filterArr[parentIndex].length == 0) {
            filterArr.splice(parentIndex, 1);
        }
        this.setState({ filterArr });
    };

    render() {
        const { isCollapsed, filterArr } = this.state;
        const { content } = this.props;
        return (
            <Collapse isOpen={!isCollapsed}>
                <div className="configure-filter-container">
                    <div className="generic-sub-header">
                        <div className="flex">
                            Create Filter:
                        </div>
                    </div>

                    <div className="configure-filter-body">
                        <form name="filterForm" noValidate>
                            <div className="filters-container">
                                {
                                    filterArr.map((parent, parentIndex) => {
                                        return (
                                            <div key={parentIndex} className="parent-filter">
                                                {
                                                    parentIndex != 0 &&
                                                    <div className="join-line">
                                                        AND
                                                    </div>
                                                }

                                                {
                                                    parent.map((child, childIndex) => {
                                                        const childfilterField = [];
                                                        child.filterField.forEach(filter => childfilterField.push({ name: filter, id: filter }));
                                                        return (
                                                            <div key={childIndex}>
                                                                <div className="flex-box filter-row event-flow">
                                                                    <div className="event-select">
                                                                        {/* <custom-select-field ng-model="child.column" allow-clear="false" extra-params="{index:childIndex,parentIndex:parentIndex}" call-it="this.columnChange"
                                                                            place-holder="Column" obj="child.selectField" iterate-item="display_name" required="true">
                                                                        </custom-select-field> */}

                                                                        <SelectBox onChange={(name, data) => {
                                                                            this.columnChange(data, { parentIndex, childIndex, setValue: true })
                                                                        }}
                                                                            value={child.column} field='display_name' options={child.selectField} placeholder='Column' />
                                                                    </div>
                                                                    <div className="method-select">
                                                                        {/* <custom-select-field ng-model="child.filter" allow-clear="false" extra-params="{index:childIndex,parentIndex:parentIndex}" call-it="this.filterChange"
                                                                            place-holder="Filter" obj="child.filterField">
                                                                        </custom-select-field> */}

                                                                        <SelectBox onChange={(name, data) => this.filterChange(data, { parentIndex, childIndex, setValue: true })} value={child.filter} options={childfilterField} placeholder='Column' />
                                                                    </div>
                                                                    <div className="operator-select">
                                                                        {/* <span id="inject" dynamic="child.html"></span> */}
                                                                        {child.html}
                                                                    </div>
                                                                    {
                                                                        !content.single &&
                                                                        <div className="or-content">
                                                                            <span className="or-text" onClick={() => this.makeOr(parentIndex)}>
                                                                                <b>OR</b>
                                                                            </span>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        !(filterArr.length == 1 && parent.length == 1) &&
                                                                        <div className="remove-event" >
                                                                            <i className="fa fa-times fa-lg" onClick={() => this.removeThisRow({ childIndex, parentIndex })} aria-hidden="true"></i>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        filterArr[parentIndex][childIndex + 1] && filterArr[parentIndex][childIndex + 1].joinMethod &&
                                                                        <div className="join-btn">
                                                                            {filterArr[parentIndex][childIndex + 1].joinMethod}
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className="add_button_section">
                                <div className="add_button cursor-pointer">
                                    <i className="fa fa-plus fa-lg" onClick={this.addColumn} aria-hidden="true"></i>
                                </div>
                            </div>

                            <div className="footer-content nomargin">
                                {/* <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 border-select-filter margin-top-8">
                                    <custom-select-field ng-model="configureFilter.order" place-holder="Order" obj="configureFilter.dictionary" iterate-item="column_name">
                                    </custom-select-field>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 border-select-filter margin-top-8">
                                    <custom-select-field ng-model="configureFilter.sort" place-holder="Sort" obj="configureFilter.sorts">
                                    </custom-select-field>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 border-select-filter margin-top-8" ng-if="configureFilter.scopeGroup.length">
                                    <div className='form-group'>
                                        <div className="input-group select-input-form admin-ui-select">
                                            <span className="input-group-addon">
                                                <i className="fa fa-superscript"></i>
                                            </span>
                                            <multiple-select-field-async ng-model="configureFilter.scopes" obj="configureFilter.scopeGroup" place-holder="Select scopes list"
                                                iterate-item="alias_name">
                                            </multiple-select-field-async>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="text-right">
                                    <button className="btn btn-default" onClick={() => this.closeForm(true)} style={{ margin: '8px' }}>
                                        Close
                                    </button>
                                    <button className="btn btn-info" onClick={this.submit} style={{ margin: '8px' }}>
                                        Go
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Collapse >
        );
    }
}