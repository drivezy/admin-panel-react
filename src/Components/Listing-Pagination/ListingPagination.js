import React, { Component } from 'react';
import './ListingPagination';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';


export default class ListingPagination extends Component {


    constructor(props) {
        super(props);
        this.state = {
            genericData: props.genericData
        };
    }

    render() {
        const { genericData = {} } = this.props;
        let previousPage;
        let nextPage;
        const pages = [];
        if (genericData.stats) {
            var number_of_pages = Math.round(genericData.stats.records / genericData.stats.count);
            console.log(number_of_pages);
            for (let i = 1; i < number_of_pages; i++) {
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
                        <PaginationLink previous href={`?query=limit=20&page=${previousPage}`} />
                    </PaginationItem>
                    {
                        pages && pages.length && pages.map((key, count) => {
                            return (
                                <PaginationItem key={count}>
                                    <PaginationLink href={`?query=limit=20&page=${key.page}`} >
                                        {key.page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })
                    }
                    <PaginationItem disabled={nextPage == number_of_pages+1}>
                        <PaginationLink next href={`?query=limit=20&page=${nextPage}`} />
                    </PaginationItem>
                </Pagination>
            </div>
        )
    }
}