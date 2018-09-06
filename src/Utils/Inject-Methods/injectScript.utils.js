import './injectScript.utils.css';
import $ from 'jquery';

import SCRIPT_TYPE from './../../Constants/scriptType.constants';
import { IsUndefined } from 'common-js-util';

/**
 * Executes script in the context of data
 * @param  {object} {data
 * @param  {array} script}
 */

export function ExecuteScript({ formContent, scripts, context, contextName = 'form', executionType }) {
    if (!Array.isArray(scripts) || !scripts.length) {
        return formContent;
    }

    let script = '';

    for (let i in scripts) {
        script = `${script}
        ${PrefixScript(scripts[i], executionType)}`;
    }



    // methods({ formContent, context, contextName, script, scripts });
    methods.bind({ a: 'test' })({ formContent, context, contextName, script, scripts, executionType });
    // methods({ formContent, FormUtils });
    return formContent;
}

// @TODO change formContent name later as it was built for form execution but later being used in many place
function methods({ formContent, context, contextName, script, scripts, executionType }) {
    // function methods({ formContent, FormUtils: form }) {
    try {
        window[contextName] = context; // as value of 'this' is getting undefined, using window 
        if (SCRIPT_TYPE.ON_SUBMIT != executionType) {
            window[contextName].setForm(formContent);
        }
        eval(script);

        formContent = window[contextName].getForm(true);
        // window[contextName].updateForm();
        // delete window[contextName];
        RemoveError(scripts);
    } catch (err) {
        InjectError(scripts, err);
        console.log("%c🍺 Not valid Script", "color: #49ba8e; font-size:20px;");
        console.log("%cError =======> ", "color: '#49ba8e'; font-size:14px;");
        console.error(err);
        console.log("%cScript ======> ", "color: blue; font-size:14px;");
        console.log(scripts);
        // console.log(scripts[i].name + ' - ' + err);
    }
};

/**
* appends error message if found any error while executing scripts
* @param  {object} script
* @param  {string} message - text message to be displayed
*/
export function InjectError(script, message) {
    var pageContent = document.getElementById('parent-admin-element'); // main page element
    var errorElemenet = document.createElement("div"); // new error element to be injected at top
    errorElemenet.classList.add("alert");
    errorElemenet.classList.add("alert-danger");
    errorElemenet.setAttribute("id", "script-" + script.id);
    errorElemenet.innerHTML = "<strong> " + script.name + " - " + message + " </strong>";

    var crossSymbol = document.createElement("a");
    crossSymbol.classList.add("close");
    crossSymbol.innerHTML = "&times;";
    errorElemenet.appendChild(crossSymbol);

    pageContent.insertBefore(errorElemenet, pageContent.firstChild);
};

/**
* appends error message if found any error while executing scripts
* @param  {object} script
* @param  {string} message - text message to be displayed
*/
export function InjectMessage(message, type, time = 4000) {
    var pageContent = document.getElementById('parent-admin-element'); // main page element
    var errorElemenet = document.createElement("div"); // new error element to be injected at top
    errorElemenet.classList.add("alert");
    if (type === "success") {
        errorElemenet.classList.add("alert-success");
    }
    if (type === "error") {
        errorElemenet.classList.add("alert-danger");
    }
    if (type === "info") {
        errorElemenet.classList.add("alert-info");
    }
    if (type === "warning") {
        errorElemenet.classList.add("alert-warning");
    }
    errorElemenet.innerHTML = "<strong>" + message + " </strong>";

    window.setTimeout(function () {
        $(".alert").fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, time);

    pageContent.insertBefore(errorElemenet, pageContent.firstChild);
};

/**
 * removes error message element
 * @param  {} script
 */
export function RemoveError(script) {
    var pageContent = document.getElementById('parent-admin-element');
    var errorElemenet = document.getElementById("script-" + script.id);
    if (errorElemenet) {
        pageContent.removeChild(errorElemenet);
    }
};

// Prepare script for execution according to script type
export function PrefixScript(definition, executionType) {
    if (definition.activity_type_id == SCRIPT_TYPE.ON_CHANGE) {
        return `form.onChange({ column: '${definition.column}', callback: (value, column, event)=> { ${definition.script}} })`;
    }
    if (IsUndefined(executionType) || executionType == definition.activity_type_id) {
        return definition.script;
    }

    return '';

}

