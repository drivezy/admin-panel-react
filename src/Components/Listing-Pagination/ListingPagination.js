import React, { Component } from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import './ListingPagination.css';

export default class ListingPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genericData: props.genericData
        };
    }

    redirectToPage = (pageUrl) => {
        const { history, match } = this.props;
        history.push(`${match.url}${pageUrl}`);
    }

    render() {
        const { genericData = {} } = this.props;
        let previousPage;
        let nextPage;
        const pages = [];
        const showPages = 5;
        let showFlag = '.....';

        if (genericData.stats) {
            var number_of_pages = Math.round(genericData.stats.records / genericData.stats.count);
            for (let i = 1; i <= showPages; i++) {
                pages.push({ page: i });
            }
        }

        if (genericData.currentPage) {
            previousPage = parseInt(genericData.currentPage) - 1;
            nextPage = parseInt(genericData.currentPage) + 1;
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
                                <PaginationItem onClick={() => this.redirectToPage(`?limit=20&page=${key.page}`)} className={genericData.currentPage == key.page ? 'highlighted-page' : ''} key={count}>
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
                                <PaginationLink onClick={() => this.redirectToPage(`?query=limit=20&page=${nextPage}`)}>
                                    {genericData.currentPage} {showFlag}
                                </PaginationLink>
                            </PaginationItem>
                            :
                            null
                    }

                    {
                        showPages < number_of_pages &&
                        <PaginationItem>
                            <PaginationLink onClick={() => this.redirectToPage(`?query=limit=20&page=${number_of_pages}`)} >
                                {number_of_pages}
                            </PaginationLink>
                        </PaginationItem>
                    }

                    <PaginationItem disabled={nextPage == number_of_pages + 1}>
                        <PaginationLink next onClick={() => this.redirectToPage(`?query=limit=20&page=${nextPage}`)} />
                    </PaginationItem>

                    <div className="pagination-record">
                        Showing {genericData.currentPage?((((genericData.currentPage)*20)-20)+1):0} - {genericData.currentPage?((genericData.currentPage)*20):0} results from {genericData.stats?genericData.stats.records:0} records.
                    </div>

                </Pagination>


            </div>
        )
    }
}