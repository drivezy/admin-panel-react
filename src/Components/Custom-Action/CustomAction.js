import React, { Component } from 'react';
import './CustomAction.css';

let method = {};
let customMethods = {};

export default class CustomAction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actions: props.actions
        };


    }

    componentDidMount = () => {
        const { actions } = this.state
        this.registerMethod(actions);
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


    callFunction(action, listing) {
        console.log(action, listing);
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
            // action.callback = action.callback ? (typeof customMethods[action.callback] == "function" ? customMethods[action.callback] : listing.callbackFunction.function) : listing.callbackFunction.function;
            // if (typeof methods[action.name] == "function") {
            //     methods[action.name](action, listing);
            // }
        }
    }


    render() {
        const { actions = [], listingContent = [] } = this.props;
        return (
            <td className="custom-action">
                {
                    actions.map((action, key) => (
                        <button onClick={() => { this.callFunction(action, listingContent) }} type="button" key={key} className={`fas ${action.icon}`}></button>
                    ))
                }
            </td>
        )
    }
}