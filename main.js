window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]],
    },
};

async function mostrarNavegacion() {
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
            if (edicion == 0) texto += "Junio";
            else if (edicion == 5) texto += "Septiembre";
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

async function obtenerEjercicio(examen, ejercicio) {
    const parrafo = document.createElement("p");

    const curso = String(examen).slice(0, 4);
    const ruta = "data\\" + curso + "\\" + examen + ejercicio + ".txt";

    const respuesta = await fetch(ruta);
    const datos = await respuesta.text();

    parrafo.innerHTML = datos;
    return parrafo
}

async function obtenerExamen(examen) {
    const articulo = document.createElement("article");

    const titulo = document.createElement("h2");
    const codigo = String(examen);
    const curso = codigo.slice(0, 4);
    const edicion = codigo.slice(-1)

    let texto = "📋 ";
    if (edicion == 0) texto += "Junio de ";
    else if (edicion == 5) texto += "Septiembre de ";
    else texto += "Reserva " + edicion + " de ";
    texto += curso;
    titulo.innerText = texto;

    const boton = document.createElement("fluent-button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);
    articulo.append(titulo);

    if (examen >= 20200) {
        const lista = document.createElement("ol");
        for (let i = 1; i <= 8; i++) {
            const elemento = document.createElement("li");
            const parrafo = await obtenerEjercicio(examen, i);
            elemento.append(parrafo);
            lista.append(elemento);
        }

        articulo.append(lista);
    } else {
        const opcionA = document.createElement("h3");
        opcionA.textContent = "Opción A";
        articulo.append(opcionA);

        const listaA = document.createElement("ol");
        for (let i = 1; i <= 4; i++) {
            const elemento = document.createElement("li");
            const parrafo = await obtenerEjercicio(examen, i);
            elemento.append(parrafo);
            listaA.append(elemento);
        }
        articulo.append(listaA);

        const opcionB = document.createElement("h3");
        opcionB.textContent = "Opción B";
        articulo.append(opcionB);

        const listaB = document.createElement("ol");
        for (let i = 5; i <= 8; i++) {
            const elemento = document.createElement("li");
            const parrafo = await obtenerEjercicio(examen, i);
            elemento.append(parrafo);
            listaB.append(elemento);

            articulo.append(listaB);
        }
    }

    return articulo
}

async function mostrarEjercicio(examen, ejercicio) {
    const main = document.querySelector("main");

    const parrafo = await obtenerEjercicio(examen, ejercicio);
    main.append(parrafo);
    MathJax.typeset();
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

mostrarNavegacion();