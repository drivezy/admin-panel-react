// import React, { Component } from 'react';
// import './PortletTable.css';

// import {
//     Table, Card, CardImg, CardText, CardBody,
//     CardTitle, CardSubtitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
// } from 'reactstrap';

// import CustomAction from './../Custom-Action/CustomAction';

// import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

// const MENU_TYPE = 'SIMPLE';

// function collect(props) {
//     return { name: props.name };
// }

// export default class PortletTable extends Component {

//     constructor(props) {
//         super(props);

//         this.state = {
//             finalColumns: this.props.finalColumns,
//             listing: this.props.listing,
//             genericData: this.props.genericData,
//             sortKey: '',
//             reverse: false,
//             dropdownOpen: {},
//             logs: []
//         };
//         this.onSort = this.onSort.bind(this)
//     }

//     componentDidMount() {
//         setTimeout(() => {
//             this.adjustWidth();
//         }, 300)
//     }


//     // According to action width 
//     // width of table is assigned
//     adjustWidth = () => {
//         const actionColumnEle = document.getElementsByClassName('action-column')[0];
//         if (actionColumnEle) {
//             var actionColumnWidth = actionColumnEle.clientWidth;
//             var table = document.getElementsByClassName('table')[0];
//             var tableWidth = table.clientWidth;

//             var percent = (100 - (actionColumnWidth / tableWidth) * 100);

//             table.setAttribute('style', 'width:calc(' + percent + '% - 2px )');
//         }
//     }

//     onSort(event, sortKey) {
//         const listing = this.state.listing;

//         function generateSortFn(prop, reverse) {
//             return function (a, b) {
//                 if (eval('a.' + prop) < eval('b.' + prop)) return reverse ? 1 : -1;
//                 if (eval('a.' + prop) > eval('b.' + prop)) return reverse ? -1 : 1;
//                 return 0;
//             };
//         }

//         let reverse = this.state.reverse;

//         if (this.state.sortKey == sortKey) {

//             reverse = !reverse;
//             listing.sort(generateSortFn(sortKey, reverse));

//         } else {
//             reverse = false;
//             listing.sort(generateSortFn(sortKey, reverse));
//         }

//         this.setState({ listing, sortKey, reverse })
//     }

//     handleClick = (e, data) => {
//         console.log("Dheeraj", data);
//         this.setState(({ logs }) => ({
//             logs: [`Clicked on ${data.name} menu ${data.item}`, ...logs]
//         }));
//     }


//     render() {

//         const sortTypes = [{
//             id: 0,
//             icon: 'fa-sort-numeric-down',
//             caption: 'Sort Asc',
//             type: 'asc'
//         }, {
//             id: 1,
//             icon: 'fa-sort-numeric-up',
//             caption: 'Sort Desc',
//             type: 'desc'
//         }];

//         const rowOptions = [{
//             id: 0,
//             name: "Copy Row Id",
//             icon: 'fa-copy',
//         }, {
//             id: 1,
//             name: "Show Matching",
//             icon: 'fa-retweet',
//         }, {
//             id: 2,
//             name: "Filter Out",
//             icon: 'fa-columns',
//         }, {
//             id: 3,
//             name: "Filter More",
//             icon: 'fa-filter',
//         }, {
//             id: 4,
//             name: "Aggregation",
//             icon: 'fa-chart-line',
//         }];

//         const { genericData, finalColumns, listing, history, callback, rowTemplate } = this.state;
//         return (
//             <div className="table-style">
//                 <Table striped className="sortable">
//                     <thead>
//                         <tr>
//                             <th>
//                             </th>
//                             {
//                                 finalColumns.map((selectedColumn, key) => {
//                                     return (
//                                         <th className="column-header" key={key}>
//                                             {/* Column Wrapper */}
//                                             <div className="column-wrapper">
//                                                 {/* Column Title */}
//                                                 <div className="column-title printable">
//                                                     <a onClick={e => this.onSort(e, selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.headerName))}>
//                                                         <span>{selectedColumn.display_name}</span>
//                                                         <i className={`fas ${(this.state.sortKey === (selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.column_name))) ? (this.state.reverse ? 'fa-chevron-up' : 'fa-chevron-down') : ''}`} />
//                                                     </a>
//                                                 </div>
//                                                 {/* Column Title Ends */}

//                                                 {/* Filter Column */}
//                                                 {
//                                                     selectedColumn.path.split('.').length < 3 &&
//                                                     <div className="filter-column">
//                                                         <a ng-click="portlet.preventDefault($event);portlet.filterColumn(select-edColumn)">
//                                                             <i className="fas fa-filter"></i>
//                                                         </a>
//                                                     </div>
//                                                 }
//                                                 {/* Filter Ends */}
//                                                 {/* DB Level */}

//                                                 {
//                                                     (selectedColumn.path.split('.').length == 1) && (selectedColumn.column_type != 118) &&
//                                                     (

//                                                         <div className="db-level-sort">
//                                                             {
//                                                                 <Dropdown isOpen={this.state.dropdownOpen[selectedColumn.id]} toggle={() => this.toggle(selectedColumn)}>
//                                                                     <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}>
//                                                                         <a className="dropdown-link">
//                                                                             <i className="fas fa-sort-amount-down"></i>
//                                                                         </a>
//                                                                     </DropdownToggle>
//                                                                     <DropdownMenu>
//                                                                         {
//                                                                             sortTypes.map((sort, key) => {
//                                                                                 return (
//                                                                                     <div className="dropdown-item" key={key} onClick={e => this.sortOnDB(sort, selectedColumn.path)}>
//                                                                                         <i className={`fas ${sort.icon}`} /> {sort.caption}
//                                                                                     </div>
//                                                                                 )
//                                                                             })
//                                                                         }
//                                                                     </DropdownMenu>
//                                                                 </Dropdown>
//                                                             }
//                                                         </div>
//                                                     )
//                                                 }
//                                             </div>
//                                         </th>
//                                     )
//                                 })
//                             }
//                             <th className="action-header">
//                                 <span className="fa fa-cog fa-lg"></span>
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {listing.map((listingRow, rowKey) => (
//                             <ContextMenuTrigger
//                                 renderTag='tr' name={listingRow.name}
//                                 id={MENU_TYPE} holdToDisplay={1000} key={rowKey}
//                                 collect={collect}>
//                                 <td className="row-key">
//                                     {rowKey + 1}
//                                 </td>
//                                 {
//                                     finalColumns.map((selectedColumn, key) => (
//                                         <td key={key}>
//                                             {
//                                                 rowTemplate ?
//                                                     rowTemplate({ listingRow, selectedColumn }) :
//                                                     eval('listingRow.' + selectedColumn.path)
//                                             }
//                                         </td>
//                                     ))
//                                 }
//                                 <td className="custom-action action-column">
//                                     <CustomAction history={history} genericData={genericData} actions={genericData.nextActions} listingRow={listingRow} placement={167} callback={callback} />
//                                 </td>
//                             </ContextMenuTrigger>
//                         ))}
//                     </tbody>
//                 </Table>
//                 <ContextMenu id={MENU_TYPE} className="context-menu">
//                     {
//                         rowOptions.map((rowOption, key) => {
//                             return (
//                                 <MenuItem key={key} onClick={this.handleClick} data={{ item: 'item 1' }}><i className={`fas ${rowOption.icon}`}/> {rowOption.name}</MenuItem>
//                             )
//                         })
//                     }
//                 </ContextMenu>
//             </div>
//         );
//     }
// }






import React, { Component } from 'react';
import './PortletTable.css';

import {
    Table, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import CustomAction from './../Custom-Action/CustomAction';
import RightClick from './../Right-Click/rightClick'

export default class PortletTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            finalColumns: this.props.finalColumns,
            listing: this.props.listing,
            genericData: this.props.genericData,
            sortKey: '',
            reverse: false,
            dropdownOpen: {},
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.adjustWidth();
        }, 300)
    }


    // According to action width 
    // width of table is assigned
    adjustWidth = () => {
        const actionColumnEle = document.getElementsByClassName('action-column')[0];
        if (actionColumnEle) {
            var actionColumnWidth = actionColumnEle.clientWidth;
            var table = document.getElementsByClassName('table')[0];
            var tableWidth = table.clientWidth;

            var percent = (100 - (actionColumnWidth / tableWidth) * 100);

            table.setAttribute('style', 'width:calc(' + percent + '% - 2px )');
        }
    }

    toggle = (column) => {
        let dropdownOpen = this.state.dropdownOpen;

        dropdownOpen[column.id] = !dropdownOpen[column.id]

        this.setState({
            dropdownOpen
        });
    }

    onSort = (event, sortKey) => {
        const listing = this.state.listing;

        function generateSortFn(prop, reverse) {
            return function (a, b) {
                if (eval('a.' + prop) < eval('b.' + prop)) return reverse ? 1 : -1;
                if (eval('a.' + prop) > eval('b.' + prop)) return reverse ? -1 : 1;
                return 0;
            };
        }

        let reverse = this.state.reverse;

        if (this.state.sortKey == sortKey) {

            reverse = !reverse;
            listing.sort(generateSortFn(sortKey, reverse));

        } else {
            reverse = false;
            listing.sort(generateSortFn(sortKey, reverse));
        }

        this.setState({ listing, sortKey, reverse })
    }


    render() {

        const sortTypes = [{
            id: 0,
            icon: 'fa-sort-numeric-down',
            caption: 'Sort Asc',
            type: 'asc'
        }, {
            id: 1,
            icon: 'fa-sort-numeric-up',
            caption: 'Sort Desc',
            type: 'desc'
        }];

        const { genericData, finalColumns, listing, history, callback, rowTemplate } = this.state;
        return (
            <Table striped className="sortable">
                <thead>
                    <tr>
                        <th>
                        </th>
                        {
                            finalColumns.map((selectedColumn, key) => {
                                return (
                                    <th className="column-header" key={key}>
                                        {/* Column Wrapper */}
                                        <div className="column-wrapper">
                                            {/* Column Title */}
                                            <div className="column-title printable">
                                                <a onClick={e => this.onSort(e, selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.headerName))}>
                                                    <span>{selectedColumn.display_name}</span>
                                                    <i className={`fas ${(this.state.sortKey === (selectedColumn.column_type != 118 ? (selectedColumn.path) : (selectedColumn.column_name))) ? (this.state.reverse ? 'fa-chevron-up' : 'fa-chevron-down') : ''}`} />
                                                </a>
                                            </div>
                                            {/* Column Title Ends */}

                                            {/* Filter Column */}
                                            {
                                                selectedColumn.path.split('.').length < 3 &&
                                                <div className="filter-column">
                                                    <a ng-click="portlet.preventDefault($event);portlet.filterColumn(select-edColumn)">
                                                        <i className="fas fa-filter"></i>
                                                    </a>
                                                </div>
                                            }
                                            {/* Filter Ends */}
                                            {/* DB Level */}

                                            {
                                                (selectedColumn.path.split('.').length == 1) && (selectedColumn.column_type != 118) &&
                                                (

                                                    <div className="db-level-sort">
                                                        {
                                                            <Dropdown isOpen={this.state.dropdownOpen[selectedColumn.id]} toggle={() => this.toggle(selectedColumn)}>
                                                                <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}>
                                                                    <a className="dropdown-link">
                                                                        <i className="fas fa-sort-amount-down"></i>
                                                                    </a>
                                                                </DropdownToggle>
                                                                <DropdownMenu>
                                                                    {
                                                                        sortTypes.map((sort, key) => {
                                                                            return (
                                                                                <div className="dropdown-item" key={key} onClick={e => this.sortOnDB(sort, selectedColumn.path)}>
                                                                                    <i className={`fas ${sort.icon}`} /> {sort.caption}
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </th>
                                )
                            })
                        }
                        <th className="action-header">
                            <span className="fa fa-cog fa-lg"></span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listing.map((listingRow, rowKey) => {
                            return (
                                <tr className="table-row" key={rowKey}>

                                    <td className="row-key">
                                        {rowKey + 1}
                                    </td>
                                    {
                                        finalColumns.map((selectedColumn, key) => (
                                            <td key={key}>
                                                <RightClick key={key} renderTag="div" rowTemplate={rowTemplate} listingRow={listingRow} selectedColumn={selectedColumn}></RightClick>
                                            </td>
                                        ))
                                    }
                                    <td className="custom-action action-column">
                                        <CustomAction history={history} genericData={genericData} actions={genericData.nextActions} listingRow={listingRow} placement={167} callback={callback} />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </Table>
        );
    }
}
