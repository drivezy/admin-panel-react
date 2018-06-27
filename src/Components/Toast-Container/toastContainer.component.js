/**
 * conponent for showing notification according to three method {success,error,warning}within icon;
 * import library:
 * @atlaskit/flag=library use for flag and flaggroup;
 */

import React, { Component } from 'react';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Warning from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';
import Flag, { FlagGroup } from '@atlaskit/flag';

const getIcon = (key) => {
    return iconMap(key);
};

/** method for showing icon in one of three situation */
const iconMap = (key, color) => {
    const icons = {
        success: <Tick label="Success icon" primaryColor={color || colors.G300} />,
        warning: (
            <Warning label="Warning icon" primaryColor={color || colors.Y300} />
        ),
        error: <Error label="Error icon" primaryColor={color || colors.R300} />,
    };

    return key ? icons[key] : icons;
};

export default class Toastcontainer extends Component {

    constructor() {
        super();

        this.state = {
            flags: []
        }
    }

    /** method for dismiss the notification */
    dismissFlag = () => {
        this.setState(state => ({ flags: state.flags.slice(1) }));
    };

    /** end method */
    addFlag = (flags, params) => {
        flags.unshift(params);
        this.setState({ flags: flags });
    };

    /**
      * Shows success notification
      * @param  {Object} params={}
      */
    success = (params) => {
        const flags = this.state.flags;
        params.icon = 'success';
        this.addFlag(flags, params);
    };

    /**
       * Shows error notification
       * @param  {Object} params={}
       */
    error = (params) => {
        const flags = this.state.flags;
        params.icon = 'error';
        this.addFlag(flags, params);
    };

    /**
       * Shows warn notification
       * @param  {Object} params={}
       */
    warn = (params) => {
        const flags = this.state.flags;
        params.icon = 'warning';
        this.addFlag(flags, params);
    };

    render() {
        /** showing notification content */
        return (
            <div>
                <FlagGroup onDismissed={this.dismissFlag}>
                    {this.state.flags.map((flag, key) => <Flag key={key} actions={flag.actions} title={flag.title} description={flag.description} icon={getIcon(flag.icon)} />)}
                </FlagGroup>
            </div>
        );
    }
}