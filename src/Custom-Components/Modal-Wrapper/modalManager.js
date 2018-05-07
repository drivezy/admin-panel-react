
module.exports = {
    _currentGlobalLoader: null,
    registerModal: function (ref) {
        this._currentGlobalLoader = ref;
    },
    showModal: function ({ ...args }) {
        if (this._currentGlobalLoader) {
            this._currentGlobalLoader.openModal({ ...args });
            // this._currentGlobalLoader.openModal({ modalBody: () => (<h1> hi</h1>) });
        }
    },
    closeModal: function () {
        this._currentGlobalLoader.closeModal();
    }
}

// let _currentGlobalLoader = null;
// export default class ModalManager {
//     _currentGlobalLoader = null;
//     static registerModal(ref) {
//         const classContructor = new this;
//         classContructor._currentGlobalLoader = ref;
//         _currentGlobalLoader = ref;
//     }
//     static showModal({ ...args }) {
//         // const classContructor = new this;
//         // if (classContructor._currentGlobalLoader) {
//         //     classContructor._currentGlobalLoader.openModal({ ...args });
//         //     // this._currentGlobalLoader.openModal({ modalBody: () => (<h1> hi</h1>) });
//         // }
//         if (this._currentGlobalLoader) {
//             this._currentGlobalLoader.openModal({ ...args });
//         }
//     }
//     closeModal() {
//         const classContructor = new this;
//         classContructor._currentGlobalLoader.closeModal();
//     }
// }