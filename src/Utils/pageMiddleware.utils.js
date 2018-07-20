import Pageutil from './page.utils';

import { ExecuteScript } from './inject-method/injectScript.utils';

export function ProcessPage({ pageContent }) {
    const scripts = [pageContent.execution_script];

    ExecuteScript({ formContent: pageContent, scripts, context: Pageutil, contextName: 'page' });
}