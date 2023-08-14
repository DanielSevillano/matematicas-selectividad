const scriptMathJax = document.createElement("script");
scriptMathJax.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";

const scriptMain = document.createElement("script");
scriptMain.src = "main.js";
scriptMain.async = false;

scriptMain.addEventListener("load", function () {
    document.head.append(scriptMathJax);

    window.MathJax = {
        tex: {
            inlineMath: [["$", "$"]],
        },
    };
});

document.head.append(scriptMain);