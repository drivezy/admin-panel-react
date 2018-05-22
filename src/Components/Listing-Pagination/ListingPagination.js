import React, { Component } from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import './ListingPagination.css';

export default class ListingPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: props.currentPage ? props.currentPage : 1,
            showPages: 5,
            statsData: props.statsData ? props.statsData : {}
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentPage: nextProps.currentPage ? nextProps.currentPage : 1,
            statsData: nextProps.statsData ? nextProps.statsData : {}
        })
    }

    redirectToPage = (pageNumber) => {

        let temPageNumber = pageNumber
        let tempUrl = `${`?limit=20&page=${pageNumber}`}`;
        if (pageNumber === '...') {
            temPageNumber = this.state.currentPage - this.state.showPages
            if (temPageNumber < 1) {
                temPageNumber = 1
            }
            tempUrl = `${`?limit=20&page=${temPageNumber}`}`;
        }
        if (pageNumber === '....') {
            temPageNumber = parseInt(this.state.currentPage) + this.state.showPages
            tempUrl = `${`?limit=20&page=${temPageNumber}`}`;
        }
        this.setState({ currentPage: temPageNumber })
        const { history, match } = this.props;
        history.push(tempUrl);
    }

    createPaginationNumber = (startPage, totalPages) => {
        const { statsData } = this.state
        var number_of_pages = Math.round(statsData.records / statsData.count);

        const pages = [];

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
        }

        pages.push({ page: number_of_pages })

        return pages;
    }


    render() {
        const { currentPage, showPages, statsData } = this.state
        let previousPage;
        let nextPage;
        let pages = [];
        // let showFlag = '.....';

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

                    {/* {
                        number_of_pages > showPages ?
                            <PaginationItem>
                                <PaginationLink onClick={() => this.createNextFewPages()}>
                                    {showFlag}
                                </PaginationLink>
                            </PaginationItem>
                            :
                            null
                    } */}

                    {/* {
                        showPages < number_of_pages &&
                        <PaginationItem>
                            <PaginationLink onClick={() => this.redirectToPage(number_of_pages)} >
                                {number_of_pages}
                            </PaginationLink>
                        </PaginationItem>
                    } */}

                    <PaginationItem disabled={nextPage == number_of_pages + 1}>
                        <PaginationLink next onClick={() => this.redirectToPage(nextPage)} />
                    </PaginationItem>


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