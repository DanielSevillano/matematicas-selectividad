async function mostrarNavegacion() {
    const navegacion = document.querySelector("#navegacion-local");
    const navegacionEjercicios = document.createElement("fluent-tabs");

    const respuesta = await fetch("data\\tags.json");
    const datos = await respuesta.json();

    datos.forEach(bloque => {
        const seccionBloque = document.createElement("fluent-tab");
        seccionBloque.textContent = bloque.bloque;
        navegacionEjercicios.append(seccionBloque);

        const navegacionCategorias = document.createElement("fluent-tab-panel");
        const contenedor = document.createElement("div");

        const botonTodos = document.createElement("button");
        botonTodos.textContent = "Todos";

        botonTodos.addEventListener("click", function () {
            if (!this.classList.contains("acento")) {
                mostrarCategoria(bloque.bloque);

                const botones = navegacion.getElementsByTagName("button");
                for (let boton of botones) {
                    if (boton == this) boton.classList.add("acento");
                    else boton.classList.remove("acento");
                }
            }
        });

        contenedor.append(botonTodos);

        bloque.categorias.forEach(categoria => {
            const botonCategoria = document.createElement("button");
            botonCategoria.textContent = categoria;

            botonCategoria.addEventListener("click", function () {
                if (!this.classList.contains("acento")) {
                    mostrarCategoria(categoria);

                    const botones = navegacion.getElementsByTagName("button");
                    for (let boton of botones) {
                        if (boton == this) boton.classList.add("acento");
                        else boton.classList.remove("acento");
                    }
                }
            });

            contenedor.append(botonCategoria);
            navegacionCategorias.append(contenedor);
        });

        navegacionEjercicios.append(navegacionCategorias);
    });

    navegacion.append(navegacionEjercicios);
    navegacion.querySelector("button").click();
}

async function obtenerCategoria(categoria) {
    const articulo = document.createElement("article");

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    const ejercicios = datos.filter(ejercicio => ejercicio.categorias.includes(categoria));

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

mostrarNavegacion();