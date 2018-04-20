/**
 * Loads Stylesheets and scripts asynchronyously
 */
export default class LoadAsyncScripts {

    /**
     * loads stylessheet without blocking critical renders
     * @param  {string} src - url
     * @param  {string} rel - {default value - stylesheet}
     */
    static loadStyleSheet({ src, rel, attrs = {} }) {
        rel = rel ? rel : 'stylesheet';

        var cb = function () {
            var l = document.createElement('link');
            l.rel = rel;
            l.href = src;
            if (Object.keys(attrs).length) {
                for (const i in attrs) {
                    l.i = attrs[i];
                }
            }
            var h = document.getElementsByTagName('head')[0];
            h.parentNode.insertBefore(l, h);
        };
        var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        if (raf) raf(cb);
        else window.addEventListener('load', cb);
    }

    static loadStyleSheetGlobal(url) {
        const prefixUrl = './../Assets/Global-Shared/' + url;
        const cb = function () {
            // import(prefixUrl);
            import('./../Assets/Global-Shared/global.css');
        };

        const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        if (raf) raf(cb);
        else window.addEventListener('load', cb);
    }
}
