import React, { Component } from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import './ListingPagination.css';

import SelectBox from './../Forms/Components/Select-Box/selectBox';

export default class ListingPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: props.currentPage ? props.currentPage : 1,
            step: 5,
            statsData: props.statsData ? props.statsData : {}
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentPage: nextProps.currentPage ? nextProps.currentPage : 1,
            statsData: nextProps.statsData ? nextProps.statsData : {}
        })
    }

    redirectToPage = (pageNumber, limit = 20) => {

        let temPageNumber = pageNumber
        let tempUrl = `${`?limit=${pageNumber}&page=${this.state.currentPage}`}`;
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
        this.setState({ currentPage: temPageNumber })
        const { history, match } = this.props;
        history.push(tempUrl);
    }

    createPaginationNumber = (currentPage, step) => {

        const { statsData } = this.state
        var number_of_pages = Math.ceil(statsData.records / statsData.count);

        const pages = [];

        currentPage = parseInt(currentPage);

        if (number_of_pages <= step) {
            for (let i = 1; i <= number_of_pages; i++) {
                pages.push({ page: i });
            }
            return pages;
        }

        for (let i = 1; i <= number_of_pages; i++) {
            if (i == 1) {
                pages.push({ page: 1 })
                if (currentPage >= 3) {
                    pages.push({ page: '...' })
                }
            }

            let startIndex = currentPage;
            let endIndex = currentPage + step

            if (endIndex > number_of_pages && i > 2) {
                startIndex = startIndex - step;
                endIndex = number_of_pages
            }

            if (i >= startIndex && i <= endIndex && i < number_of_pages && i != 1) {
                pages.push({ page: i })
            }

            if (i == number_of_pages) {
                if (endIndex < number_of_pages) {
                    pages.push({ page: '....' })
                }

                pages.push({ page: i })
            }
        }

        return pages;
    }


    render() {
        const { currentPage, step, statsData } = this.state
        let previousPage;
        let nextPage;
        let pages = [];
        const getTotalPages = [20, 40, 75, 100];


        if (statsData && statsData.records) {
            var number_of_pages = Math.round(statsData.records / statsData.count);
            pages = this.createPaginationNumber(currentPage, step);
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
                            value={getTotalPages[0]}
                            onChange={(data) => { this.redirectToPage(data) }}
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