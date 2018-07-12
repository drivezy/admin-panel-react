import React, { Component } from 'react';
import { Collapse } from 'reactstrap';

import Typeahead from './../Forms/Components/Typeahead/typeahead.component';
import SelectBox from './../Forms/Components/Select-Box/selectBoxForGenericForm.component';
// import SelectBox from './../Forms/Components/Select-Box/selectBox';
import DatePicker from './../Forms/Components/Date-Picker/datePicker';

import { SubscribeToEvent, UnsubscribeEvent } from './../../Utils/stateManager.utils';
import { SelectFromOptions, BuildUrlForGetCall, IsUndefinedOrNull, IsUndefined } from './../../Utils/common.utils';
import { RawStringQueryToObject, RemoveLastWord, GetSelectedColumn } from './../../Utils/dynamicFilter.utils';
import { Get } from './../../Utils/http.utils';
import { GetTime, TimeOperation } from './../../Utils/time.utils';
import { Location } from './../../Utils/location.utils';

import GLOBAL from './../../Constants/global.constants';
import COLUMN_TYPE from './../../Constants/columnType.constants';
import './configureFilter.component.css';

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

    UNSAFE_componentWillReceiveProps() {
        this.urlParams = Location.search();
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

    /**
     * Entry point for toggling advance filter 
     * @param  {boolean} {isCollapsed
     * @param  {string} single - takes column name and prepopulated it
     * @param  {boolean} listenToInput} - if true, whatever value of isCollapsed is passed, will be assigned otherwise isCollapsed is always toggled by default
     */
    listenToggleAdvancedFilter = ({ isCollapsed: collapse, single, forcefullyUpdate }) => {
        if (this.firstLoad) { // makes sure initialize is called only once
            this.firstLoad = false;
            this.initialize();
        }
        const { isCollapsed } = this.state;
        collapse = forcefullyUpdate ? collapse : !isCollapsed;

        if (!collapse) {
            const active_filter = this.urlParams.layout;

            // IF there is an active filter then add that first 
            if (active_filter && !this.urlParams.query) {
                this.resetColumns();
                this.activeFilter(active_filter);
                this.prepopulate(this.state.activeFilter.query);
            } else if (this.urlParams.query) {
                this.prepopulate(this.urlParams.query);
            } else {
                this.resetColumns();
            }
            // // @TODO because of async call in prepopulate, existing query gets overrided by this method, to prevent that calling after 1s
            setTimeout(() => this.assignSelectedFilterColumn({ single }), 500); // checks if filter column is passed, prepopulate that column

            // this.assignSelectedFilterColumn({ single })
        }
        this.setState({ isCollapsed: collapse });
    }

    assignSelectedFilterColumn = ({ single }) => {
        // If the dynamic filter is only for the column the select field should be preselected
        const { filterArr } = this.state;
        const { content } = this.props;
        if (single) {
            let arrayIndex;
            if (IsUndefinedOrNull(filterArr[filterArr.length - 1][0].html)) {
                arrayIndex = filterArr.length - 1;
            } else {
                arrayIndex = filterArr.length;
            }
            // Push an array to the current one
            // this is a fallback if there is query that is to be prepopulated
            filterArr[arrayIndex] = [[...this.filterObj]];
            // to the last element in the array , push the column
            filterArr[arrayIndex][0].column = SelectFromOptions(content.dictionary, single, 'path');
            // once the column is selected , columnChange should be called to load necessary data for the column
            this.columnChange(filterArr[arrayIndex][0].column, {
                parentIndex: filterArr.length - 1,
                childIndex: 0,
                setValue: true
            });
        }
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
            this.state.filterArr = filterArr;
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
        switch (column.column_type_id) {
            // if column type is number or string
            case COLUMN_TYPE.STRING: case COLUMN_TYPE.NUMBER:
                // case 107: case 108: case 708:
                // for a column of type string , stringFilterArr is to be assiged to second filter
                filterArr[parentIndex][childIndex].filterField = column.column_type_id == COLUMN_TYPE.NUMBER ? this.numericFilterArr : this.stringFilterArr;
                filterArr[parentIndex][childIndex].inputField = column.column_type_id == COLUMN_TYPE.NUMBER ? 0 : '';
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;

            // if column type is date
            case COLUMN_TYPE.DATE:
                // case 109:
                this.dateFormat = "YYYY-MM-DD";
                filterArr[parentIndex][childIndex].filterField = this.dateFilterArr;
                filterArr[parentIndex][childIndex].inputField = GetTime(this.dateFormat);
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;

            // if column type is datetime
            case COLUMN_TYPE.DATETIME:
                // case 110:
                filterArr[parentIndex][childIndex].filterField = this.dateFilterArr;
                filterArr[parentIndex][childIndex].inputField = GetTime('YYYY-MM-DD HH:mm:ss');
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;

            // if column type is boolean
            case COLUMN_TYPE.BOOLEAN:
                // case 119: case 111:
                filterArr[parentIndex][childIndex].filterField = this.booleanFilterArr;
                filterArr[parentIndex][childIndex].selectValue = this.booleanObj[0];
                this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                return filterArr[parentIndex][childIndex].inputField;
            // defer.resolve(filterArr[parentIndex][childIndex].inputField);

            // if Column is referenced type: dropdown
            case COLUMN_TYPE.SELECT:
                // case 116:
                filterArr[parentIndex][childIndex].filterField = this.booleanFilterArr;
                if (column.reference_model_id) {
                    var url = column.reference_model.route_name;
                    if (column.sorting_type) {
                        url += "?query=" + column.sorting_type;
                    }

                    const res = await Get({ url, urlPrefix: GLOBAL.ROUTE_URL });
                    filterArr[parentIndex][childIndex].referenceObj = res.response;
                    this.callFilterChangeAfterColumnChange(filterArr, { parentIndex, childIndex });
                    return filterArr[parentIndex][childIndex].referenceObj;
                    // defer.resolve(filterArr[parentIndex][childIndex].referenceObj);
                }

            // if Column is referenced type
            case COLUMN_TYPE.REFERENCE:
                // case 117:
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

    radios = [
        { label: 'Justify (default)' },
        'Align left',
        { label: 'Align right' },
    ];


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
            filterArr[parentIndex][childIndex].filter = filter;
            // filterArr[parentIndex][childIndex].filter = filter;
            this.setState({ filterArr });
        }
        const column = filterArr[parentIndex][childIndex].column;

        // html, inputField are fields used by different filters, so initiailizing it
        filterArr[parentIndex][childIndex].html = null;

        if (!filter || filter.includes("IS NULL") || filter.includes("IS NOT NULL")) {
            return false;
        }
        let child = filterArr[parentIndex][childIndex];
        switch (column.column_type_id) {
            // case 107: // column type number
            //     // filterArr[parentIndex][childIndex].html = (<input type='text' className='form-control' onChange={(data) => this.convertToInputField({ data: data.target.value, parentIndex, childIndex })} value={child.inputField} placeholder='Input Value' />);
            //     filterArr[parentIndex][childIndex].html = <input type='text' className='form-control' onChange={(data) => this.convertToInputField({ data: data.target.value, parentIndex, childIndex })} value={child.inputField} placeholder='Input Value' />;
            //     break;

            // case 109: // if a date picker is required
            case COLUMN_TYPE.DATE: // if a date picker is required
                filterArr = this.dateInput({ filterArr, filter, parentIndex, childIndex }, this.dateFormat);
                break;

            case COLUMN_TYPE.DATETIME: // Datetime
                // case 110: // Datetime
                this.dateFormat = 'YYYY-MM-DD HH:mm:00';
                // filterArr[parentIndex][childIndex].html = (<DatePicker single={true} timePicker={true} name={column.name} onChange={props.setFieldValue} value={values[column.name]} />)
                filterArr = this.dateInput({ filterArr, filter, parentIndex, childIndex });
                break;

            // case 119: case 111:
            case COLUMN_TYPE.BOOLEAN: // boolean
                filterArr[parentIndex][childIndex].html = () => (<SelectBox onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'selectValue' })} value={child.selectValue} options={this.booleanObj} field='name' placeholder="Select Value" />);
                // filterArr[parentIndex][childIndex].html = (<custom-select-field ng-model="b.selectValue" extra-params="{parentIndex: $parent.$childIndex, childIndex: $childIndex}" call-it="configureFilter.convertToInputField" place-holder="Select Value" iterate-item="name" obj="configureFilter.booleanObj" />);
                valueColumnType = "select";
                break;

            case COLUMN_TYPE.SELECT: // for reference data , prefilled
                // case 116: // for reference data , prefilled
                filterArr[parentIndex][childIndex].inputField = null;
                filterArr[parentIndex][childIndex].html = () => (
                    <SelectBox
                        onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'selectValue' })}
                        value={child.selectValue} options={child.referenceObj}
                        field={child.column.reference_model.display_column}
                        placeholder="Select Value"
                        getOptions={(input) => this.getInputRecord({ input, parentIndex, childIndex })}
                    />
                );
                // filterArr[parentIndex][childIndex].html = (<custom-select-field ng-model="b.selectValue" extra-params="{parentIndex: $parent.$childIndex, childIndex: $childIndex}" call-it="configureFilter.convertToInputField" place-holder="Select Value" iterate-item="{{b.column.selected.reference_model.display_column}}" obj="b.referenceObj" />);
                valueColumnType = "select";
                break;

            case COLUMN_TYPE.REFERENCE: // for reference : async
                // case 117: // for reference : async
                filterArr[parentIndex][childIndex].inputField = null;

                if (filterArr[parentIndex][childIndex].column.reference_model.name == "User" && !filterArr[parentIndex][childIndex].asyncResults) {
                    filterArr[parentIndex][childIndex].asyncResults = [{
                        id: this.state.currentUser.id,
                        email: "Current User"
                    }];
                }

                if (child.column.reference_model && child.column.reference_model.display_column) {
                    filterArr[parentIndex][childIndex].html = () => (
                        <SelectBox
                            onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'selectValue' })}
                            value={child.selectValue}
                            field={child.column.reference_model.display_column}
                            placeholder="Select Value for any reason"
                            getOptions={(input) => this.getInputRecord({ input, parentIndex, childIndex })}
                        />
                    );
                } else {
                    filterArr[parentIndex][childIndex].html = () => null
                }


                // filterArr[parentIndex][childIndex].html = (<custom-select-field required="true" ng-model="b.selectValue" call-it="configureFilter.convertToInputField" extra-params="{parentIndex: $parent.$childIndex, childIndex: $childIndex}" place-holder="Type to load data" iterate-item="{{b.column.reference_model.display_column}}" async="configureFilter.getInputRecord(search,{parentIndex: $parent.$childIndex, childIndex: $childIndex})" obj="b.asyncResults" />);
                break;

            case COLUMN_TYPE.STRING: case COLUMN_TYPE.NUMBER: default: // column type string
                const setStateMethod = (data) => this.convertToInputField({ data, parentIndex, childIndex });
                filterArr[parentIndex][childIndex].html = () =>
                    <Typeahead
                        options={child.selectField}
                        onType={setStateMethod}
                        onChange={setStateMethod}
                        value={child.inputField}
                        field={'path'}
                        placeholder='Input Value'
                    />;

                // filterArr[parentIndex][childIndex].html = () => <input type='text' className='form-control' onChange={(data) => this.convertToInputField({ data: data.target.value, parentIndex, childIndex })} value={child.inputField} placeholder='Input Value' />;
                break;

            // default:
            //     filterArr[parentIndex][childIndex].inputField = "";
            //     if (filter != " IS NULL " && filter != " IS NOT NULL ") {
            //         filterArr[parentIndex][childIndex].html = () => (<input type="text" className="form-control" onChange={(data) => this.convertToInputField({ data: data.target.value, parentIndex, childIndex })} value={child.inputField} placeholder='Input Value' />);
            //     }
            //     break;
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

    // For all the datetime input filters inject a daterange picker
    dateInput({ filter, filterArr, parentIndex, childIndex }) {
        const child = filterArr[parentIndex][childIndex];
        const startDate = filterArr[parentIndex][childIndex].inputField = TimeOperation({ method: 'subtract', parameter: 'day', format: this.dateFormat, value: 1 });
        // filterArr[parentIndex][childIndex].inputField = moment().subtract(1, "day").format(this.dateFormat);
        const endDate = filterArr[parentIndex][childIndex].secondInputField = GetTime({ format: this.dateFormat });
        switch (filter) {
            case " BETWEEN ":
                //	<daterangepicker> is injected to the template with the format and selected value
                filterArr[parentIndex][childIndex].html = () => (<DatePicker format={this.dateFormat} timePicker={true} onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex, dateRange: true, })} value={{ startDate, endDate }} />);
                // filterArr[parentIndex][childIndex].html = (<daterange-picker ng-model="b.slot" format="{{configureFilter.dateFormat}}" />);
                // filterArr[parentIndex][childIndex].html = "<div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding-left\"><daterange-picker ng-model=\"b.slot\" format=\"{{configureFilter.dateFormat}}\"></daterange-picker></div>";
                break;

            case " NOT BETWEEN ":
                filterArr[parentIndex][childIndex].html = () => <DatePicker format={this.dateFormat} timePicker={true} onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex, dateRange: true })} value={{ startDate, endDate }} />;
                // filterArr[parentIndex][childIndex].html = "<div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding-left\"><daterange-picker ng-model=\"b.slot\" format=\"{{configureFilter.dateFormat}}\"></daterange-picker></div>";
                break;

            case " IS NULL ":
                filterArr[parentIndex][childIndex].inputField = null;
                break;

            case " IS NOT NULL":
                filterArr[parentIndex][childIndex].inputField = null;
                break;

            default:
                filterArr[parentIndex][childIndex].html = () => (<DatePicker single={true} format={this.dateFormat} timePicker={true} onChange={(data) => this.convertToInputField({ data, parentIndex, childIndex, attr: 'inputField' })} value={child.inputField} />);
                // filterArr[parentIndex][childIndex].html = "<daterange-picker single = \"true\" ng-model=\"b.inputField\" format=\"{{configureFilter.dateFormat}}\"></daterange-picker>";
                break;
        }
        return filterArr;
    }

    /**
     * Fetches async data from server and used to select reference type data
     * @param  {string} val
     * @param  {} index
     * @param  {} queryField
     */
    getInputRecord = async ({ input: val, parentIndex, childIndex, queryField: queryFieldName } = {}) => {
        console.log(val);
        if (val) {
            const { filterArr } = this.state;
            const displayName = filterArr[parentIndex][childIndex].column.reference_model.display_column;
            const queryField = queryFieldName ? queryFieldName : displayName;
            let url = filterArr[parentIndex][childIndex].column.reference_model.route_name;
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
            // if (filterArr[parentIndex][childIndex].column.reference_model.name == "User") {
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
            if (queryFieldName) {
                return result.response;
            }
            // const response = result.response.map((option) => {
            //     return { ...option, ...{ label: option[displayName], value: option['id'] } }
            // });
            // console.log(response);
            // return { options: result.response };
            return result.response;
        }
    }

    // convertToInputField = function(obj, indexObj) {
    convertToInputField = function ({ data, parentIndex, childIndex, attr = 'inputField', dateRange = false }) {
        if (!IsUndefined(data)) {
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
    prepopulate = async (query = '') => {
        const { isCollapsed } = this.state;
        if (!isCollapsed) {
            return;
        }

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

                filterArr[parentIndex][key].column = GetSelectedColumn({ dictionary: this.filterObj.selectField, selectedColumnQuery: queryObj.selectedColumn });
                // filterArr[parentIndex][key].column = SelectFromOptions(this.filterObj.selectField, queryObj.selectedColumn, "name");

                if (filterArr[parentIndex][key].column.column_type_id == COLUMN_TYPE.SELECT) {
                    const res = await this.columnChange(filterArr[parentIndex][key].column, {
                        parentIndex: parentIndex,
                        childIndex: key
                    })
                    if (res) {
                        filterArr[parentIndex][key].selectValue = SelectFromOptions(res, queryObj.selectedInput, 'id');
                    }

                } else if (filterArr[parentIndex][key].column.column_type_id == COLUMN_TYPE.BOOLEAN) { // Check if column type is boolean
                    filterArr[parentIndex][key].selectValue = SelectFromOptions(this.booleanObj, queryObj.selectedInput, 'id');
                } else if (filterArr[parentIndex][key].column.column_type_id == COLUMN_TYPE.STRING) {
                    filterArr[parentIndex][key].inputField = queryObj.selectedInput;
                } else if (filterArr[parentIndex][key].column.column_type_id == COLUMN_TYPE.NUMBER) { // Check if column type is number
                    queryObj.selectedInput = parseInt(queryObj.selectedInput);
                } else if (filterArr[parentIndex][key].column.column_type_id == COLUMN_TYPE.REFERENCE) { // If the column is of reference type
                    // If selectedInput is currentUser / change it to currentUser id
                    if (queryObj.selectedInput == 'currentUser' && this.state.currentUser) {
                        queryObj.selectedInput = this.state.currentUser.id;
                        filterArr[parentIndex][key].asyncResults = [{
                            id: this.state.currentUser.id,
                            email: 'Current User'
                        }];
                        // defined the asyncResults array and assign it to the the select field
                        filterArr[parentIndex][key].selectValue = filterArr[parentIndex][key].asyncResults[0];
                    } else {
                        const res = await this.getInputRecord({
                            input: queryObj.selectedInput,
                            parentIndex: parentIndex,
                            childIndex: key,
                            queryField: 'id'
                        });
                        // console.log('res',res);
                        // console.log('filterArr[parentIndex][key].asyncResults',filterArr[parentIndex][key]);
                        if (res) {
                            filterArr[parentIndex][key].asyncResults = res;
                            filterArr[parentIndex][key].selectValue = filterArr[parentIndex][key].asyncResults[0];
                        }
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
        const { filterArr } = this.state;
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
            this.state.order = SelectFromOptions(content.dictionary, this.urlParams.order, "name");
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
                this.state.activeFilter = filter;
                // this.setState({ activeFilter: filter });
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

    closeForm = () => {
        this.setState({ isCollapsed: true });
    }

    getPathWithParent(column) {
        // if (column.path.split('.').length > 2) {
        return `\`${column.parent}\`.${column.referenced_column ? column.referenced_column : column.name}`;
    }

    getQuery({ column, filter, value, joinMethod }) {
        let columnString = this.getPathWithParent(column);
        // } else {
        //     columnString = column.name;
        // }

        value = filter.includes('LIKE') ? '\%' + value + '\%' : value;
        return columnString + filter + "'" + value + "'" + joinMethod;
    }

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
                        query += this.getPathWithParent(value.column) + value.filter + ' AND ';
                    } else if (value.filter == ' BETWEEN ' || value.filter == ' NOT BETWEEN ') {
                        // query += value.column.name + value.filter + ''' + value.slot.startDate + "' and '" + value.slot.endDate + "'" + joinMethod;
                        // query += `${value.column.name}${value.filter} '${value.slot.startDate}' and '${value.slot.endDate}'${joinMethod}`;
                        query += `${this.getPathWithParent(value.column)}${value.filter} '${value.inputField}' and '${value.secondInputField}'${joinMethod}`;
                    } else if (!IsUndefined(value.inputField)) {
                        switch (value.column.column_type_id) {
                            case 7:
                                // case 117:
                                // if its a reference column ,

                                // If the reference model is User add
                                if (value.column.reference_model.name == 'User' && value.selectValue.id == currentUser.id) {
                                    // query += `${value.column.name}${value.filter}'currentUser'${joinMethod}`;
                                    query += this.getQuery({ column: value.column, filter: value.filter, value: 'currentUser', joinMethod });
                                } else {
                                    if (value.column.hasOwnProperty('referenced_column')) {
                                        // query += (value.column.referenced_column ? value.column.referenced_column : value.column.name) + value.filter + "'" + (value.column.referenced_column ? value.selectValue.id : value.selectValue[value.column.reference_model.display_column]) + "'" + joinMethod;
                                        query += this.getQuery({ column: value.column, filter: value.filter, value: (value.column.referenced_column ? value.selectValue.id : value.selectValue[value.column.reference_model.display_column]), joinMethod });
                                    } else {
                                        // query += value.column.name + value.filter + "'" + value.selectValue.id + "'" + joinMethod;
                                        query += this.getQuery({ column: value.column, filter: value.filter, value: value.selectValue.id, joinMethod });
                                    }
                                }
                                break;

                            case 118:
                                // query += value.column.name + value.filter + "'" + value.selectValue.id + "'" + joinMethod;
                                query += this.getQuery({ column: value.column, filter: value.filter, value: value.selectValue.id, joinMethod });
                                break;

                            case 6:
                                // case 116:
                                if (value.column.hasOwnProperty('referenced_column')) {
                                    // query += (value.column.referenced_column ? value.column.referenced_column : value.column.name) + value.filter + "'" + (value.column.referenced_column ? value.selectValue.id : value.selectValue[value.column.reference_model.display_column]) + "'" + joinMethod;
                                    query += this.getQuery({ column: value.column, filter: value.filter, value: (value.column.referenced_column ? value.selectValue.id : value.selectValue[value.column.reference_model.display_column]), joinMethod });
                                } else {
                                    // query += value.column.name + value.filter + "'" + value.selectValue.id + "'" + joinMethod;
                                    query += this.getQuery({ column: value.column, filter: value.filter, value: value.selectValue.id, joinMethod });
                                }
                                break;

                            case 5:
                                // case 111: case 119:
                                // query += value.column.name + value.filter + "'" + value.selectValue.id + "'" + joinMethod;
                                query += this.getQuery({ column: value.column, filter: value.filter, value: value.selectValue.id, joinMethod });
                                break;

                            default:
                                // query += value.column.name + value.filter + "'" + value.inputField + "'" + joinMethod;
                                query += this.getQuery({ column: value.column, filter: value.filter, value: value.inputField, joinMethod });
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
            const active_filter = this.urlParams.layout;
            this.activeFilter(active_filter);

            const urlParams = this.urlParams;

            if (activeFilter.id) {
                urlParams.layout = activeFilter.id;
                urlParams.query = query;
                Location.search(urlParams, { props: paramProps });
            } else {
                urlParams.query = query;
                // urlParams.columns = JSON.stringify({ query });
                Location.search(urlParams, { props: paramProps });

                const url = Location.search();
                console.log(url);
            }
        }

        if (sort) {
            Location.search({ sort }, { props: paramProps });
            // Location.search("sort", sort);
        }

        if (order) {
            // Location.search("order", order.name);
            Location.search({ order: order.name }, { props: paramProps });
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
        const { isCollapsed, filterArr, sort, order } = this.state;
        const { content, history } = this.props;

        // const sorts = [];
        // this.sorts.forEach((sort, key) => {
        //     sorts[key] = { name: sort, value: sort };
        // })

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
                                                        const childfilterField = child.filterField;
                                                        // child.filterField.forEach(filter => childfilterField.push({ name: filter, id: filter }));
                                                        return (
                                                            <div key={childIndex}>
                                                                <div className="flex-box filter-row event-flow">
                                                                    <div className="event-select">
                                                                        <SelectBox
                                                                            isClearable={false}
                                                                            onChange={(data) => {
                                                                                this.columnChange(data, { parentIndex, childIndex, setValue: true })
                                                                            }}
                                                                            value={child.column} field='path' options={child.selectField} placeholder='Column' />
                                                                    </div>
                                                                    <div className="method-select">
                                                                        <SelectBox isClearable={false} onChange={(data) => this.filterChange(data, { parentIndex, childIndex, setValue: true })} value={child.filter} options={childfilterField} placeholder='Filter' />
                                                                    </div>
                                                                    <div className="operator-select">
                                                                        {/* <span id="inject" dynamic="child.html"></span> */}
                                                                        {child.html ? child.html() : null}
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
                        <div className="footer-content">
                            <div className="footer-group order-content">
                                <label>
                                    Order By
                                </label>
                                <div className="filter-box">
                                    <SelectBox
                                        onChange={(data) => {
                                            this.setState({ order: data });
                                        }}
                                        value={order} field='name' options={content.dictionary} placeholder='Order'
                                    />
                                </div>
                            </div>
                            <div className="footer-group sort-by-content">
                                <label>
                                    Sory By
                                </label>
                                <div className="filter-box">
                                    <SelectBox
                                        onChange={(data) => {
                                            this.setState({ sort: data });
                                        }}
                                        value={sort} options={this.sorts} placeholder='Sort'
                                    />
                                </div>
                            </div>
                            <div className="footer-actions">
                                <div className="actions">
                                    <button className="btn btn-danger" onClick={() => this.closeForm(true)} style={{ margin: '8px' }}>
                                        Close
                                    </button>
                                    <button className="btn btn-success" onClick={this.submit} style={{ margin: '8px' }}>
                                        Go
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Collapse>
        );
    }
}