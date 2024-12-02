let math = false;

window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]],
        macros: {
            Adj: "\\operatorname{Adj}",
            arctan: "\\operatorname{arctg}",
            dist: "\\operatorname{dist}",
            Dom: "\\operatorname{Dom}",
            rang: "\\operatorname{rang}",
            sin: "\\operatorname{sen}",
            tan: "\\operatorname{tg}"
        }
    },
    options: {
        enableMenu: false
    },
    startup: {
        ready: () => {
            MathJax.startup.defaultReady();
            MathJax.startup.promise.then(() => math = true);
        }
    }
};