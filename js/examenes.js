async function mostrarNavegacion() {
    const navegacion = document.querySelector("#navegacion-local");
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
            const botonEdicion = document.createElement("button");
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
                if (!this.classList.contains("acento")) {
                    mostrarExamen(examen.curso * 10 + edicion);

                    const botones = navegacion.getElementsByTagName("button");
                    for (let boton of botones) {
                        if (boton == this) boton.classList.add("acento");
                        else boton.classList.remove("acento");
                    }
                }
            });

            contenedor.append(botonEdicion);
            navegacionEdiciones.append(contenedor);
        });

        navegacionExamenes.append(navegacionEdiciones);
    })

    navegacion.append(navegacionExamenes);
    navegacion.querySelector("button").click();
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

    const boton = document.createElement("button");
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

        const opcionB = document.createElement("h3");
        opcionB.textContent = "⭐ Opción B";
        articulo.append(opcionB);

        for (let ejercicio = 5; ejercicio <= 8; ejercicio++) {
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

mostrarNavegacion();