import { Location } from './location.utils';
import { SetItem, GetItem } from './localStorage.utils';

let currentState = { ...window.location };

export function PreserveState() {
    const location = window.location;


    if (currentState.pathname != location.pathname) {
        currentState = location;
        const search = GetItem(location.pathname);
        SetItem(currentState.pathname, currentState.search);
        if (search) {
            Location.navigate({ method: 'replace', url: location.pathname + search });
        }
    } else {
        currentState = { ...window.location };
        SetItem(currentState.pathname, currentState.search);
    }

}