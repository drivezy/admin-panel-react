
// 
// import { IsUndefinedOrNull } from './common.utils';


/**
 * Returns the columns for building tabs
 * @param  {id} menuId
 * @param  {function} callback
 */
// export function createFinalObject(columns, selectedColumns, relationship) {

//     var finalColumnDefinition = [];
//     var splitEnabled = false;

//     for (var i in selectedColumns) {
//         var selected = selectedColumns[i];
//         if (typeof (selected) == "object") {
//             var dict = columns[selected.column];
//             if (dict) {
//                 finalColumnDefinition[i] = dict;
//                 finalColumnDefinition[i].route = selected.route ? selected.route : false;
//                 finalColumnDefinition[i].display_name = selected.columnTitle ? selected.columnTitle : finalColumnDefinition[i].display_name;
//                 finalColumnDefinition[i].split = splitEnabled;
//                 if (selected.filter) {
//                     finalColumnDefinition[i].filter = selected.filter;
//                 }

//                 // var relationIndex                  = dict.parent.split('.');
//                 var relationIndex = dict.parent;
//                 if (!JSUtil.isUndefinedOrNull(relationship) && relationship.hasOwnProperty(relationIndex) && relationship[relationIndex].hasOwnProperty('related_model')) {
//                     finalColumnDefinition[i].reference_route = relationship[relationIndex].related_model.state_name;
//                 }
//             }
//         } else {
//             finalColumnDefinition[i] = {
//                 column_name: selected, column_type: null
//             };
//             splitEnabled = !splitEnabled;
//         }

//         // if it is a seperator
//         // Shubham please fix this
//         if (selected.column_name == "seperator") {
//             finalColumnDefinition[i] = selected;
//         }
//     }

//     return finalColumnDefinition;
// }
