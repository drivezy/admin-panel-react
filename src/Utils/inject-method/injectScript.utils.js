import './injectScript.utils.css';
import $ from 'jquery';
/**
 * Executes script in the context of data
 * @param  {object} {data
 * @param  {array} script}
 */

export function ExecuteScript({ formContent, scripts, context, contextName = 'form' }) {
    if (!Array.isArray(scripts) || !scripts.length) {
        return formContent;
    }

    let script = '';

    for (let i in scripts) {
        script += PrefixScript(scripts[i]);
    }



    // methods({ formContent, context, contextName, script, scripts });
    methods.bind({ a: 'test' })({ formContent, context, contextName, script, scripts });
    // methods({ formContent, FormUtils });
    return formContent;
}

// @TODO change formContent name later as it was built for form execution but later being used in many place
function methods({ formContent, context, contextName, script, scripts }) {
    // function methods({ formContent, FormUtils: form }) {
    try {
        window[contextName] = context; // as value of 'this' is getting undefined, using window 
        window[contextName].setForm(formContent);
        eval(script);

        formContent = window[contextName].getForm(true);
        // window[contextName].updateForm();
        // delete window[contextName];
        RemoveError(scripts);
    } catch (err) {
        InjectError(scripts, err);
        console.log("%c🍺 Not valid Script", "color: #49ba8e; font-size:20px;");
        console.log("%cError =======> " + err, "color: '#49ba8e'; font-size:14px;");
        console.log("%cScript ======> " + scripts, "color: blue; font-size:14px;");
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
export function PrefixScript(definition) {
    if (definition.activity_type_id == 2) {
        return `form.onChange({ column: '${definition.column}', callback: (event, column)=> { ${definition.script}} })`;
    }
    return definition.script;


}

