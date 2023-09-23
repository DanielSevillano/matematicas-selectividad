import { estado, mostrarCategoria } from "./math.js";

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const categoria = parametros.get("categoria");

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
    if (!estado.cancelado) {
        const categoria = boton.id.replace("boton-", "");
        mostrarCategoria(categoria);
        history.pushState(history.state, document.title, direccion.origin + direccion.pathname + "?categoria=" + categoria);

        botones.forEach(b => {
            if (boton == b) b.classList.add("seleccionado");
            else b.classList.remove("seleccionado");
        });
    }
    else setTimeout(() => pulsar(boton));
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) {
            if (main.classList.contains("cargando")) estado.cancelar();
            pulsar(boton);
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