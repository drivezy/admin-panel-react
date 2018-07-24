
module.exports = {
    _currentGlobalLoader: null,
    registerModal: function (ref) {
        this._currentGlobalLoader = ref;
    },
    openModal: function ({ ...args }) {
        if (this._currentGlobalLoader) {
            this._currentGlobalLoader.openModal({ ...args });
        }
    },
    closeModal: function ({ ...args }) {
        this._currentGlobalLoader.closeModal({ ...args });
    }
    
}