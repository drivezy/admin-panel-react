import { IsObjectHaveKeys, BuildUrlForGetCall, IsUndefined } from './common.utils';
import { StoreEvent } from './stateManager.utils';

let self = {};
let onChangeListeners = {};

export default class FormUtil {

    /**
     * Keeps registering all the events and maintains them in an array
     * @param  {string} {column - column path
     * @param  {function } callback} - callback on event trigger
     */
    static onChange({ column, callback }) {
        onChangeListeners[column] = callback;
    }

    /**
     * This method is being used by form creator to keep notifying
     * on event change
     * 
     * checks if there is any listener on the field, invoke it
     * @param  {object} {column - columns object
     * @param  {object} ...event}
     */
    static OnChangeListener({ column, value, ...event }) {
        console.log('latest value', value);
        if (self.form) {
            self.form.data[column.name] = value;
            const callback = onChangeListeners[column.path];
            if (typeof callback == 'function') {
                callback(value, column, event);
            }
        }

    }

    // /**
    //  * if id is provided return particular element else returns form element
    //  * @param  {string} column {optional}
    //  */
    // static getElement(column) {
    //     if (!column) {
    //         return document.getElementsByTagName("form")[0];
    //     }
    //     return document.getElementById(column);
    // };

    /**
     * Used to change page name
     * @param  {string} name
     */
    static formName(name) {
        self.form.name = name;
    }

    /**
     * set column field to visible or invisible depending on visibility
     * @param  {string} column - column name
     * @param  {boolean} visibility
     */
    static setVisible(column, visibility) {
        self.form.dictionary[column].visibility = visibility;
    };


    /**
     * returns value of the provided column
     * @param  {string} column - column name
     */
    static getValue(column) {
        if (typeof self.form == "object" && self.form.data[column]) {
            return self.form.data[column];
        }

        return null;
    };

    /**
     * sets value of input fields
     * @param  {string} column - column name
     * @param  {any} value - value to be set for particular element
     */
    static setValue(column, value) {
        if (typeof self.form == "object" && !IsUndefined(self.form.data[column])) {
            self.form.data[column] = value;
            return self.form.data[column];
        }

        return false;
    };

    // static 

    static setquery(column, queryParams) {
        const dict = self.form.dictionary[column];

        if (dict && dict.reference_model) {
            let url = dict.reference_model.route_name;
            url = BuildUrlForGetCall(url, queryParams);
            self.form.dictionary[column].reference_model.route_name = url;
        }
    }

    static getMenuDetail() {
        return self.form.menu;
    }

    static getRecordValue(column) {
        return self.form.record[column];
    }

    static getParentValue(column) {
        return self.form.parent[column];
    }

    /**
     * returns dictionary value for provided column
     * @param  {string} column - column name
     */
    static getAttribute(column) {
        return self.form.dictionary[column];
    };

    /**
     * sets dictionary value for provided column
     * for e.g. form.setAttribute('description', {display_name: 'Desc'}) - modified 'description' column's displayname to 'Desc'
     * @param  {string} column - column name
     * @param  {object} attribute - key value 
     */
    static setAttribute(column, attribute) {
        const dict = { ...self.form.dictionary[column], ...attribute };
        self.form.dictionary[column] = dict;
        FormUtil.updateForm(false);
        // this.updateForm();
    };


    /**
     * disables particular form element
     * for e.g. form.setDisabled('description', true) - make description field disabled
     * @param  {string} column - column name
     * @param  {boolean} value -true if disabled, false if enabled
     */
    static setDisabled(column, value) {
        self.form.dictionary[column].disabled = value;
        FormUtil.updateForm(false);
    }

    /**
     * makes field required
     * for e.g. form.setMandatory('description' true) - make description field mandatory
     * @param  {string} column - column name
     * @param  {boolean} value -true if disabled, false if enabled
     */
    static setMandatory(column, value) {
        self.form.dictionary[column].required = value;
        FormUtil.updateForm(false);
    }

    /**
     * every time new script is to be run, this method is invoked to update form object value
     * @param  {object} form
     */
    static setForm(form) {
        self.form = form;
        console.log(form);
        self.data = { ...self.form.data } || {};
        // self.data = self.form.data || {};
    };

    static getOriginalData() {
        return self.data;
    }

    /**
     * Returns form object
     * After script execution, getForm is invoked to fetch modified form value
     * @param  {boolean} clearFormValue
     */
    static getForm() {
        const form = self.form;
        return form;
    }

    /**
     * Clears scope
     */
    static clearFormObject() {
        self.form = {};
        onChangeListeners = {};
    }

    /**
     * Makes modified form object available in formCreator class to appear changes on the ui
     * NOTE : It is suggested to avoid using this method as after execution of script, updateForm is invoked implicitly
     * @param  {boolean} updateState=true - updateState is used to check if DOM should also be refreshed along with form object
     * default value is true
     */
    static updateForm(updateState = true) {
        StoreEvent({ eventName: 'formChanged', data: { ...self.form, ...{ updateState } } });
    }
}


// function test() {
//     let model = form.getValue('model_id');

//     let sourceColumnAttribute = form.getAttribute('source_column_id');
//     // sourceColumnAttribute.reference_model.route_name = 'api/admin/modelColumn?query=model_id=' + model;

//     form.setquery('source_column_id', { query: 'model_id=' + model });
//     form.setAttribute('source_column_id', sourceColumnAttribute);
//     form.updateForm();
// }