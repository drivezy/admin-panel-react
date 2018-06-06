import { IsObjectHaveKeys } from './common.utils';
let self = {};

export default class FormUtil {

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
     * set element to visible or invisible depending on visibility
     * @param  {string} column
     * @param  {boolean} visibility
     */
    static SetVisible(column, visibility) {
        const formUtil = new FormUtil();
        var element = formUtil.GetElement(column);
        if (typeof element == "object") {
            if (visibility) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }
    };

    /**
     * returns ngModel value of the column type param
     * @param  {object} form - form object
     * @param  {string} column - column type
     */
    static GetValue(column) {
        if (typeof self.form == "object" && self.form.data[column]) {
            return self.form.data[column];
        }

        return false;
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
        // @todo remove this code after sometime
        // var element = self.getElement(column);
        // var input = angular.element(element.querySelector('select-field'));
        // if (JSUtil.returnTotalKeys(input)) { // if ui-select field
        //     // @TODO find a way to set value for ui-select
        // } // if input field or textarea
        // else if (input = (angular.element(element.querySelector('input')) ||
        // angular.element(element.querySelector('input')))) { angular.element(input).val(value).change(); // this
        // way angular model is updated }
    };

    /**
     * disables particular form element
     * @param  {string} column - column type
     * @param  {boolean} boolean -true if disabled, false if enabled
     */
    static SetDisabled(column, boolean) {
        const keyVal = [{
            key: "disable-flag", value: boolean // for input field or textarea
        }, {
            key: "ng-disabled", value: boolean // for ui-select field
        }];
        this.manupulateUI(column, keyVal);
    };

    /**
     * makes particular form element read only
     * @param  {string} column - column type
     */
    static SetReadOnly(column) {
        const keyVal = [{
            key: "ng-disabled", value: true // for ui-select field
        }, {
            key: "readonly", value: "readonly" // for input field or textarea
        }];
        this.manupulateUI(column, keyVal);
    };

    /**
     * adds extra attribute to element and make field required
     * @param  {string} column
     * @param  {boolean} boolean -true if disabled, false if enabled
     */
    static SetMandatory(column, boolean) {
        const keyVal = [{
            key: "required", value: boolean
        }, {
            key: "validate", value: boolean ? "required" : null // for ui-select field
        }];
        this.manupulateUI(column, keyVal);
    };

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
    static getSelectOnChangeUpdate(detail) {
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

    // /**
    //  * takes formElement and event to send scope's latest form object value for each ngModel or particular column
    //  * @param  {object} event
    //  * @param  {object} formElement
    //  * @param  {string} column
    //  */
    // static GetScopeValue(event, formElement, column) {
    //     if (!formElement) {
    //         return null;
    //     }
    //     formElement = angular.element(formElement);
    //     // formElement = angular.element(formElement);
    //     let data = formElement.serializeArray();
    //     if (event.detail) {
    //         const eventDetail = JSUtil.convertSerialArrayToJson([event.detail]);
    //     }

    //     data = JSUtil.convertSerialArrayToJson(data);
    //     if (event.detail) {
    //         data = Object.assign(data, eventDetail);
    //     }
    //     return getSelectedColumn(data, column);
    // };

    /**
     * returns form object value
     * @param  {string} column {optional} - comma seperated column value
     */
    // static GetFormValue(column) {
    //     const formUtil = new FormUtil();
    //     const formElement = formUtil.GetElement();
    //     if (!formElement) {
    //         return false;
    //     }

    //     let formObj = angular.element(formElement).scope().$parent.modalObj;

    //     if (typeof formObj == "object" && typeof formObj.formMetaObj == "object" && formObj.formMetaObj.hasOwnProperty("data")) {
    //         formObj = formObj.formMetaObj.data;

    //         return getSelectedColumn(formObj, column);
    //     }
    // };

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
        const formELement = formUtil.GetElement();
        // angular.element(formELement).scope().$parent.modalObj.submitForm(false);
    };

    /**
     * every time new script is to be run, this method is invoked to update form object value
     * @param  {object} form
     */
    static TakeFormValue(form) {
        self.form = form;
    };

    /**
     * returns form object(all ngModel value)
     * @param  {object} data
     * @param  {string} column {optional}
     */
    getSelectedColumn(data, column) {
        if (column) {
            const resultArr = {};
            const columnList = column.split(",");
            for (let j in columnList) {
                for (let i in data) {
                    if (i == columnList[j]) {
                        resultArr[i] = data[i];
                    }
                }
            }
            return resultArr;
        }
        return data;
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
}
