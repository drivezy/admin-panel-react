import React, { Component } from 'react';

export default function asyncComponent(importComponent) {

    class AsyncComponent extends Component {

        constructor(props) {
            super(props);

            this.state = {
                component: null,
            };
        }

        async componentDidMount() {
            const { default: component } = await import(`./../Scenes/${importComponent}.js`);

            this.setState({
                component: component
            });
        }

        render() {
            const C = this.state.component;

            return C
                ? <C {...this.props} />
                : null;
        }

    }

    return AsyncComponent;
}


// export default class Dynamic extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { module: null };
//     }
//     componentDidMount() {
//         const { path } = this.props;
//         import(`./../../Scenes${path}`)
//             .then(module => this.setState({ module: module.default }))
//     }
//     render() {
//         const { module: component } = this.state; // Assigning to new variable names @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
//         return (
//             <div>
//                 {component && <component {...this.props}/>}
//             </div>
//         )
//     }
// }


// ƒ () {
    // return __webpack_require__(/*! . */ "./src/Components/Landing lazy recursive ^.*\\.js$")(path + '.js');
// }