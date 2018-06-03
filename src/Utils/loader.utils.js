import React, { Component } from 'react';
import { SSL_OP_NO_QUERY_MTU } from 'constants';

export class LoaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        }
    }

    startLoader() {
        this.setState({ isVisible: true });
    }

    endLoader() {
        this.setState({ isVisible: false });
    }

    render() {
        const { isVisible } = this.state;
        return (
            <span>
                {
                    isVisible ?
                        <div className='global-loader center-flex vertical-center'>
                            {/* Loading ... */}
                            <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i>
                            {/* <img className='drivezy-loader-gif' src={require('./../Assets/images/loader.gif')} /> */}
                        </div>
                        :
                        null
                }
            </span>
        )
    }
}

export class LoaderUtils {
    _currentGlobalLoader = null;
    static RegisterLoader(ref) {
        this._currentGlobalLoader = ref;
    }
    static startLoader() {
        if (this._currentGlobalLoader && this._currentGlobalLoader.startLoader) {
            this._currentGlobalLoader.startLoader();
        }
    }

    static endLoader() {
        this._currentGlobalLoader.endLoader();
    }
}