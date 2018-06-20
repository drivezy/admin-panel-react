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


    const url = GetUrlForFormCreator(form, true);

    const result = await Get({ url, urlPrefix: ROUTE_URL });

    if (result.success) {
        const { response } = result;

        const params = {
            relationship: form.relationship,
            includesList: Object.keys(response.dictionary),
            dictionary: response.dictionary
        }
        form.dictionary = GetColumnsForListing(params, true);
        if (form.method == 'edit') {
            form.data = response.data;
        }

    }

    scripts = [{
        id: 1,
        script: `

        // if(form.data['column_type_id'] == 5 || form.data['column_type_id'] == 6) {
        //     FormUtils.SetVisible('reference_model_id', true);
        // } else { 
        //     FormUtils.SetVisible('reference_model_id', false);
        // }

        // console.log(form.dictionary['reference_model_id'])
            
        // FormUtils.onChange({ column: 'menu.name', callback: (event, column)=> console.log(column) })

        FormUtils.onChange({ column: 'menu.name', callback: (event, column)=> console.log(column) })
        FormUtils.PageName('Custom Name hello')
        `
    }, {
        id: 2,
        script: `    
        // alert('dfbj');
        FormUtils.onChange({ column: 'reference_model_id', callback: (event, column)=> {
            const value = event.target.value;
            console.log('changed', value, form.data);
            
            if(value == 5 || value == 6) {
                FormUtils.SetVisible('reference_model_id', true);
            } else { 
                FormUtils.SetVisible('reference_model_id', false);
            }

            FormUtils.UpdateFormObject();
        } })

        `
    }];

    if (Array.isArray(scripts)) {
        form = ExecuteScript({ form, scripts });
    }



    ModalManager.openModal({
        headerText: form.name,
        modalBody: () => (<FormCreator payload={form} />),
    });
}
