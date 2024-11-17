let math = false;

window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]]
    },
    options: {
        enableMenu: false,
        enableEnrichment: false,
        enableExplorer: false
    },
    startup: {
        ready: () => {
            MathJax.startup.defaultReady();
            MathJax.startup.promise.then(() => math = true);
        }
    }
};