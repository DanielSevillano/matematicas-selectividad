export { estado, formatear, obtenerEjercicio, mostrarExamen, mostrarCategoria, mostrarTemario }

const estado = new Object({
    cancelado: false,
    reanudar: function () {
        this.cancelado = false;
    },
    cancelar: function () {
        this.cancelado = true;
    }
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

function tituloExamen(examen) {
    const codigo = String(examen);
    const curso = codigo.slice(0, 4);
    const edicion = codigo.slice(-1);

    let titulo = "";
    if (edicion == 0) {
        if (curso == 2020) titulo += "Julio";
        else titulo += "Junio";
    }
    else if (edicion == 5) {
        if (curso >= 2021) titulo += "Julio";
        else titulo += "Septiembre";
    }
    else titulo += "Reserva " + edicion;
    titulo += " de " + curso;

    return titulo;
}

function formatear(elemento) {
    if (math) MathJax.typeset([elemento]);
    else setTimeout(() => formatear(elemento));
}

async function obtenerEjercicio(examen, ejercicio, resuelto = false, categorias = [], tituloCompleto = false) {
    const articulo = document.createElement("article");
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
        titulo.textContent = "Ejercicio " + letra + numeracion + ": ";

        const enlace = document.createElement("a");
        enlace.textContent = tituloExamen(examen);
        enlace.href = "/examenes-ciencias.html?examen=" + examen;

        titulo.append(enlace);
    } else titulo.textContent = "Ejercicio " + letra + numeracion;

    articulo.append(titulo);

    const contenedorCategorias = document.createElement("ul");
    contenedorCategorias.classList.add("categorias");
    categorias.forEach(categoria => {
        const elementoCategoria = document.createElement("li");
        const enlaceCategoria = document.createElement("a");
        enlaceCategoria.textContent = categoria;
        enlaceCategoria.href = "/ejercicios-ciencias.html?categoria=" + normalizar(categoria);
        enlaceCategoria.classList.add("contorno");
        elementoCategoria.append(enlaceCategoria);
        contenedorCategorias.append(elementoCategoria);
    })
    articulo.append(contenedorCategorias);

    const curso = String(examen).slice(0, 4);
    const ruta = "data\\ciencias\\" + curso + "\\" + examen + ejercicio + ".txt";

    const respuesta = await fetch(ruta);
    const datos = await respuesta.text();

    parrafo.innerHTML = datos;

    if (resuelto) {
        const contenedorResolucion = document.createElement("details");
        const tituloResolucion = document.createElement("summary");
        const textoResolucion = document.createElement("div");

        tituloResolucion.textContent = "Resolución";

        const ruta = "data\\ciencias\\" + curso + "\\R" + examen + ejercicio + ".txt";
        const respuesta = await fetch(ruta);
        const datos = await respuesta.text();

        textoResolucion.innerHTML = datos;

        contenedorResolucion.append(tituloResolucion, textoResolucion);
        parrafo.append(contenedorResolucion);
    }

    articulo.append(parrafo);

    return articulo;
}

async function obtenerExamen(examen) {
    const main = document.querySelector("main");

    const titulo = document.createElement("h2");
    titulo.innerText = "📋 " + tituloExamen(examen);

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.classList.add("cargando");
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    main.append(titulo);

    const respuesta = await fetch("data\\ciencias\\metadata.json");
    const datos = await respuesta.json();

    for (let ejercicio = 1; ejercicio <= 8; ejercicio++) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        const codigo = examen * 10 + ejercicio;
        const datosEjercicio = datos.find(dato => dato.ejercicio == codigo);

        let resuelto = false;
        let categorias = [];
        if (datosEjercicio != undefined) {
            if (datosEjercicio.resuelto) resuelto = true;
            categorias = datosEjercicio.categorias;
        }

        boton.style.setProperty("--progreso", ejercicio / 8 * 100);

        const seccion = await obtenerEjercicio(examen, ejercicio, resuelto, categorias);
        main.append(seccion);
        formatear(seccion);
    }

    boton.disabled = false;
    boton.classList.remove("cargando");

    return true;
}

async function mostrarExamen(examen) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerExamen(examen).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}

async function obtenerCategoria(categoria, soloResueltos, contador) {
    const main = document.querySelector("main");

    const respuesta = await fetch("data\\ciencias\\metadata.json");
    const datos = await respuesta.json();

    let ejercicios = datos.filter(ejercicio => ejercicio.categorias.map(c => normalizar(c)).includes(categoria));
    if (soloResueltos) ejercicios = ejercicios.filter(ejercicio => ejercicio.resuelto);
    contador.textContent = ejercicios.length;

    for (let ejercicio of ejercicios) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        let resuelto = false
        let categorias = []
        if (ejercicio != undefined) {
            if (ejercicio.resuelto) resuelto = true;
            categorias = ejercicio.categorias;
        }

        const parrafo = await obtenerEjercicio(parseInt(ejercicio.ejercicio / 10), ejercicio.ejercicio % 10, resuelto, categorias, true);
        main.append(parrafo);
        formatear(parrafo);
    };

    return true;
}

async function mostrarCategoria(categoria, soloResueltos = false, contador) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerCategoria(categoria, soloResueltos, contador).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}

async function obtenerTemario(seccion) {
    const main = document.querySelector("main");

    const respuesta = await fetch("data\\ciencias\\temario\\" + seccion + ".txt");
    const datos = await respuesta.text();

    const articulo = document.createElement("article");
    articulo.innerHTML = datos;
    main.append(articulo);
    formatear(articulo);

    return true;
}

async function mostrarTemario(seccion) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerTemario(seccion).then(() => {
        main.classList.remove("cargando");
    });
}