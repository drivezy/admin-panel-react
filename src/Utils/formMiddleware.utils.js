/**
 * Collects object for Form, runs script(if any) in the context of form Obj
 * having name, data, dictionary, layout, actions
 * Finally renders form in modal
 */
import React from 'react';
import ModalManager from './../Wrappers/Modal-Wrapper/modalManager';
import FormCreator from './../Components/Form-Creator/formCreator.component';

import FormUtils from './form.utils';
import { GetUrlForFormCreator, GetColumnsForListing, GetParsedLayoutScript, ParseRestrictedQuery } from './generic.utils';
import { ExecuteScript } from './injectScript.utils';
import { Get } from './http.utils';

import { ROUTE_URL, RECORD_URL } from './../Constants/global.constants';


export async function ProcessForm({ formContent, scripts, isForm, openModal = true }) {

    const url = GetUrlForFormCreator({ payload: formContent, getDictionary: true, isForm });
    console.log(url, ROUTE_URL);
    const result = await Get({ url, urlPrefix: isForm ? RECORD_URL : ROUTE_URL });

    if (result.success) {
        const { response } = result;
        const { client_scripts: scripts } = response;

        formContent.scripts = scripts;

        const params = {
            relationship: formContent.relationship,
            includesList: Object.keys(response.dictionary),
            dictionary: response.dictionary
        }
        formContent.dictionary = GetColumnsForListing(params, true);
        if (formContent.method == 'edit') {
            formContent.data = response.data;
        }

        if (isForm) {
            formContent.route = response.form.end_point;
            formContent.layout = [];
            const layouts = GetParsedLayoutScript(response.form_layouts);
            if (layouts[0] && layouts[0].column_definition) {
                formContent.layout = layouts[0];
            }
            formContent.layouts = layouts; //layouts
            formContent.record = formContent.data;
            formContent.data = GetDataFromDictionary(formContent.dictionary);
            formContent.modelId = response.form.id;
        }

        if (Array.isArray(scripts)) {
            formContent = ExecuteScript({ formContent, scripts, context: FormUtils, contextName: 'form' });
        }

        const restrictedQuery = ParseRestrictedQuery(formContent.menu.restricted_query);
        for (let i in restrictedQuery) {
            formContent = FormUtils.setDisabled(i, true, formContent);
        }
        formContent.data = { ...formContent.data, ...restrictedQuery };

        if (openModal) {
            ModalManager.openModal({
                headerText: formContent.name,
                modalBody: () => (<FormCreator payload={formContent} />),
            });
        }

    }
}

function GetDataFromDictionary(dictionary) {
    const obj = {};
    for (let i in dictionary) {
        const column = dictionary[i];
        if (column) {
            obj[column.name] = null;
        }
    }

    return obj;
}
