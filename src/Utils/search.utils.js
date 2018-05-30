import React, { Component } from 'react';
import { SSL_OP_NO_QUERY_MTU } from 'constants';

export class SearchKeywordComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: ''
        }
    }

    render() {
        const { keyword } = this.state;
        console.log(keyword);
        return (
            <h1>{keyword}</h1>
        )
    }
}

export class SearchUtils {
    _currentGlobalLoader = null;
    static RegisterSearch(ref) {
        this._currentGlobalLoader = ref;
    }
    static searchKeyword(keyword) {
        if (this._currentGlobalLoader && this._currentGlobalLoader.searchKeyword) {
            this._currentGlobalLoader.searchKeyword( keyword );
        }
    }
}