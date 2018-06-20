import { IsObjectHaveKeys } from './common.utils';
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
    static OnChangeListener({ column, ...event }) {
        const callback = onChangeListeners[column.path];
        if (typeof callback == 'function') {
            callback(event, column);
        }
    }

    /**
     * if id is provided return particular element else returns form element
     * @param  {string} column {optional}
     */
    static GetElement(column) {
        if (!column) {
            return document.getElementsByTagName("form")[0];
        }
        return document.getElementById(column);
    };

    /**
     * Used to change page name
     * @param  {string} name
     * @param  {object} form
     */
    static PageName(name, form) {
        self.form.name = name;
    }
    /**
     * set element to visible or invisible depending on visibility
     * @param  {string} column
     * @param  {boolean} visibility
     */
    static SetVisible(column, visibility) {
        self.form.dictionary[column].visibility = visibility;
    };

    /**
     * returns ngModel value of the column type param
     * @param  {object} form - form object
     * @param  {string} column - column type
     */
    static GetColumnValue(column) {
        if (typeof self.form == "object" && self.form.data[column]) {
            return self.form.data[column];
        }

        return null;
    };

    /**
     * sets value of input fields & textareas
     * @param  {object} form - form ngmodel value
     * @param  {string} column - column type
     * @param  {any} value - value to be set for particular element
     */
    static SetValue(column, value) {
        if (typeof self.form == "object" && self.form.data[column]) {
            self.form.data[column] = value;
            return self.form.data[column];
        }

        return false;
    };

    /**
     * disables particular form element
     * @param  {string} column - column type
     * @param  {boolean} value -true if disabled, false if enabled
     */
    static SetDisabled(column, value) {
        self.form.dictionary[column].disabled = value;
    }

    /**
     * adds extra attribute to element and make field required
     * @param  {string} column
     * @param  {boolean} value -true if disabled, false if enabled
     */
    static SetMandatory(column, value) {
        self.form.dictionary[column].required = value;
    }

    /**
     * registers method against given form element, triggers callback on change of form elemenets
     * @param  {object} callBack - callback method to be triggered on change
     * @param  {string} column {optional} - returns data of only particular column
     * @param  {object} formElement {optional} - element of form to be watched
     */
    // static OnChange(column, callBack, formElement) {
    //     const formUtil = new FormUtil();
    //     if (!formElement) {
    //         formElement = formUtil.GetElement();
    //     }

    //     formElement.addEventListener("change", function (event) {
    //         const scopeObj = formUtil.GetScopeValue(event, formElement, column); // returns latest value
    //         const oldVal = this.getSelectedColumn(self.form.data, column);

    //         // @TODO right now callback is triggered for change in any element, make callback to trigger only for
    //         // change in particular element
    //         callBack(scopeObj, oldVal);
    //     }, true);
    // };

    /**
     * manually triggers change event for ui-slect field
     * @param  {object} detail - object is attached to send along with event object
     */
    static GetSelectOnChangeUpdate(detail) {
        const formUtil = new FormUtil();
        const formElement = formUtil.GetElement();
        if ("createEvent" in document) {
            const evObj = document.createEvent("HTMLEvents");

            evObj.detail = detail;
            evObj.initEvent("change", true, true);
            formElement.dispatchEvent(evObj);
        } else {
            formElement.fireEvent("onchange");
        }
    };

    /**
     * saves form without closing modal
     */
    static Save() {
        const formUtil = new FormUtil();
        const formELement = formUtil.GetElement();
        // angular.element(formELement).scope().$parent.modalObj.submitForm(true);
    };

    /**
     * saves form and close modal
     * use this method only with onChange
     */
    static Submit() {
        const formUtil = new FormUtil();
        // const formElement = formUtil.GetElement();
        // angular.element(formELement).scope().$parent.modalObj.submitForm(false);
    };

    /**
     * every time new script is to be run, this method is invoked to update form object value
     * @param  {object} form
     */
    static SetFormValue(form) {
        self.form = form;
    };

    /**
     * Once script is executed, returns modified form obj
     * @param  {boolean} clearFormValue
     */
    static GetFormValue(clearFormValue) {
        const form = self.form;
        // self.form = {};
        // self.onChangeListeners = {};
        return form;
    }

    /**
     * used to manipulate elements
     * it first checks if element is ui-select or normal input or textarea and then acts acrrodingly
     * @param  {string} column
     * @param  {array} keyVal - array of objects containing what action to be taken if element is ui-select of
     *     normal input
     */
    manupulateUI(column, keyVal) {
        const formUtil = new FormUtil();
        const element = formUtil.GetElement(column);
        let input = element.querySelector("select-field");
        // const input = angular.element(element.querySelector("select-field"));
        if (IsObjectHaveKeys(input)) { // if ui-select field
            input.attr(keyVal[0].key, keyVal[0].value);
        } else if (input = (element.querySelector("input") || element.querySelector("input"))) { // if input field or textarea
            // } else if (input = (angular.element(element.querySelector("input")) || angular.element(element.querySelector("input")))) { // if input field or textarea
            input.attr(keyVal[1].key, keyVal[1].value);
        }
        this.compileHTML(input);
    }

    /**
     * when there is new attribute added, it needs to be compiled
     * @param  {} input
     */
    compileHTML(input) {
        // const $scope = input.scope();
        // const $injector = input.injector();
        // $injector.invoke(function ($compile) {
        //     $compile(input)($scope);
        // });
    }


    static UpdateFormObject() {
        StoreEvent({ eventName: 'formChanged', data: self.form });
    }
}
