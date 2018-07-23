import { Get, Post, Delete, Put } from 'common-js-util';
import { Location, ToastNotifications } from 'drivezy-web-utils/build/Utils';

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

    /**
     * Returns page object
     * After script execution, getForm is invoked to fetch modified page value
     * @param  {boolean} clearFormValue
     */
    static getForm() {
        const page = self.page;
        return page;
    }

    static redirect(url) {
        // static redirect({ action, listingRow, history, genericData }) {
        url = CreateUrl({ url, obj: self.page.data });
        Location.navigate({ url });
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


    static httpCall({ url, callback, extraParams, method = 'get', urlPrefix }) {
        const methods = {
            get: Get, post: Post, put: Put, delete: Delete
        };

        methods[method]({ url, callback, extraParams, urlPrefix });
    }
}
