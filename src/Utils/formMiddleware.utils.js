/**
 * Collects object for Form, runs script(if any) in the context of form Obj
 * having name, data, dictionary, layout, actions
 * Finally renders form in modal
 */
import React from 'react';
import ModalManager from './../Wrappers/Modal-Wrapper/modalManager';
import FormCreator from './../Components/Form-Creator/formCreator.component';

import { GetUrlForFormCreator, GetColumnsForListing } from './generic.utils';
import { ExecuteScript } from './injectScript.utils';
import { Get } from './http.utils';

import { ROUTE_URL } from './../Constants/global.constants';

export async function ProcessForm({ form, scripts }) {

    scripts = [{
        id: 1,
        script: `
        console.log('form', form);
        FormUtils.onChange({ column: 'menu.name', callback: (event, column)=> console.log(column) })
        FormUtils.PageName('Custom Name hello')
        `
    }];

    if (Array.isArray(scripts)) {
        form = ExecuteScript({ form, scripts });
    }

    const url = GetUrlForFormCreator(form, true);

    const result = await Get({ url, urlPrefix: ROUTE_URL });


    if (result.success) {
        const { response } = result;

        const params = {
            relationship: form.relationship,
            includesList: Object.keys(response.dictionary),
            dictionary: response.dictionary
        }
        form.dictionary = GetColumnsForListing(params);
        if (form.method == 'edit') {
            form.data = response.data;
        }

    }

    ModalManager.openModal({
        headerText: form.name,
        modalBody: () => (<FormCreator payload={form} />),
    });
}
