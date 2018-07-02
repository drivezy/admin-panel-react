import React, { Component } from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import './ListingPagination.css';

import SelectBox from './../Forms/Components/Select-Box/selectBox';

export default class ListingPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current_page: props.current_page,
            statsData: props.statsData,
            limit: props.limit,
            showPages: 5

        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            current_page: nextProps.current_page,
            statsData: nextProps.statsData
        })
    }

    redirectToPage = (current_page, limit) => {
        const { showPages } = this.state
        let temPageNumber = current_page;



        let tempLimit = limit.value ? limit.value : limit;

        if (tempLimit != this.state.limit) {
            current_page = 1;
            temPageNumber = current_page;
        }

        if (current_page === '...') {
            temPageNumber = this.state.current_page - parseInt((showPages / 2) + 1);
            if (temPageNumber < 1) {
                temPageNumber = 1
            }
            tempUrl = `${`?limit=${tempLimit}&page=${temPageNumber}`}`;
        }

        if (current_page === '....') {
            temPageNumber = parseInt(this.state.current_page) + parseInt((showPages / 2) + 1);

            tempUrl = `${`?limit=${tempLimit}&page=${temPageNumber}`}`;
        }

        let tempUrl = `${`?limit=${tempLimit}&page=${temPageNumber}`}`;

        this.setState({ current_page: temPageNumber, tempLimit })
        const { history, match } = this.props;
        history.push(tempUrl);
    }


    createPaginationNumber = (currentPage, showPages) => {

        const { statsData } = this.state
        let number_of_pages = Math.round(statsData.total / statsData.record);

        const pages = [];

        pages.push({ page: 1 });

        if (number_of_pages <= showPages) {
            for (let i = 2; i <= number_of_pages; i++) {
                pages.push({ page: i });
            }
            return pages;
        }

        currentPage = parseInt(currentPage);



        let startIndex = currentPage - parseInt(showPages / 2);
        let endIndex = currentPage + parseInt(showPages / 2);
        if (endIndex > number_of_pages)
            endIndex = number_of_pages;

        if (currentPage < 3)
            endIndex = 5

        // this.setState({ startIndex, endIndex })

        if (startIndex >= 5)
            pages.push({ page: '...' });
        else
            for (let i = 2; i <= startIndex; i++)
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

        if (endIndex <= number_of_pages - 4)
            pages.push({ page: '....' });
        else
            for (let i = endIndex; i < number_of_pages; i++)
                pages.push({ page: i });

        pages.push({ page: number_of_pages });

        console.log(startIndex + 'bbcbcbbc' + endIndex)

        return pages;
    }


    render() {
        const { current_page, limit, statsData, showPages } = this.state


        console.log(current_page, limit, statsData);
        const pageRecordOptions = [20, 40, 75, 100];

        let previousPage;

        let nextPage;

        let pages = [];

        if (statsData && statsData.total) {
            var page_length = Math.round(statsData.total / statsData.record);
            pages = this.createPaginationNumber(current_page, showPages);

        }

        if (current_page) {
            previousPage = parseInt(current_page) - 1;
            nextPage = parseInt(current_page) + 1;
        }

        return (
            <div className="listing-pagination">
                <Pagination className="sm">
                    <PaginationItem disabled={previousPage == 0}>
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

                    <PaginationItem disabled={nextPage == page_length + 1}>
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
                        Showing {current_page ? ((((current_page) * limit) - 20) + 1) : 0} - {current_page ? ((current_page) * limit) : 0} results from {statsData ? statsData.total : 0} total.
                    </div>
                }
            </div>
        )
    }
}