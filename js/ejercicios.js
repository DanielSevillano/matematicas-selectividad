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

        const botonTodos = document.createElement("fluent-button");
        botonTodos.textContent = "Todos";

        botonTodos.addEventListener("click", function () {
            if (this.appearance == "neutral") {
                mostrarCategoria(bloque.bloque);

                const botones = navegacion.getElementsByTagName("fluent-button");
                for (let boton of botones) {
                    if (boton == this) boton.appearance = "accent";
                    else boton.appearance = "neutral";
                }
            }
        });

        contenedor.append(botonTodos);

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

async function obtenerCategoria(categoria) {
    const articulo = document.createElement("article");

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    const ejercicios = datos.filter(ejercicio => ejercicio.categorias.includes(categoria));

    for (let ejercicio of ejercicios) {
        let resuelto = false
        if (ejercicio != undefined && ejercicio.resuelto) resuelto = true;

        const parrafo = await obtenerEjercicio(parseInt(ejercicio.ejercicio / 10), ejercicio.ejercicio % 10, resuelto, [], true);
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