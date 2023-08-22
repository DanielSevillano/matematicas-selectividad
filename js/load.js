const scriptMathJax = document.createElement("script");
scriptMathJax.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";

const ruta = window.location.pathname;
const scriptMain = document.createElement("script");
if (ruta.includes("ejercicios")) scriptMain.src = "js\\ejercicios.js";
else scriptMain.src = "js\\examenes.js";
scriptMain.async = false;

scriptMain.addEventListener("load", function () {
    document.head.append(scriptMathJax);

    window.MathJax = {
        tex: {
            inlineMath: [["$", "$"]],
        },
    };
});

async function obtenerEjercicio(examen, ejercicio, resuelto = false, categorias = [], tituloCompleto = false) {
    const seccion = document.createElement("section");
    const titulo = document.createElement("h4");
    const parrafo = document.createElement("p");

    let numeracion = ejercicio;
    if (examen < 20200 && ejercicio >= 5) numeracion = ejercicio - 4;
    if (tituloCompleto) {
        const codigo = String(examen);
        const curso = codigo.slice(0, 4);
        const edicion = codigo.slice(-1)

        let texto = "Ejercicio " + numeracion + ": "
        if (edicion == 0) {
            if (curso == 2020) texto += "julio";
            else texto += "junio";
        }
        else if (edicion == 5) {
            if (curso >= 2021) texto += "julio";
            else texto += "septiembre";
        }
        else texto += "reserva " + edicion;
        texto += " de " + curso;
        if (examen < 20200) {
            if (ejercicio == numeracion) texto += ", opción A";
            else texto += ", opción B";
        }
        titulo.textContent = texto;
    } else titulo.textContent = "Ejercicio " + numeracion;


    seccion.append(titulo);

    const contenedorCategorias = document.createElement("ul");
    categorias.forEach(categoria => {
        const elementoCategoria = document.createElement("li");
        const enlaceCategoria = document.createElement("fluent-anchor");
        enlaceCategoria.textContent = categoria;
        enlaceCategoria.appearance = "outline";
        elementoCategoria.append(enlaceCategoria);
        contenedorCategorias.append(elementoCategoria);
    })
    seccion.append(contenedorCategorias);

    const curso = String(examen).slice(0, 4);
    const ruta = "data\\" + curso + "\\" + examen + ejercicio + ".txt";

    const respuesta = await fetch(ruta);
    const datos = await respuesta.text();

    parrafo.innerHTML = datos;

    if (resuelto) {
        const contenedorResolucion = document.createElement("fluent-accordion");
        const resolucion = document.createElement("fluent-accordion-item");
        const tituloResolucion = document.createElement("span");
        const textoResolucion = document.createElement("div");

        tituloResolucion.textContent = "Resolución";
        tituloResolucion.slot = "heading";

        const ruta = "data\\" + curso + "\\R" + examen + ejercicio + ".txt";
        const respuesta = await fetch(ruta);
        const datos = await respuesta.text();

        textoResolucion.innerHTML = datos;

        resolucion.append(tituloResolucion);
        resolucion.append(textoResolucion);
        contenedorResolucion.append(resolucion);
        parrafo.append(contenedorResolucion);
    }

    seccion.append(parrafo);

    return seccion
}

document.head.append(scriptMain);