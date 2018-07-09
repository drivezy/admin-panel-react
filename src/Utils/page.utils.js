import { Location } from './location.utils';
import { CreateUrl } from './generic.utils';
import ToastNotifications from './toast.utils';
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
        ToastNotifications.success(message);
    }

    static getMenuDetail() {
        return self.page.menu;
    }
}
