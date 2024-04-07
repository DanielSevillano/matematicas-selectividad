import { mostrarTemario } from "./math.js";

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const seccion = parametros.get("seccion");

const main = document.querySelector("main");
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

function pulsar(boton) {
    const seccion = boton.id.replace("boton-", "");
    mostrarTemario(seccion);
    history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?seccion=" + seccion);

    botones.forEach(b => {
        if (boton == b) b.classList.add("seleccionado");
        else b.classList.remove("seleccionado");
    });
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) {
            if (!main.classList.contains("cargando")) pulsar(boton);
        }
    });
});

if (!seccion) document.querySelector(".grupo").click();
else {
    try {
        document.querySelector("#boton-" + seccion).click();
        if (["analisis", "funciones", "derivadas", "integrales"].includes(seccion)) document.querySelector("#grupo-analisis").click();
        else if (["algebra", "matrices", "sistemas", "determinantes"].includes(seccion)) document.querySelector("#grupo-algebra").click();
        else document.querySelector("#grupo-geometria").click();
    }
    catch {
        document.querySelector(".grupo").click();
    }
}