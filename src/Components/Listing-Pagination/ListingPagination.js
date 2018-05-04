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

        if (genericData.stats) {
            var number_of_pages = Math.round(genericData.stats.records / genericData.stats.count);

            var pages = [];

            for (var i = 1; i < number_of_pages; i++) {
                pages.push({ page: i });
            }
        }



        return (
            <div className="listing-pagination">
                <Pagination>
                    <PaginationItem disabled>
                        <PaginationLink previous href="#" />
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
                    <PaginationItem>
                        <PaginationLink next href={`?query=limit=20&page=${genericData.currentPage}`} />
                    </PaginationItem>
                </Pagination>
            </div>
        )
    }
}