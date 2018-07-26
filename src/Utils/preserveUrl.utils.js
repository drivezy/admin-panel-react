// /**
//  * Preserves url on route change, and load with same search string on next time load
//  * 
//  * for e.g. if current state is http://localhost:3000/completedBookings?search=user_id%20%3D%202327 
//  * and route is changed, next time whenever completed booking will be opened will have same url
//  */

// import { Location } from 'drivezy-web-utils/build/Utils';
// import { SetItem, GetItem } from 'storage-utility'

// let currentState = { ...window.location };

// export function PreserveState() {
//     const location = window.location;

//     if (currentState.pathname != location.pathname) { // if current state is changed
//         currentState =  { ...window.location }; // set new url as current state
//         const search = GetItem(location.pathname); // fetch search string for new url to append on url bar
//         SetItem(currentState.pathname, currentState.search);
//         if (search) {
//             Location.navigate({ method: 'replace', url: location.pathname + search });
//         }
//     } else {
//         currentState = { ...window.location };
//         SetItem(currentState.pathname, currentState.search);
//     }

// }