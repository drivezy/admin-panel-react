import React, { Component } from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import './ListingPagination.css';

import SelectBox from './../Forms/Components/Select-Box/selectBox';

export default class ListingPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: props.currentPage ? props.currentPage : 1,
            showPages: 5,
            statsData: props.statsData ? props.statsData : {},
            limit: props.limit || 20
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            currentPage: nextProps.currentPage ? nextProps.currentPage : 1,
            statsData: nextProps.statsData ? nextProps.statsData : {}
        })
    }

    redirectToPage = (pageNumber = this.state.currentPage, limit = 20) => {

        let temPageNumber = pageNumber;
        let tempUrl = `${`?limit=${limit}&page=${pageNumber}`}`;
        // let tempUrl = `${`?limit=${limit}&page=${this.state.currentPage}`}`;
        if (this.state.currentPage === '...') {
            temPageNumber = this.state.currentPage - this.state.showPages
            if (temPageNumber < 1) {
                temPageNumber = 1
            }
            tempUrl = `${`?limit=${pageNumber}&page=${temPageNumber}`}`;
        }
        if (this.state.currentPage === '....') {
            temPageNumber = parseInt(this.state.currentPage) + this.state.showPages
            tempUrl = `${`?limit=${pageNumber}&page=${temPageNumber}`}`;
        }
        this.setState({ currentPage: temPageNumber, limit })
        const { history, match } = this.props;
        history.push(tempUrl);
    }

    // startPage --> current page
    // totalPages -- pages which you want to show current is 5
    createPaginationNumber = (startPage, totalPages) => {

        const { statsData } = this.state
        var number_of_pages = Math.round(statsData.records / statsData.count);

        const pages = [];

        if (number_of_pages <= totalPages) {
            for (let i = 1; i <= number_of_pages; i++) {
                pages.push({ page: i });
            }
            return pages;
        }

        startPage = parseInt(startPage);

        if (startPage >= 2) {
            pages.push({ page: 1 });
            if (startPage > 2) {
                pages.push({ page: '...' })
            }
        }

        let endPage = startPage + totalPages;

        if (endPage <= number_of_pages) {
            for (let i = startPage; i < endPage; i++) {
                pages.push({ page: i });
            }
            if (endPage < number_of_pages) {
                pages.push({ page: '....' })
            }
        } else {
            let startIndex = startPage - totalPages;
            let endIndex = endPage - totalPages;
            if (startIndex <= 0) {
                startIndex = 1;
                endIndex = number_of_pages - 1;
            }
            for (let i = startIndex; i <= endIndex; i++) {
                pages.push({ page: i });
            }
        }
        if (startPage != number_of_pages) {
            pages.push({ page: number_of_pages })
        }
        return pages;
    }


    render() {
        const { currentPage, showPages, statsData } = this.state
        let previousPage;
        let nextPage;
        let pages = [];
        const getTotalPages = [20, 40, 75, 100];
        const { limit } = this.state;

        if (statsData && statsData.records) {
            var number_of_pages = Math.round(statsData.records / statsData.count);
            pages = this.createPaginationNumber(currentPage, showPages);
        }

        if (currentPage) {
            previousPage = parseInt(currentPage) - 1;
            nextPage = parseInt(currentPage) + 1;
        }


        return (
            <div className="listing-pagination">
                <Pagination size="sm">
                    <PaginationItem disabled={previousPage == 0}>
                        <PaginationLink previous onClick={() => this.redirectToPage(`?limit=20&page=${previousPage}`)} />
                    </PaginationItem>
                    {
                        pages && pages.length && pages.map((key, count) => {
                            return (
                                <PaginationItem onClick={() => this.redirectToPage(key.page)} className={currentPage == key.page ? 'highlighted-page' : ''} key={count}>
                                    <PaginationLink >
                                        {key.page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })
                    }

                    <PaginationItem disabled={nextPage == number_of_pages + 1}>
                        <PaginationLink next onClick={() => this.redirectToPage(nextPage)} />
                    </PaginationItem>

                    <div className="page-redirect-number">
                        <SelectBox
                            value={limit}
                            onChange={(data) => { this.redirectToPage(undefined, data) }}
                            options={getTotalPages}
                        />
                    </div>

                </Pagination>

                {
                    statsData && statsData.records > 0 &&
                    <div className="pagination-record">
                        Showing {currentPage ? ((((currentPage) * 20) - 20) + 1) : 0} - {currentPage ? ((currentPage) * 20) : 0} results from {statsData ? statsData.records : 0} records.
                    </div>
                }
            </div>
        )
    }
}