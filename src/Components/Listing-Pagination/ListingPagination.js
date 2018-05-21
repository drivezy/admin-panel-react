import React, { Component } from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import './ListingPagination.css';

export default class ListingPagination extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        
    }

    redirectToPage = (pageUrl) => {
        const { history, match } = this.props;
        history.push(`${match.url}${pageUrl}`);
    }

    render() {
        const { statsData = {}, currentPage = 1 } = this.props;
        let previousPage;
        let nextPage;
        const pages = [];
        const showPages = 10;
        let showFlag = '.....';

        if (statsData) {
            var number_of_pages = Math.round(statsData.records / statsData.count);
            for (let i = 1; i <= showPages; i++) {
                pages.push({ page: i });
            }
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
                                <PaginationItem onClick={() => this.redirectToPage(`?limit=20&page=${key.page}`)} className={currentPage == key.page ? 'highlighted-page' : ''} key={count}>
                                    <PaginationLink >
                                        {key.page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })
                    }

                    {
                        number_of_pages > showPages ?
                            <PaginationItem>
                                <PaginationLink onClick={() => this.redirectToPage(`?limit=20&page=${nextPage}`)}>
                                    {showFlag}
                                </PaginationLink>
                            </PaginationItem>
                            :
                            null
                    }

                    {
                        showPages < number_of_pages &&
                        <PaginationItem>
                            <PaginationLink onClick={() => this.redirectToPage(`?limit=20&page=${number_of_pages}`)} >
                                {number_of_pages}
                            </PaginationLink>
                        </PaginationItem>
                    }

                    <PaginationItem disabled={nextPage == number_of_pages + 1}>
                        <PaginationLink next onClick={() => this.redirectToPage(`?limit=20&page=${nextPage}`)} />
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