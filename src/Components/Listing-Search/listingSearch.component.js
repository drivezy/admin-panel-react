import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

import SelectBox from './../Forms/Components/Select-Box/selectBox';

import { SubscribeToEvent, UnsubscribeEvent } from './../../Utils/stateManager.utils';

import './listingSearch.component.css'
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
            selectedColumn: {},
            referenceColumnValue: {},
            query: ''
        };
    }

    componentDidMount() {
        this.initialize();
    }

    UNSAFE_componentWillReceiveProps() {
        this.initialize(); // on props update
    }

    /**
     * extracts query from string and assing value
     */
    initialize = async () => {
        const { dictionary, searchQuery, searchDetail } = this.props;
        let selectedColumn;
        if (searchQuery) {
            const values = searchQuery.split(' ');
            const regex = /["%25]/g;
            values[2] = values[2].replace(regex, '');
            selectedColumn = SelectFromOptions(dictionary, values[0], 'name');
            activeColumn = selectedColumn;
            let query, obj;
            if (!(selectedColumn && selectedColumn.reference_model)) {
                query = values[2];
                // obj = { referenceColumnValue: query };
                this.state.query = query;
            } else {
                query = await this.getInputRecord({
                    input: values[2],
                    queryField: 'id'
                });

                if (Array.isArray(query) && query.length) {
                    this.state.referenceColumnValue = { data: query[0] };
                }
            }
        } else if (searchDetail && searchDetail.name) {
            selectedColumn = SelectFromOptions(dictionary, searchDetail.name, 'name');
            activeColumn = selectedColumn;
        }

        this.setState({ selectedColumn, });
    }

    /**
     * Invoked when Filter is selected
     */
    filterChange(select) {
        let valueColumnType = "input";
        this.setState({
            selectedColumn: select,
            query: '',
            referenceColumnValue: {}
        })

        activeColumn = select;
    }

    /**
    * Fetches async data from server and used to select reference type data
    * @param  {string} val
    * @param  {string} queryField
    */
    getInputRecord = async ({ input: val, queryField: queryFieldName } = {}) => {
        if (val) {
            const { filterArr } = this.state;
            const displayName = activeColumn.reference_model.display_column;
            const queryField = queryFieldName ? queryFieldName : displayName;
            let url = activeColumn.reference_model.route_name;
            let options;
            if (queryFieldName) {
                options = {
                    query: queryField + '=' + val // when used for fetching already selected id
                };
            } else {
                options = {
                    query: queryField + ' like "%25' + val + '%25"'
                    // query: queryField + ' like %22%25' + val + '%25%22'
                };
            }

            url = BuildUrlForGetCall(url, options);
            const result = await Get({ url, urlPrefix: GLOBAL.ROUTE_URL });
            if (queryFieldName) {
                return result.response;
            }
            return { options: result.response };
        }
    }

    convertToInputField = (data) => {
        let query = '';
        this.setState({
            referenceColumnValue: data
        })

        switch (activeColumn.column_type) {
            case 116: case 117:
                query += activeColumn.name + ' = ' + data.data.id;
                break;

            default:
                query += activeColumn.name + ' = ' + data.data;
                break;
        }

        const urlParams = this.urlParams;
        urlParams.search = query;
        Location.search(urlParams);
    };

    callFunction = () => {
        let query = '';
        const urlParams = this.urlParams;

        const paramProps = {
            history: this.props.history, match: this.props.match
        };

        query += activeColumn.name + ' like "%25' + this.state.inputValue + '%25"';
        urlParams.search = query;
        Location.search(urlParams, { props: paramProps });

    }

    /**
     * on press enter, 
     * @param  {} e
     */
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.callFunction();
            return;
        }
        this.setState({ inputValue: this.state.query + e.key })
    }

    searchLocally = (event) => {
        this.setState({ query: event.target.value });

        // this.
        this.props.onEdit(this.state.selectedColumn, event.target.value);
    }


    render() {
        const { props } = this;
        const { dictionary, history, match } = this.props;
        const { selectedColumn = {}, query = '' } = this.state;
        const { reference_model = {} } = selectedColumn;
        const { referenceColumnValue } = this.state;

        return (
            <div className="listing-search-container">
                {
                    <div className="listing-search-tool">
                        <div className="listing-select-tool">
                            <SelectBox label="display_name" onChange={(data) => {
                                this.filterChange(data)
                            }}
                                value={selectedColumn} options={dictionary} placeholder='Column' />
                        </div>
                        <div className="listing-input-tool">
                            {reference_model ? (
                                <SelectBox
                                    onChange={(data) => this.convertToInputField({ data })}
                                    value={referenceColumnValue.data}
                                    field={reference_model.display_column}
                                    placeholder="Search"
                                    getOptions={(input) => this.getInputRecord({ input })} />
                            ) :
                                (
                                    <input type="text"
                                        className="input-select form-control"
                                        placeholder={`Search ${selectedColumn.display_name}`}
                                        value={query}
                                        onChange={event => this.searchLocally(event)}
                                        onKeyPress={this.handleKeyPress}
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
