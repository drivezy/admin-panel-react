// import React, { Component } from 'react';

// export class LoaderComponent extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isVisible: false
//         }
//     }

//     startLoader() {
//         this.setState({ isVisible: true });
//     }

//     endLoader() {
//         this.setState({ isVisible: false });
//     }

//     render() {
//         const { isVisible } = this.state;
//         return (
//             <span>
//                 {
//                     isVisible ?
//                         <div className='global-loader center-flex vertical-center'>
//                             {/* Loading ... */}

//                             {/* <!-- Loader 4 --> */}

//                             <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
//                                 viewBox="0 0 100 100" enableBackground="new 0 0 0 0">
//                                 <circle fill="green" stroke="none" cx="0" cy="50" r="10">
//                                     <animate
//                                         attributeName="opacity"
//                                         dur="1s"
//                                         values="0;1;0"
//                                         repeatCount="indefinite"
//                                         begin="0.1" />
//                                 </circle>
//                                 <circle fill="green" stroke="none" cx="25" cy="50" r="10">
//                                     <animate
//                                         attributeName="opacity"
//                                         dur="1s"
//                                         values="0;1;0"
//                                         repeatCount="indefinite"
//                                         begin="0.2" />
//                                 </circle>
//                                 <circle fill="green" stroke="none" cx="50" cy="50" r="10">
//                                     <animate
//                                         attributeName="opacity"
//                                         dur="1s"
//                                         values="0;1;0"
//                                         repeatCount="indefinite"
//                                         begin="0.3" />
//                                 </circle>
//                             </svg>
//                             {/* <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i> */}
//                             {/* <img className='drivezy-loader-gif' src={require('./../Assets/images/loader.gif')} /> */}
//                         </div>
//                         :
//                         null
//                 }
//             </span>
//         )
//     }
// }

// export class LoaderUtils {
//     _currentGlobalLoader = null;
//     static RegisterLoader(ref) {
//         this._currentGlobalLoader = ref;
//     }
//     static startLoader() {
//         if (this._currentGlobalLoader && this._currentGlobalLoader.startLoader) {
//             this._currentGlobalLoader.startLoader();
//         }
//     }

//     static endLoader() {
//         if(this._currentGlobalLoader) {
//             this._currentGlobalLoader.endLoader();
//         }
//     }
// }