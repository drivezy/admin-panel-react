/**
 * Collects object for Form, runs script(if any) in the context of form Obj
 * having name, data, dictionary, layout, actions
 * Finally renders form in modal
 */
import React from 'react';
import ModalManager from './../Wrappers/Modal-Wrapper/modalManager';
import FormCreator from './../Components/Form-Creator/formCreator.component';

import { ExecuteScript } from './injectScript.utils';

export function ProcessForm({ form, scripts }) {

    scripts = [{ id: 1, script: 'console.log(\'form\', form); FormUtils.PageName(\'Custom Name hello\', form)' }];

    if (Array.isArray(scripts)) {
        form = ExecuteScript({ form, scripts });
    }
    ModalManager.openModal({
        headerText: form.name,
        modalBody: () => (<FormCreator payload={form} />),
    });
}
