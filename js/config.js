let math = false;

window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]],
        environments: {
            ampmatrix: ["\\left(\\begin{array}{ccc|c}", "\\end{array}\\right)"],
            vproduct: ["\\begin{vmatrix}\\vec{x} & \\vec{y} & \\vec{z} \\\\", "\\end{vmatrix}"]
        },
        macros: {
            Adj: "\\operatorname{Adj}",
            arcsin: "\\operatorname{arcsen}",
            arctan: "\\operatorname{arctg}",
            Bi: "\\operatorname{Bi}",
            dist: "\\operatorname{dist}",
            Dom: "\\operatorname{Dom}",
            lim: "\\mathop{\\,\\:\\mathrm{lím}\\,\\:}",
            rang: "\\operatorname{rang}",
            sin: "\\operatorname{sen}",
            tan: "\\operatorname{tg}"
        }
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
    output: {
        displayOverflow: "scroll"
    },
    startup: {
        ready: () => {
            MathJax.startup.defaultReady();
            MathJax.startup.promise.then(() => math = true);
        },
        typeset: false
    }
};