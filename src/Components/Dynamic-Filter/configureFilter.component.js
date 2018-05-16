import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

import { SubscribeToEvent, UnsubscribeEvent } from './../../Utils/stateManager.utils';
import { SelectFromOptions, BuildUrlForGetCall, IsUndefinedOrNull, IsUndefined } from './../../Utils/common.utils';
import { RawStringQueryToObject, RemoveLastWord } from './../../Utils/dynamicFilter.utils';
import { Get } from './../../Utils/http.utils';
import { GetTime, TimeOperation } from './../../Utils/time.utils';

import SelectBox from './../Forms/Components/Select-Box/selectBox';
import DatePicker from './../Forms/Components/Date-Picker/datePicker';

import GLOBAL from './../../Constants/global.constants';

import { Location } from './../../Utils/location.utils';
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
    dateFormat = GLOBAL.DATE_FORMAT;
    firstLoad = true;

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
            scopes: []
        };
    }

    componentDidMount() {
        SubscribeToEvent({ eventName: 'ToggleAdvancedFilter', callback: this.listenToggleAdvancedFilter });
        SubscribeToEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }

    componentWillUnmount() {
        UnsubscribeEvent({ eventName: 'ToggleAdvancedFilter', callback: this.listenToggleAdvancedFilter });
        UnsubscribeEvent({ eventName: 'loggedUser', callback: this.userDataFetched });
    }

    userDataFetched = (data) => {
        this.state.currentUser = data;
        // this.setState({ currentUser: data });
    }

    listenToggleAdvancedFilter = (collapse, filterContent) => {
        // urlParams = Location.search();

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

    // For all the datetime input filters inject a daterange picker
    dateInput({ filter, filterArr, parentIndex, childIndex }) {
        const child = filterArr[parentIndex][childIndex];
        const startDate = filterArr[parentIndex][childIndex].inputField = TimeOperation({ method: 'subtract', parameter: 'day', format: this.dateFormat, value: 1 });
        // filterArr[parentIndex][childIndex].inputField = moment().subtract(1, "day").format(this.dateFormat);
        const endDate = filterArr[parentIndex][childIndex].secondInputField = GetTime({ format: this.dateFormat });
        switch (filter) {
            case " BETWEEN ":
                //	<daterangepicker> is injected to the template with the format and selected value
                filterArr[parentIndex][childIndex].html = (<DatePicker  format={this.dateFormat} timePicker={true} onChange={(event, data) => this.convertToInputField({ data, parentIndex, childIndex, dateRange: true, })} value={{ startDate, endDate }} />);
                // filterArr[parentIndex][childIndex].html = (<daterange-picker ng-model="b.slot" format="{{configureFilter.dateFormat}}" />);
                // filterArr[parentIndex][childIndex].html = "<div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding-left\"><daterange-picker ng-model=\"b.slot\" format=\"{{configureFilter.dateFormat}}\"></daterange-picker></div>";
                break;

            case " NOT BETWEEN ":
                filterArr[parentIndex][childIndex].html = <DatePicker format={this.dateFormat} timePicker={true} onChange={(event, data) => this.convertToInputField({ data, parentIndex, childIndex, dateRange: true })} value={{ startDate, endDate }} />;
                // filterArr[parentIndex][childIndex].html = "<div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding-left\"><daterange-picker ng-model=\"b.slot\" format=\"{{configureFilter.dateFormat}}\"></daterange-picker></div>";
                break;

            case " IS NULL ":
                filterArr[parentIndex][childIndex].inputField = null;
                break;

            case " IS NOT NULL":
                filterArr[parentIndex][childIndex].inputField = null;
                break;

            default:
                filterArr[parentIndex][childIndex].html = (<DatePicker single={true} format={this.dateFormat} timePicker={true} onChange={(event, data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'inputField' })} value={child.inputField} />);
                // filterArr[parentIndex][childIndex].html = "<daterange-picker single = \"true\" ng-model=\"b.inputField\" format=\"{{configureFilter.dateFormat}}\"></daterange-picker>";
                break;
        }
        return filterArr;
    }

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
        let { filterArr } = this.state;

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
        let child = filterArr[parentIndex][childIndex];
        switch (column.column_type) {
            case 107: // column type number
                filterArr[parentIndex][childIndex].html = (<input type='text' className='form-control' onChange={(data) => this.convertToInputField({ data: data.target.value, parentIndex, childIndex })} value={child.inputField} placeholder='Input Value' />);
                break;

            case 108: // column type string
                filterArr[parentIndex][childIndex].html = <input type='text' className='form-control' onChange={(data) => this.convertToInputField({ data: data.target.value, parentIndex, childIndex })} value={child.inputField} placeholder='Input Value' />;
                break;

            // @TODO add date field
            case 109: // if a date picker is required
                filterArr = this.dateInput({ filterArr, filter, parentIndex, childIndex }, this.dateFormat);
                break;

            case 110: // Datetime
                this.dateFormat = 'YYYY-MM-DD HH:mm:00';
                // filterArr[parentIndex][childIndex].html = (<DatePicker single={true} timePicker={true} name={column.column_name} onChange={props.setFieldValue} value={values[column.column_name]} />)
                filterArr = this.dateInput({ filterArr, filter, parentIndex, childIndex });
                break;

            case 111:
                filterArr[parentIndex][childIndex].html = (<SelectBox onChange={(event, data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'selectValue' })} value={child.selectValue} options={this.booleanObj} field='name' place-holder="Select Value" />);
                // filterArr[parentIndex][childIndex].html = (<custom-select-field ng-model="b.selectValue" extra-params="{parentIndex: $parent.$childIndex, childIndex: $childIndex}" call-it="configureFilter.convertToInputField" place-holder="Select Value" iterate-item="name" obj="configureFilter.booleanObj" />);
                valueColumnType = "select";
                break;

            case 116: // for reference data , prefilled
                filterArr[parentIndex][childIndex].inputField = null;
                filterArr[parentIndex][childIndex].html = (<SelectBox onChange={(event, data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'selectValue' })} value={child.selectValue} options={child.referenceObj} field='name' place-holder="Select Value" />);
                // filterArr[parentIndex][childIndex].html = (<custom-select-field ng-model="b.selectValue" extra-params="{parentIndex: $parent.$childIndex, childIndex: $childIndex}" call-it="configureFilter.convertToInputField" place-holder="Select Value" iterate-item="{{b.column.selected.referenced_model.display_column}}" obj="b.referenceObj" />);
                valueColumnType = "select";
                break;

            case 117: // for reference : async
                filterArr[parentIndex][childIndex].inputField = null;

                if (filterArr[parentIndex][childIndex].column.referenced_model.name == "User" && !filterArr[parentIndex][childIndex].asyncResults) {
                    filterArr[parentIndex][childIndex].asyncResults = [{
                        id: this.state.currentUser.id,
                        email: "Current User"
                    }];
                }

                filterArr[parentIndex][childIndex].html = (
                    <SelectBox
                        onChange={(event, data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'selectValue' })}
                        value={child.selectValue}
                        field={child.column.referenced_model.display_column}
                        place-holder="Select Value"
                        getOptions={(input) => this.getInputRecord({ input, parentIndex, childIndex })}
                    />
                );
                // filterArr[parentIndex][childIndex].html = (<custom-select-field required="true" ng-model="b.selectValue" call-it="configureFilter.convertToInputField" extra-params="{parentIndex: $parent.$childIndex, childIndex: $childIndex}" place-holder="Type to load data" iterate-item="{{b.column.referenced_model.display_column}}" async="configureFilter.getInputRecord(search,{parentIndex: $parent.$childIndex, childIndex: $childIndex})" obj="b.asyncResults" />);
                break;

            default:
                filterArr[parentIndex][childIndex].inputField = "";
                if (filter != " IS NULL " && filter != " IS NOT NULL ") {
                    filterArr[parentIndex][childIndex].html = (<input type="text" className="form-control" onChange={(data) => this.convertToInputField({ data: data.target.value, parentIndex, childIndex })} value={child.inputField} placeholder='Input Value' />);
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
    getInputRecord = async ({ input: val, parentIndex, childIndex, queryField } = {}) => {
        if (val) {
            const { filterArr } = this.state;
            const displayName = filterArr[parentIndex][childIndex].column.referenced_model.display_column;
            queryField = queryField ? queryField : displayName;
            let url = filterArr[parentIndex][childIndex].column.referenced_model.route_name;
            const options = {
                query: queryField + ' like %22%25' + val + '%25%22'
            };
            // If a sorting type is specified append it
            if (filterArr[parentIndex][childIndex].column.sorting_type) {
                options.query += " and " + filterArr[parentIndex][childIndex].column.sorting_type;
            }
            url = BuildUrlForGetCall(url, options);
            const result = await Get({ url, urlPrefix: GLOBAL.ROUTE_URL });
            // Assign the results to array for async ui select

            // @TODO User
            // if (filterArr[parentIndex][childIndex].column.referenced_model.name == "User") {
            //     filterArr[parentIndex][childIndex].asyncResults = [{
            //         id: this.state.currentUser.id,
            //         email: "Current User"
            //     }];
            // } else {
            //     filterArr[parentIndex][childIndex].asyncResults = [];
            // }

            // // Push the content to the array
            // Array.prototype.push.apply(filterArr[parentIndex][childIndex].asyncResults, response.data.response);
            // this.setState({ filterArr });
            const response = result.response.map((option) => {
                return { ...option, ...{ label: option[displayName], value: option['id'] } }
            });
            console.log(response);
            return { options: response };
        }
    }

    // convertToInputField = function(obj, indexObj) {
    convertToInputField = function ({ data, parentIndex, childIndex, attr = 'inputField', dateRange = false }) {
        if (data) {
            const { filterArr } = this.state;
            if (dateRange) {
                filterArr[parentIndex][childIndex].inputField = data.startDate;
                filterArr[parentIndex][childIndex].secondInputField = data.endDate;
            } else {
                filterArr[parentIndex][childIndex][attr] = data;
            }

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

                console.log(filterArr[parentIndex][key].column);
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
                // filterArr[parentIndex][key].slot.startDate = queryObj.selectedInput;
                filterArr[parentIndex][key].inputField = queryObj.selectedInput;
                filterArr[parentIndex][key].secondInputField = queryObj.secondInputField;

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
            slot: { startDate: null, endDate: null },
            // variable added to store the ngModel variable
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

        // var active_filter = Location.search().filter;
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
        this.state.activeFilter = {};
        const { filters = [] } = this.props;
        filters.forEach((filter, key) => {
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

    submit = () => {

        const { filterArr, currentUser, activeFilter, sort, order, scopes } = this.state;
        const paramProps = {
            history: this.props.history, match: this.props.match
        };
        let query = '';

        filterArr.forEach(parentValue => {
            query += parentValue.length > 1 ? '(' : '';
            parentValue.forEach(value => {
                if (!IsUndefinedOrNull(value.column) && Object.keys(value.column).length) {
                    const joinMethod = value.joinMethod;
                    if (value.filter.includes('IS NULL') || value.filter.includes('IS NOT NULL')) {
                        query += value.column.column_name + value.filter + ' AND ';
                    } else if (value.filter == ' BETWEEN ' || value.filter == ' NOT BETWEEN ') {
                        // query += value.column.column_name + value.filter + ''' + value.slot.startDate + "' and '" + value.slot.endDate + "'" + joinMethod;
                        // query += `${value.column.column_name}${value.filter} '${value.slot.startDate}' and '${value.slot.endDate}'${joinMethod}`;
                        query += `${value.column.column_name}${value.filter} '${value.inputField}' and '${value.secondInputField}'${joinMethod}`;
                    } else if (!IsUndefined(value.inputField)) {
                        switch (value.column.column_type) {
                            case 117:
                                // if its a reference column ,

                                // If the reference model is User add
                                if (value.column.referenced_model.name == 'User' && value.selectValue.id == currentUser.id) {
                                    query += `${value.column.column_name}${value.filter}'currentUser'${joinMethod}`;
                                    // query += value.column.column_name + value.filter + "'" + "currentUser" + "'" + joinMethod;
                                } else {
                                    if (value.column.hasOwnProperty('referenced_column')) {
                                        query += (value.column.referenced_column ? value.column.referenced_column : value.column.column_name) + value.filter + "'" + (value.column.referenced_column ? value.selectValue.id : value.selectValue[value.column.referenced_model.display_column]) + "'" + joinMethod;
                                    } else {
                                        query += value.column.column_name + value.filter + "'" + value.selectValue.id + "'" + joinMethod;
                                    }
                                }
                                break;

                            case 118:
                                query += value.column.column_name + value.filter + "'" + value.selectValue.id + "'" + joinMethod;
                                break;

                            case 116:
                                if (value.column.hasOwnProperty('referenced_column')) {
                                    query += (value.column.referenced_column ? value.column.referenced_column : value.column.column_name) + value.filter + "'" + (value.column.referenced_column ? value.selectValue.id : value.selectValue[value.column.referenced_model.display_column]) + "'" + joinMethod;
                                } else {
                                    query += value.column.column_name + value.filter + "'" + value.selectValue.id + "'" + joinMethod;
                                }
                                break;

                            case 111:
                                query += value.column.column_name + value.filter + "'" + value.selectValue.id + "'" + joinMethod;
                                break;

                            default:
                                query += value.column.column_name + value.filter + "'" + value.inputField + "'" + joinMethod;
                                break;
                        }
                    }
                }
            });
            query = RemoveLastWord(query, 2);
            query += parentValue.length > 1 ? ')' : '';
            query += ' AND ';
        });

        if (query.replace(' AND ', '')) {
            query = RemoveLastWord(query, 2);

            // If query is added to an existing filter , add that filter 
            // IF there is an active filter then add that first 
            const active_filter = this.urlParams.filter;
            this.activeFilter(active_filter);

            const urlParams = this.urlParams;

            if (activeFilter.id) {
                urlParams.filter = activeFilter.id;
                urlParams.query = query;
                Location.search(urlParams, { props: paramProps });
            } else {
                urlParams.query = query;
                Location.search(urlParams, { props: paramProps });
            }
        }

        if (sort) {
            Location.search({ sort }, { props: paramProps });
            // Location.search("sort", sort);
        }

        if (order) {
            // Location.search("order", order.column_name);
            Location.search({ order: order.column_name }, { props: paramProps });
        }

        if (scopes && scopes.length) {
            var localScopes = [];
            scopes.forEach(function (scope) {
                localScopes.push(scope.alias_name, );
            });

            // Location.search("scopes", localScopes.join(','));
            Location.search({ scopes: localScopes.join(',') }, { props: paramProps });
        }

        this.setState({ isCollapsed: true });
    }

    render() {
        const { props } = this;
        const { isCollapsed, filterArr } = this.state;
        const { content, history } = this.props;

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


                        </form>
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
                                {/* <button className="btn btn-info" style={{ margin: '8px' }}> */}
                                <button className="btn btn-info" onClick={this.submit} style={{ margin: '8px' }}>
                                    GoDaddy
                                    </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Collapse >
        );
    }
}