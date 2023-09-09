const scriptMathJax = document.createElement("script");
scriptMathJax.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";

const ruta = window.location.pathname;
const scriptMain = document.createElement("script");
if (ruta.includes("ejercicios")) scriptMain.src = "js/ejercicios.js";
else scriptMain.src = "js/examenes.js";
scriptMain.async = false;
scriptMain.type = "module";

scriptMain.addEventListener("load", function () {
    document.head.append(scriptMathJax);

    window.MathJax = {
        tex: {
            inlineMath: [["$", "$"]]
        },
        svg: {
            fontCache: 'global'
        }
    };
});

document.head.append(scriptMain);