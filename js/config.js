let math = false;

window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]],
        environments: {
            ampmatrix: ["\\left(\\begin{array}{ccc|c}", "\\end{array}\\right)"]
        },
        macros: {
            Adj: "\\operatorname{Adj}",
            arctan: "\\operatorname{arctg}",
            Bi: "\\operatorname{Bi}",
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
        },
        typeset: false
    }
};