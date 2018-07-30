import { Get, Post, Delete, Put } from 'common-js-util';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils';

import { ROUTE_URL } from './../Constants/global.constants';
import { CreateUrl } from './generic.utils';

let self = {};

export default class Pageutil {

    /**
     * every time new script is to be run, this method is invoked to update page object value
     * @param  {object} page
     */
    static setForm(page) {
        self.page = page;
    };

    static getParentValue(column) {
        return column ? self.page.parent[column] : self.page.parent;
    }

    /**
     * returns value of the provided column
     * @param  {string} column - column name
     */
    static getValue(column) {
        if (typeof self.page == "object" && self.page.data[column]) {
            return self.page.data[column];
        }

        return self.page.data;
    };

    /**
     * Returns page object
     * After script execution, getForm is invoked to fetch modified page value
     * @param  {boolean} clearFormValue
     */
    static getForm() {
        const page = self.page;
        return page;
    }

    static redirect(url, queryParam) {
        // static redirect({ action, listingRow, history, genericData }) {
        url = CreateUrl({ url, obj: self.page.data });
        Location.navigate({ url, queryParam });
    }

    static search(obj, reset = false) {
        Location.search(obj, { reset });
    }

    static getData() {
        return self.page.data;
    }

    static setData(column, value) {
        self.page.data[column] = value;
    }

    static alert(message) {
        ToastNotifications.success({ title: message });
    }

    static getMenuDetail() {
        return self.page.menu;
    }


    static httpCall({ url, callback, extraParams, method = 'get', urlPrefix = ROUTE_URL }) {
        const methods = {
            get: Get, post: Post, put: Put, delete: Delete
        };

        methods[method]({ url, callback, extraParams, urlPrefix });
    }
}
