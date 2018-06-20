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

export async function ProcessForm({ formContent, scripts }) {

    const url = GetUrlForFormCreator(formContent, true);

    const result = await Get({ url, urlPrefix: ROUTE_URL });

    if (result.success) {
        const { response } = result;
        const { client_scripts: scripts } = response;

        const params = {
            relationship: formContent.relationship,
            includesList: Object.keys(response.dictionary),
            dictionary: response.dictionary
        }
        formContent.dictionary = GetColumnsForListing(params, true);
        if (formContent.method == 'edit') {
            formContent.data = response.data;
        }

        if (Array.isArray(scripts)) {
            formContent = ExecuteScript({ formContent, scripts });
        }

        ModalManager.openModal({
            headerText: formContent.name,
            modalBody: () => (<FormCreator payload={formContent} />),
        });
    }
}
