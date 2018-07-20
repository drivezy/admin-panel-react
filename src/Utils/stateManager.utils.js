// /*******************************************************************************************************************
//  * Utility method that Manages state, persist api response and notify back by callback method provided as param 
//  * Also based on Internet connectivity, can save api call which require less attention and invoke them later 
//  * Supports app working even when device is not connected any network
//  ******************************************************************************************************************/
// import { SetItem, SetNonVolatileItem, GetItem } from 'drivezy-web-utils/build/Utils';
// import { IsEqualObject } from './common.utils';

// /**
//  * Store contains list of all events and apis which is having data and can be subscribed
//  * Store Object will have eventName as key which would be api incase of api call persistence otherwise an event name.
//  * against each eventName there would be an object having data and
//  * objParams(optional). objParams are used in case of api call to make sure that
//  * data is returned for same set of params.
//  * format=>  {[eventName]: {data: ANY, objParams: {}}};
//  */
// const Store = {};
// const MemoryStore = GetItem('memoryStore') || {}; // memory store would ba as same as Store except that is would store its data in asynStorage 

// /**
//  * SubscribedEvent will store all events which is currently being subscribed and
//  * actively looking into the same
//  * format=>  {[eventName]: [ {callback: fn(), extraParams: {}, objParams: {}} ]}
//  */
// const SubscibedEvent = {};
// const SubscribedStoreEvent = {};

// /**
//  * Stores the status of the alerts
//  */
// let alertVisible = false;
// let alertView = undefined;

// export function StoreEvent({ eventName, data, objParams, isMemoryStore }) {
//     new Promise((resolve, reject) => {
//         if (!isMemoryStore) {
//             Store[eventName] = { data, objParams };
//         } else {
//             MemoryStore[eventName] = { data, objParams };
//             SetItem('memoryStore', MemoryStore);
//         }
//         TransmitToAllEvent({ eventName, data, isMemoryStore });
//     });
// }

// export function DeleteEvent({ eventName, isMemoryStore }) {
//     if (!isMemoryStore) {
//         delete Store[eventName];
//     } else {
//         delete MemoryStore[eventName];
//         SetItem('memoryStore', MemoryStore);
//     }
// }

// export function SubscribeToEvent({ eventName, callback, extraParams, objParams, isMemoryStore }) {
//     new Promise(resolve => {
//         const events = (!isMemoryStore ? SubscibedEvent[eventName] : SubscribedStoreEvent[eventName]) || [];
//         // events.push({ callback, extraParams, objParams, isMemoryStore });

//         const index = IsAlreadySubscribed({ events, callback, objParams });
//         if (index === false) { // makes sure against duplicate event subscription
//             events.push({ callback, extraParams, objParams, isMemoryStore });
//         } else {
//             events[index] = { callback, extraParams, objParams, isMemoryStore };
//         }

//         if (!isMemoryStore) {
//             SubscibedEvent[eventName] = events;
//         } else {
//             SubscribedStoreEvent[eventName] = events;
//         }
//         // alert('efe');
//         TransmitToSingleEvent({ eventName, isMemoryStore, callback, extraParams });
//     });
// }

// export function TransmitToAllEvent({ eventName, data, isMemoryStore }) {
//     let eventDetail, subscribedEvent;
//     if (!isMemoryStore) {
//         eventDetail = Store[eventName]; // array of subscribed event for particular event name
//         subscribedEvent = SubscibedEvent[eventName];
//     } else {
//         let eventsAvailableInStore = GetItem('memoryStore') || {};
//         eventDetail = eventsAvailableInStore[eventName]; // array of subscribed event for particular event name
//         subscribedEvent = SubscribedStoreEvent[eventName];
//     }
//     if (!Array.isArray(subscribedEvent) || !eventDetail) {
//         return;
//     }
//     subscribedEvent.forEach(event => {
//         if (IsEqualObject(event.objParams, eventDetail.objParams) && event.callback) {
//             event.callback(data || eventDetail.data, { eventName, extraParams: event.extraParams });
//         }
//     });
// }

// export function TransmitToSingleEvent({ eventName, isMemoryStore, callback, extraParams }) {
//     let eventDetail;
//     if (!isMemoryStore) {
//         eventDetail = Store[eventName];
//     } else {
//         let eventsAvailableInStore = GetItem('memoryStore') || {};
//         eventDetail = eventsAvailableInStore[eventName]; // array of subscribed event for particular event name
//     }

//     if (!eventDetail) {
//         return;
//     }
//     callback(eventDetail.data, { eventName, extraParams })

// }

// export function IsEventAvailable({ eventName, isMemoryStore, objParams }) {
//     let eventsAvailableInStore;
//     if (!isMemoryStore) {
//         eventsAvailableInStore = Store;
//     } else {
//         eventsAvailableInStore = GetItem('memoryStore') || {};
//     }
//     const eventDetail = eventsAvailableInStore[eventName];
//     if (eventDetail && IsEqualObject(eventDetail.objParams, objParams)) {
//         return true;
//     }
//     return false;
// }

// export function UnsubscribeEvent({ eventName, callback, isMemoryStore, objParams = {} }) {
//     const events = (!isMemoryStore ? SubscibedEvent[eventName] : SubscribedStoreEvent[eventName]) || [];
//     // events.push({ callback, extraParams, objParams, isMemoryStore });
//     const index = IsAlreadySubscribed({ events, callback, objParams });
//     if (index != false) {
//         events.splice(index, -1);
//     }
//     if (!isMemoryStore) {
//         SubscibedEvent[eventName] = events;
//     } else {
//         SubscribedStoreEvent[eventName] = events;
//     }
// }

// function IsAlreadySubscribed({ events, callback, objParams }) {
//     if (!(Array.isArray(events) && events.length)) {
//         return false;
//     }
//     for (const i in events) {
//         const event = events[i];
//         if (event.callback == callback && IsEqualObject(event.objParams, objParams)) {
//             // if (Function.prototype.toString(event.callback) == Function.prototype.toString(callback) && IsEqualObject(event.objParams, objParams)) {
//             return i;
//         }
//     }
//     return false;
// }

