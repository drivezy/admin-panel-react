import React, { Component } from 'react';
import SelectBox from './../Forms/Components/Select-Box/selectBoxForGenericForm.component';
// import SelectBox from './../Forms/Components/Select-Box/selectBox';

import './listingSearch.component.css'
import GLOBAL from './../../Constants/global.constants';

import { SelectFromOptions, IsObjectHaveKeys } from './../../Utils/common.utils';
import { Location } from './../../Utils/location.utils';
import { Get } from './../../Utils/http.utils';
import { BuildUrlForGetCall } from './../../Utils/common.utils';

//let activeColumn = {};

export default class ListingSearch extends Component {
    urlParams = Location.search();

    constructor(props) {
        super(props);
        const { dictionary = [] } = props;
        this.state = {
            selectedColumn: dictionary[0] || {},
            referenceColumnValue: {},
            query: '',
            activeColumn: dictionary[0] || {}
        };
    }

    componentDidMount() {
        this.initialize(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.localSearch != prevProps.localSearch) {
            this.initialize(nextProps); // on props update
        }
    }

    /**
     * extracts query from string and assing value
     */
    initialize = async (props) => {
        const { dictionary, searchQuery, searchDetail } = props;
        let selectedColumn;


        if (searchQuery) {
            const values = searchQuery.split(" ");
            const regex = /["%25]/g;
            values[2] = values[2].replace(regex, '');

            selectedColumn = SelectFromOptions(dictionary, values[0], 'name');
            // this.setState({ activeColumn: selectedColumn });
            this.state.activeColumn = selectedColumn;

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
        }
        // else if (searchDetail) {
        else if (searchDetail && searchDetail.name) {
            selectedColumn = SelectFromOptions(dictionary, searchDetail.name, 'name');
            this.state.activeColumn = selectedColumn;
        }

        //@To be deleted after sometime
        //   else if (localSearch && localSearch.value) {
        //             // let { query } = this.state;
        //             // query = localSearch.value;
        //             // this.setState({ query });
        //             selectedColumn = SelectFromOptions(dictionary, localSearch.field, 'name');

        //             // { localSearch: { field: column.name, value: value } }
        //             this.state.query = localSearch.value
        //         } else {
        //             this.state.query = localSearch.value
        //         }}

        if (IsObjectHaveKeys(selectedColumn)) {
            this.setState({ selectedColumn });
        }
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

        this.setState({ activeColumn: select });
    }

    /**
    * Fetches async data from server and used to select reference type data
    * @param  {string} val
    * @param  {string} queryField
    */
    getInputRecord = async ({ input: val, queryField: queryFieldName } = {}) => {
        if (val) {
            const { filterArr } = this.state;
            const displayName = this.state.activeColumn.reference_model.display_column;
            const queryField = queryFieldName ? queryFieldName : displayName;
            let url = this.state.activeColumn.reference_model.route_name;
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

        switch (this.state.activeColumn.column_type) {
            case 116: case 117:
                query += this.state.activeColumn.name + ' = ' + data.data.id;
                break;

            default:
                query += this.state.activeColumn.name + ' = ' + data.data;
                break;
        }

        const urlParams = this.urlParams;
        urlParams.search = query;
        Location.search(urlParams);
    };

    callFunction = (event) => {
        let query = '';
        const urlParams = this.urlParams;

        const paramProps = {
            history: this.props.history, match: this.props.match
        };

        if (event.target.value) {
            query += this.state.activeColumn.name + ' like "%25' + event.target.value + '%25"';
            urlParams.search = query;
        } else {
            delete urlParams.search
        }
        this.setState({ query: event.target.value });
        Location.search(urlParams, { reset: true });
    }

    /**
     * on press enter, 
     * @param  {} e
     */
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.callFunction(e);
            return;
        }
        // this.setState({ inputValue: this.state.query + e.key })

    }

    searchLocally = ({ event }) => {
        let selectedColumn = this.state.activeColumn;
        this.props.onEdit(selectedColumn, event.target.value);
        this.setState({ query: event.target.value });
        // this.
    }


    render() {
        const { props } = this;
        const { dictionary, history, match } = this.props;
        const { selectedColumn = {}, query = '' } = this.state;
        const { reference_model } = selectedColumn;
        const { referenceColumnValue, activeColumn } = this.state;



        return (
            <div className="listing-search-container">
                {
                    <div className="listing-search-tool">
                        <div className="listing-select-tool">
                            <SelectBox label="display_name"
                                isClearable={false}
                                onChange={(data) => {
                                    this.filterChange(data)
                                }} value={selectedColumn} options={dictionary} placeholder='Column' />
                        </div>
                        <div className="listing-input-tool">
                            {
                                reference_model && reference_model.id ? (
                                    <SelectBox
                                        onChange={(data) => this.convertToInputField({ data })}
                                        value={referenceColumnValue.data}
                                        field={reference_model.display_column}
                                        // field={reference_model.display_column}
                                        placeholder="Search"
                                        getOptions={(input) => this.getInputRecord({ input })} />
                                ) :
                                    (
                                        <input type="text"
                                            className="input-select form-control"
                                            placeholder={`Search ${selectedColumn.display_name}`}
                                            value={query}
                                            onChange={(event) => this.searchLocally({ event })}
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
