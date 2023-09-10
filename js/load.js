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

function normalizar(texto) {
    let procesado = texto.toLowerCase();
    procesado = procesado.replaceAll("á", "a");
    procesado = procesado.replaceAll("é", "e");
    procesado = procesado.replaceAll("í", "i");
    procesado = procesado.replaceAll("ó", "o");
    procesado = procesado.replaceAll("ú", "u");
    procesado = procesado.replaceAll(" ", "-");
    return procesado;
}

async function obtenerEjercicio(examen, ejercicio, resuelto = false, categorias = [], tituloCompleto = false) {
    const seccion = document.createElement("section");
    const titulo = document.createElement("h3");
    const parrafo = document.createElement("p");

    let numeracion = ejercicio;
    let letra = "";
    if (examen < 20200) {
        if (ejercicio <= 4) letra = "A";
        else {
            numeracion = ejercicio - 4;
            letra = "B"

        }
    }
    if (tituloCompleto) {
        const codigo = String(examen);
        const curso = codigo.slice(0, 4);
        const edicion = codigo.slice(-1);

        titulo.textContent = "Ejercicio " + letra + numeracion + ": ";

        const enlace = document.createElement("a");
        let texto = ""
        if (edicion == 0) {
            if (curso == 2020) texto += "Julio";
            else texto += "Junio";
        }
        else if (edicion == 5) {
            if (curso >= 2021) texto += "Julio";
            else texto += "Septiembre";
        }
        else texto += "Reserva " + edicion;
        texto += " de " + curso;
        enlace.textContent = texto;
        enlace.href = "/examenes.html?examen=" + codigo;

        titulo.append(enlace);
    } else titulo.textContent = "Ejercicio " + letra + numeracion;

    seccion.append(titulo);

    const contenedorCategorias = document.createElement("ul");
    categorias.forEach(categoria => {
        const elementoCategoria = document.createElement("li");
        const enlaceCategoria = document.createElement("a");
        enlaceCategoria.textContent = categoria;
        enlaceCategoria.href = "/ejercicios.html?categoria=" + normalizar(categoria);
        enlaceCategoria.classList.add("contorno");
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
        const contenedorResolucion = document.createElement("details");
        const tituloResolucion = document.createElement("summary");
        const textoResolucion = document.createElement("div");

        tituloResolucion.textContent = "Resolución";

        const ruta = "data\\" + curso + "\\R" + examen + ejercicio + ".txt";
        const respuesta = await fetch(ruta);
        const datos = await respuesta.text();

        textoResolucion.innerHTML = datos;

        contenedorResolucion.append(tituloResolucion, textoResolucion);
        parrafo.append(contenedorResolucion);
    }

    seccion.append(parrafo);

    return seccion
}

document.head.append(scriptMain);