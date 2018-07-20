import React, { Component } from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import { Location } from 'drivezy-web-utils/build/Utils';

import './ListingPagination.css';

import SelectBox from './../Forms/Components/Select-Box/selectBox';

export default class ListingPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current_page: props.current_page,
            statsData: props.statsData,
            limit: props.limit,
            showPages: 5   // Number of pages to be shown between '...' and '....' 
        }
    }


    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            current_page: nextProps.current_page,
            statsData: nextProps.statsData,
        })
    }



    redirectToPage = (current_page, limit) => {
        const { showPages } = this.state
        let temPageNumber = current_page;   //temporary page number

        let tempLimit = limit.value ? limit.value : limit; // limit of number of entries in a page -20 -40 -75 -100

        if (tempLimit != this.state.limit) {        //when limit is changed (for eg from 100 to 20), redirect to the 1st page 
            current_page = 1;
            temPageNumber = current_page;
        }
        let tempUrl;

        if (current_page === '...') {
            temPageNumber = this.state.current_page - parseInt((showPages / 2) + 1);    //when clicked on this, show previous 3 pages
            if (temPageNumber < 1) {
                temPageNumber = 1
            }
            tempUrl = `${`?limit=${tempLimit}&page=${temPageNumber}`}`;
        }

        if (current_page === '....') {
            temPageNumber = parseInt(this.state.current_page) + parseInt((showPages / 2) + 1);  //when clicked on this, show next 3 page

            tempUrl = `${`?limit=${tempLimit}&page=${temPageNumber}`}`;
        }

        const urlParams = { limit: tempLimit, page: temPageNumber };
        this.setState({ current_page: temPageNumber, limit: tempLimit });
        this.state.current_page = temPageNumber;
        this.state.limit = tempLimit;

        Location.search(urlParams);

        // let tempUrl = `${`?limit=${tempLimit}&page=${temPageNumber}`}`;
        // const { history, match } = this.props;
        // history.push(tempUrl);

    }


    createPaginationNumber = (currentPage, showPages) => {

        const { statsData, limit } = this.state

        let page_length = Math.ceil(statsData.total / limit);

        const pages = [];

        pages.push({ page: 1 });

        if (page_length <= showPages) {                     //if total no of pages available is less than minimum no of pages to be shown, show all the pages
            for (let i = 2; i <= page_length; i++) {
                pages.push({ page: i });
            }
            return pages;
        }

        currentPage = parseInt(currentPage);

        let startIndex = currentPage - parseInt(showPages / 2);     //startIndex= The first page to be shown after ...
        let endIndex = currentPage + parseInt(showPages / 2);       //endIndex= The last page to be shown before ....
        if (endIndex > page_length)
            endIndex = page_length;

        if (currentPage < 3)
            endIndex = 5

        // this.setState({ startIndex, endIndex })

        if (startIndex >= 5)                                        //If startIndex is >=5. i.e. current page is >=7 , show ...
            pages.push({ page: '...' });
        else
            for (let i = 2; i < startIndex; i++)
                pages.push({ page: i });

        {
            let i;
            if (startIndex > 3)
                i = startIndex;
            else if (currentPage == 5)
                i = 3;
            else
                i = 2;

            for (; i < endIndex; i++)
                pages.push({ page: i });
        }

        if (endIndex <= page_length - 4)
            pages.push({ page: '....' });
        else
            for (let i = endIndex; i < page_length; i++)
                pages.push({ page: i });

        pages.push({ page: page_length });

        return pages;
    }


    render() {
        const { current_page, statsData, showPages, limit } = this.state

        const pageRecordOptions = ["20", "40", "75", "100"];

        let previousPage;

        let nextPage;

        let pages = [];


        if (statsData && statsData.total) {
            var page_length = Math.ceil(statsData.total / statsData.record);
            pages = this.createPaginationNumber(current_page, showPages);
        }

        if (current_page) {
            previousPage = parseInt(current_page) - 1;
            nextPage = parseInt(current_page) + 1;
        }



        return (
            <div className="listing-pagination">
                <Pagination className="sm">
                    <PaginationItem className="previous-page-go" disabled={previousPage == 0}>
                        <PaginationLink previous onClick={() => this.redirectToPage(previousPage, limit)} />
                    </PaginationItem>
                    {
                        pages && pages.length && pages.map((key, count) =>
                            <PaginationItem onClick={() => this.redirectToPage(key.page, limit)} className={current_page == key.page ? 'highlighted-page' : ''} key={count}>
                                <PaginationLink >
                                    {key.page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    }

                    <PaginationItem className="next-page-go"disabled={nextPage == page_length + 1}>
                        <PaginationLink next onClick={() => this.redirectToPage(nextPage, limit)} />
                    </PaginationItem>

                    <div className="page-redirect-number">
                        <SelectBox
                            value={limit}
                            onChange={(data) => { this.redirectToPage(current_page, data) }}
                            options={pageRecordOptions}
                        />
                    </div>
                </Pagination>


                {
                    statsData && statsData.total > 0 &&
                    <div className="pagination-record">
                        Showing {current_page ? ((((current_page) * limit) - limit) + 1) : 0} - {current_page ? ((current_page) * limit) : 0} results from {statsData ? statsData.total : 0}
                    </div>
                }
            </div>
        )
    }
}