
/**
 * Executes script in the context of data
 * @param  {object} {data
 * @param  {array} script}
 */
import FormUtils from './form.utils';

export function ExecuteScript({ formContent, scripts }) {
    if (!Array.isArray(scripts) || !scripts.length) {
        return formContent;
    }


    // const methods = {};

    let script = '';

    for (let i in scripts) {
        script += PrefixScript(scripts[i]);
    }

    function methods({ formContent, FormUtils: form }) {
        // if (!extraParam || (typeof extraParam == "object" && (!extraParam.trigger_type || extraParam.trigger_type.indexOf(scripts[i].trigger_type) > -1)) && scripts[i].active) {
        try {
            form.setForm(formContent);
            // @todo once we get support for column name to be watched from db will enable this way
            // if (extraParam.trigger_type == 363) {
            //     FormUtil.onChange(onChange, column);

            //     function onChange(newVal, oldVal){
            //         eval(scripts[i].script);
            //     }
            // } else {
            //     eval(scripts[i].script);
            // }
            // eval(scripts[i].script);

            // const s = PrefixScript(script);
            // console.log(s);
            eval(script);

            formContent = form.getForm(true);
            RemoveError(scripts);
        } catch (err) {
            InjectError(scripts, err);
            console.log("%c🍺 Not valid Script", "color: #49ba8e; font-size:20px;");
            console.log("%cError =======> " + err, "color: '#49ba8e'; font-size:14px;");
            console.log("%cScript ======> " + scripts, "color: blue; font-size:14px;");
            // console.log(scripts[i].name + ' - ' + err);
        }
        // }
    };
    // return methods[scripts[0].name];
    methods({ formContent, FormUtils });

    // const methods = {};

    // for (let i in scripts) {
    //     methods[i] = function ({ formContent, FormUtils: form }) {
    //         // if (!extraParam || (typeof extraParam == "object" && (!extraParam.trigger_type || extraParam.trigger_type.indexOf(scripts[i].trigger_type) > -1)) && scripts[i].active) {
    //         try {
    //             form.setForm(formContent);
    //             // @todo once we get support for column name to be watched from db will enable this way
    //             // if (extraParam.trigger_type == 363) {
    //             //     FormUtil.onChange(onChange, column);

    //             //     function onChange(newVal, oldVal){
    //             //         eval(scripts[i].script);
    //             //     }
    //             // } else {
    //             //     eval(scripts[i].script);
    //             // }
    //             // eval(scripts[i].script);

    //             const s = PrefixScript(scripts[i]);
    //             console.log(s);
    //             eval(s);

    //             formContent = form.getForm(true);
    //             RemoveError(scripts[i]);
    //         } catch (err) {
    //             InjectError(scripts[i], err);
    //             console.log("%c🍺 Not valid Script", "color: #49ba8e; font-size:20px;");
    //             console.log("%cError =======> " + err, "color: '#49ba8e'; font-size:14px;");
    //             console.log("%cScript ======> " + scripts[i].script, "color: blue; font-size:14px;");
    //             // console.log(scripts[i].name + ' - ' + err);
    //         }
    //         // }
    //     };
    //     // return methods[scripts[0].name];
    //     methods[i]({ formContent, FormUtils });
    // }

    return formContent;
}

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
    if (definition.activity_type_id == 1) {
        return definition.script;
    } else if (definition.activity_type_id == 2) {
        return `form.onChange({ column: '${definition.column}', callback: (event, column)=> { ${definition.script}} })`;
    }
}

