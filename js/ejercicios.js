const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const categoria = parametros.get("categoria");

const grupos = document.querySelectorAll(".grupo");
const contenidoGrupos = document.querySelectorAll(".contenido-grupo");
const botones = document.querySelectorAll(".contorno");

grupos.forEach((grupo, indice) => {
    grupo.addEventListener("click", () => {
        grupos.forEach(g => {
            if (grupo == g) g.classList.add("seleccionado");
            else g.classList.remove("seleccionado");
        });

        contenidoGrupos.forEach((contenido, i) => {
            if (indice == i) contenido.classList.add("visible");
            else contenido.classList.remove("visible");
        });
    });
});

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) {
            const categoria = boton.id.replace("boton-", "");
            mostrarCategoria(categoria);
            history.pushState(history.state, document.title, direccion.origin + direccion.pathname + "?categoria=" + categoria);

            botones.forEach(b => {
                if (boton == b) b.classList.add("seleccionado");
                else b.classList.remove("seleccionado");
            });
        }
    });
});

if (!categoria) document.querySelector(".grupo").click();
else {
    try {
        document.querySelector("#boton-" + categoria).click();
        if (["analisis", "funciones", "optimizacion", "integrales", "limites", "teorema-fundamental-del-calculo"].includes(categoria)) document.querySelector("#grupo-analisis").click();
        else if (["algebra", "matrices", "sistemas", "determinantes", "ecuaciones-matriciales", "problemas"].includes(categoria)) document.querySelector("#grupo-algebra").click();
        else document.querySelector("#grupo-geometria").click();
    }
    catch {
        document.querySelector(".grupo").click();
    }
}

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
    main.textContent = "";
    main.classList.add("cargando");

    const articulo = await obtenerCategoria(categoria);
    main.classList.remove("cargando");
    main.append(articulo);
    MathJax.typeset();
}