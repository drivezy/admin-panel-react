import React, { Component } from 'react';
import './CustomAction.css';

import { CreateUrl } from './../../Utils/generic.utils';
import { IsUndefinedOrNull } from './../../Utils/common.utils';
import { Delete } from './../../Utils/http.utils';
import ToastNotifications from './../../Utils/toast.utils';

import FormCreator from './../Form-Creator/formCreator.component';

import ModalManager from './../../Custom-Components/Modal-Wrapper/modalManager';

let customMethods = {};

let self = {};
export default class CustomAction extends Component {
    methods = {};
    constructor(props) {
        super(props);

        self = this;
        this.state = {
            actions: props.actions,
            genericData: props.genericData
        };
    }

    componentDidMount = () => {
        const { actions } = this.state
        this.registerMethod(actions);
        this.preSelectedMethods();
    }

    preSelectedMethods() {
        this.methods.redirect = ({ action, listingRow }) => {
            const { history, genericData } = this.props;

            var url = CreateUrl({ url: action.parameter, obj: listingRow });
            // var urlParams;
            // var userQuery = 0;

            function createQueryUrl(url, restrictQuery, genericData) {

                var query = '';
                var orderMethod;

                // If query is present 
                // we add it ,
                // else we check if there is a filter in the url , 
                // then append the respective filter query 
                // if (urlParams.query) {
                //     query += urlParams.query;
                // } else {
                //     if (urlParams.filter) {
                //         var filter = this.props.genericData.userFilter.filter(function (userFilter) {
                //             return userFilter.id == urlParams.filter;
                //         })[0];

                //         query += filter.filter_query;
                //     }
                // }

                if (restrictQuery) {
                    if (query) {
                        query += restrictQuery;
                    } else {
                        query += restrictQuery.split('and ')[1];
                    }
                }

                if (query) {
                    query = '?redirectQuery=' + query;
                    orderMethod = '&';
                } else {
                    orderMethod = '?';
                }
                // if (urlParams.order) {
                //     url += query + orderMethod + "listingOrder=" + urlParams.order + ',' + (urlParams.sort || 'desc');
                // } else if (this.props.genericData.defaultOrder) {
                //     url += query + orderMethod + "listingOrder=" + this.props.genericData.defaultOrder;
                // } else {
                //     url += query;
                // }

                return url;
            }
            url = createQueryUrl(url, genericData.restrictQuery, genericData);

            history.push(url);
            // if (angular.isDefined(event)) {
            //     if (event.metaKey || event.ctrlKey) {
            //         window.open("#/" + url, "_blank");
            //     } else {
            // $location.url(url);
            // location.hash = "#/" + url;
            //     }
            // }
        };

        this.methods.add = ({ action, listingRow }) => {
            const { genericData = {} } = this.props;
            const payload = { action, listingRow, columns: genericData.columns, formPreference: genericData.formPreference, modelName: genericData.modelName, module: genericData.module, dataModel: genericData.dataModel };
            ModalManager.openModal({ payload, headerText: 'Add modal', modalBody: () => (<FormCreator payload={payload} />) });
        }

        this.methods.edit = ({ action, listingRow }) => {
            const { genericData = {} } = this.props;
            const payload = { method: 'edit', action, listingRow, columns: genericData.columns, formPreference: genericData.formPreference, modelName: genericData.modelName, module: genericData.module, dataModel: genericData.dataModel };
            ModalManager.openModal({ payload, headerText: 'Edit modal', modalBody: () => (<FormCreator payload={payload} />) });
        }

        this.methods.delete = async ({ action, listingRow }) => {
            ToastNotifications.success('Records has been deleted');
            const { genericData } = this.props;
            const deletekey = IsUndefinedOrNull(action.redirectValueName) ? listingRow.id : listingRow[action.redirectValueName];
            console.log(deletekey, genericData);
            if (window.confirm('Are you sure you want to delete this record?')) {
                const result = await Delete({ url: `${genericData.module}/${deletekey}` });
                if (result.success) {
                    action.callback();
                    ToastNotifications.success('Records has been deleted');
                }
            }
        }
    }


    // Register all the methods coming from db
    registerMethod(method) {
        for (var i in method) {
            var methodObj = method[i];
            if (methodObj.definition && typeof methodObj.definition == 'object' && methodObj.definition.script) {
                if (methodObj.dependency) {
                    customMethods[methodObj.name] = new Function("obj", "callback", methodObj.dependency, methodObj.definition.script);
                } else {
                    customMethods[methodObj.name] = new Function("obj", "callback", methodObj.definition.script);
                }
            }
        }
    }


    callFunction = ({ action, listingRow }) => {
        const args = [];
        if (typeof customMethods[action.name] == "function") {
            // var callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : customMethods[action.callback]) : listing.callbackFunction.function;
            // // var args = convertDependencyInjectionToArgs(action.dependency);
            // args.reverse();
            // args.push(callback);
            // action.placement_id == 167 ? args.push(listing) : args.push("");
            // args.reverse();

            customMethods[action.name].apply(this, args);
        } else { // For add, edit,delete
            const callback = this.props.callback;
            action.callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : callback) : callback;
            if (typeof this.methods[action.name] == "function") {
                this.methods[action.name]({ action, listingRow });
            }
        }
    }

    render() {
        const { actions = [], listingRow = [], genericData = {}, placement } = this.props;
        return (
            <div>
                {
                    actions.map((action, key) => {
                        if (action.placement_id == placement) {
                            return (
                                <button
                                    onClick={() => {
                                        this.callFunction({ action, listingRow });
                                    }}
                                    type="button" key={key} className="btn btn-sm btn-light">
                                    <i className={`fa ${action.icon}`} ></i>
                                </button>
                            );
                        }
                    })
                }
            </div>
        )
    }
}