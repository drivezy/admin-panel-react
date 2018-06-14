
/**
 * Executes script in the context of data
 * @param  {object} {data
 * @param  {array} script}
 */
import FormUtils from './form.utils';

export function ExecuteScript({ form, scripts }) {
    if (!Array.isArray(scripts) || !scripts.length) {
        return form;
    }

    const methods = {};

    for (let i in scripts) {
        methods[scripts[i].id] = function ({ form, FormUtils }) {
            // if (!extraParam || (typeof extraParam == "object" && (!extraParam.trigger_type || extraParam.trigger_type.indexOf(scripts[i].trigger_type) > -1)) && scripts[i].active) {
            try {
                FormUtils.SetFormValue(form);
                // @todo once we get support for column name to be watched from db will enable this way
                // if (extraParam.trigger_type == 363) {
                //     FormUtil.onChange(onChange, column);

                //     function onChange(newVal, oldVal){
                //         eval(scripts[i].script);
                //     }
                // } else {
                //     eval(scripts[i].script);
                // }
                eval(scripts[i].script);
                form = FormUtils.GetFormValue(true);
                RemoveError(scripts[i]);
            } catch (err) {
                InjectError(scripts[i], err);
                console.log("%c🍺 Not valid Script", "color: #49ba8e; font-size:20px;");
                console.log("%cError =======> " + err, "color: '#49ba8e'; font-size:14px;");
                console.log("%cScript ======> " + scripts[i].script, "color: blue; font-size:14px;");
                // console.log(scripts[i].name + ' - ' + err);
            }
            // }
        };
        // return methods[scripts[0].name];
        methods[scripts[i].id]({ form, FormUtils });
    }

    return form;
}

/**
* appends error message if found any error while executing scripts
* @param  {object} script
* @param  {string} message - text message to be displayed
*/
export function InjectError(script, message) {
    var pageContent = document.getElementById('app-container'); // main page element
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
 * removes error message element
 * @param  {} script
 */
export function RemoveError(script) {
    var pageContent = document.getElementById('app-container');
    var errorElemenet = document.getElementById("script-" + script.id);
    if (errorElemenet) {
        pageContent.removeChild(errorElemenet);
    }
};