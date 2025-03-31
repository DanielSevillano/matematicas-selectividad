let math = false;

window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]]
    },
    options: {
        enableMenu: false,
        menuOptions: {
            settings: {
                braille: false,
                speech: false,
                enrich: false
            }
        }
    },
    startup: {
        ready: () => {
            MathJax.startup.defaultReady();
            MathJax.startup.promise.then(() => math = true);
        }
    }
};