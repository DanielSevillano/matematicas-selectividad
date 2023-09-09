export { obtenerExamen, mostrarExamen, obtenerCategoria, mostrarCategoria }

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
        const edicion = codigo.slice(-1)

        let texto = "Ejercicio " + letra + numeracion + ": "
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
        titulo.textContent = texto;
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

// Exámenes
async function obtenerExamen(examen) {
    const articulo = document.createElement("article");

    const titulo = document.createElement("h2");
    const codigo = String(examen);
    const curso = codigo.slice(0, 4);
    const edicion = codigo.slice(-1)

    let texto = "📋 ";
    if (edicion == 0) {
        if (curso == 2020) texto += "Julio de ";
        else texto += "Junio de ";
    }
    else if (edicion == 5) {
        if (curso >= 2021) texto += "Julio de ";
        else texto += "Septiembre de ";
    }
    else texto += "Reserva " + edicion + " de ";
    texto += curso;
    titulo.innerText = texto;

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);
    articulo.append(titulo);

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    for (let ejercicio = 1; ejercicio <= 8; ejercicio++) {
        const codigo = examen * 10 + ejercicio;
        const datosEjercicio = datos.find(dato => dato.ejercicio == codigo);

        let resuelto = false
        let categorias = []
        if (datosEjercicio != undefined) {
            if (datosEjercicio.resuelto) resuelto = true;
            categorias = datosEjercicio.categorias;
        }

        const seccion = await obtenerEjercicio(examen, ejercicio, resuelto, categorias);
        articulo.append(seccion);
    }

    return articulo
}

async function mostrarExamen(examen) {
    const main = document.querySelector("main");
    const carga = document.createElement("fluent-progress-ring");
    main.textContent = "";
    main.append(carga);

    const articulo = await obtenerExamen(examen);
    carga.remove();
    main.append(articulo);
    MathJax.typeset();
}

// Categorías
async function obtenerCategoria(categoria) {
    const articulo = document.createElement("article");

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    const ejercicios = datos.filter(ejercicio => ejercicio.categorias.map(c => normalizar(c)).includes(categoria));

    for (let ejercicio of ejercicios) {
        let resuelto = false
        let categorias = []
        if (ejercicio != undefined) {
            if (ejercicio.resuelto) resuelto = true;
            categorias = ejercicio.categorias;
        }

        const parrafo = await obtenerEjercicio(parseInt(ejercicio.ejercicio / 10), ejercicio.ejercicio % 10, resuelto, categorias, true);
        articulo.append(parrafo);
    };

    return articulo
}

async function mostrarCategoria(categoria) {
    const main = document.querySelector("main");
    const carga = document.createElement("fluent-progress-ring");
    main.textContent = "";
    main.append(carga);

    const articulo = await obtenerCategoria(categoria);
    carga.remove();
    main.append(articulo);
    MathJax.typeset();
}