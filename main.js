window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]],
    },
};

async function mostrarNavegacion() {
    const navegacion = document.querySelector("nav");

    const respuesta = await fetch("data\\index.json");
    const datos = await respuesta.json();

    datos.forEach(examen => {
        examen.ediciones.forEach(edicion => {
            let texto = "";
            if (edicion == 0) texto += "Junio de ";
            else if (edicion == 5) texto += "Septiembre de ";
            else texto += "Reserva " + edicion + " de ";
            texto += examen.curso;

            const boton = document.createElement("button");
            boton.textContent = texto;
            boton.addEventListener("click", function () {
                mostrarExamen(examen.curso * 10 + edicion);
            })
            navegacion.append(boton);
        })
    });
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

    let texto = "";
    if (edicion == 0) texto += "Junio de ";
    else if (edicion == 5) texto += "Septiembre de ";
    else texto += "Reserva " + edicion + " de ";
    texto += curso;
    titulo.innerText = texto;

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", function () {
        window.print()
    });
    titulo.append(boton);
    articulo.append(titulo);

    const lista = document.createElement("ol");
    for (let i = 1; i <= 8; i++) {
        const elemento = document.createElement("li");
        const parrafo = await obtenerEjercicio(examen, i);
        elemento.append(parrafo);
        lista.append(elemento);
    }
    articulo.append(lista);

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
    main.textContent = "";
    main.classList.add("cargando");

    const articulo = await obtenerExamen(examen);
    main.classList.remove("cargando");
    main.append(articulo);
    MathJax.typeset();
}

mostrarNavegacion();
mostrarExamen(20230);