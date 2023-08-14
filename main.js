async function mostrarNavegacionExamenes() {
    const navegacion = document.querySelector("nav");
    const navegacionExamenes = document.createElement("fluent-tabs");

    const respuesta = await fetch("data\\index.json");
    const datos = await respuesta.json();

    datos.forEach(examen => {
        const seccionCurso = document.createElement("fluent-tab");
        seccionCurso.textContent = examen.curso;
        navegacionExamenes.append(seccionCurso);

        const navegacionEdiciones = document.createElement("fluent-tab-panel");
        const contenedor = document.createElement("div");

        examen.ediciones.forEach(edicion => {
            const botonEdicion = document.createElement("fluent-button");
            let texto = "";
            if (edicion == 0) {
                if (examen.curso == 2020) texto += "Julio";
                else texto += "Junio";
            }
            else if (edicion == 5) {
                if (examen.curso >= 2021) texto += "Julio";
                else texto += "Septiembre";
            }
            else texto += "Reserva " + edicion;
            botonEdicion.textContent = texto;

            botonEdicion.addEventListener("click", function () {
                if (this.appearance == "neutral") {
                    mostrarExamen(examen.curso * 10 + edicion);

                    const botones = navegacion.getElementsByTagName("fluent-button");
                    for (let boton of botones) {
                        if (boton == this) boton.appearance = "accent";
                        else boton.appearance = "neutral";
                    }
                }
            });

            contenedor.append(botonEdicion);
            navegacionEdiciones.append(contenedor);
        });

        navegacionExamenes.append(navegacionEdiciones);
    })

    navegacion.append(navegacionExamenes);
    navegacion.querySelector("fluent-button").click();
}

async function mostrarNavegacionEjercicios() {
    const navegacion = document.querySelector("nav");
    const navegacionEjercicios = document.createElement("fluent-tabs");

    const respuesta = await fetch("data\\tags.json");
    const datos = await respuesta.json();

    datos.forEach(bloque => {
        const seccionBloque = document.createElement("fluent-tab");
        seccionBloque.textContent = bloque.bloque;
        navegacionEjercicios.append(seccionBloque);

        const navegacionCategorias = document.createElement("fluent-tab-panel");
        const contenedor = document.createElement("div");

        bloque.categorias.forEach(categoria => {
            const botonCategoria = document.createElement("fluent-button");
            botonCategoria.textContent = categoria;

            botonCategoria.addEventListener("click", function () {
                if (this.appearance == "neutral") {
                    mostrarCategoria(categoria);

                    const botones = navegacion.getElementsByTagName("fluent-button");
                    for (let boton of botones) {
                        if (boton == this) boton.appearance = "accent";
                        else boton.appearance = "neutral";
                    }
                }
            });

            contenedor.append(botonCategoria);
            navegacionCategorias.append(contenedor);
        });

        navegacionEjercicios.append(navegacionCategorias);
    });

    navegacion.append(navegacionEjercicios);
    navegacion.querySelector("fluent-button").click();
}

async function obtenerEjercicio(examen, ejercicio, resuelto = false, categorias = []) {
    const seccion = document.createElement("section");
    const titulo = document.createElement("h4");
    const parrafo = document.createElement("p");

    let numeracion = ejercicio;
    if (examen < 20200 && ejercicio >= 5) numeracion = ejercicio - 4;
    titulo.textContent = "Ejercicio " + numeracion;
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

    const boton = document.createElement("fluent-button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);
    articulo.append(titulo);

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    if (examen >= 20200) {
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
    } else {
        const opcionA = document.createElement("h3");
        opcionA.textContent = "⭐ Opción A";
        articulo.append(opcionA);

        for (let ejercicio = 1; ejercicio <= 4; ejercicio++) {
            const seccion = await obtenerEjercicio(examen, ejercicio);
            articulo.append(seccion);
        }

        const opcionB = document.createElement("h3");
        opcionB.textContent = "⭐ Opción B";
        articulo.append(opcionB);

        for (let ejercicio = 5; ejercicio <= 8; ejercicio++) {
            const seccion = await obtenerEjercicio(examen, ejercicio);
            articulo.append(seccion);
        }
    }

    return articulo
}

async function obtenerCategoria(categoria) {
    const articulo = document.createElement("article");

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    const ejercicios = datos.filter(ejercicio => ejercicio.categorias.includes(categoria));

    for (let ejercicio of ejercicios) {
        const parrafo = await obtenerEjercicio(parseInt(ejercicio.ejercicio / 10), ejercicio.ejercicio % 10);
        articulo.append(parrafo);
    };

    return articulo
}

async function mostrarExamen(examen) {
    const main = document.querySelector("main");
    const carga = document.createElement("fluent-progress-ring");
    main.textContent = "";
    main.append(carga);

    const articulo = await obtenerExamen(examen);
    main.textContent = "";
    main.append(articulo);
    MathJax.typeset();
}

async function mostrarCategoria(categoria) {
    const main = document.querySelector("main");
    const carga = document.createElement("fluent-progress-ring");
    main.textContent = "";
    main.append(carga);

    const articulo = await obtenerCategoria(categoria);
    main.textContent = "";
    main.append(articulo);
    MathJax.typeset();
}

mostrarNavegacionExamenes();