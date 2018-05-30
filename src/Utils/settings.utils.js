
import React, { Component } from 'react';

import ModalManager from './../Wrappers/Modal-Wrapper/modalManager';
// import ModalManager from './../../Wrappers/Modal-Wrapper/modalManager';
import ConfigureSettings from './../Components/Configure-Settings/configureSettings.component';

export default class SettingsUtil {
    _currentGlobalLoader = null;

    static registerModal(ref) {
        this._currentGlobalLoader = ref;
    }

    static openSpotlightModal() {
        if (this._currentGlobalLoader && this._currentGlobalLoader.openModal) {
            this._currentGlobalLoader.openSpotlightModal();
        }
    }

    static configureModal() {
        const ConfigureSettings1 = new ConfigureSettings();
        ModalManager.openModal({
            headerText: "Settings",
            modalBody: () => (<ConfigureSettings />),
            modalFooter: ConfigureSettings1.footer
        })
    }
}