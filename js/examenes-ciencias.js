import { obtenerExamen } from "./math.js";

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const examen = parametros.get("examen");

const main = document.querySelector("main");
const grupos = document.querySelectorAll(".grupo");
const contenidoGrupos = document.querySelectorAll(".contenido-grupo");
const botones = document.querySelectorAll(".contorno");
const botonAleatorio = document.querySelector("#aleatorio");

let metadatos;
const guardarMetadatos = datos => { metadatos = datos; };

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
    const examen = boton.id.replace("boton-", "");
    obtenerExamen("ciencias", examen, metadatos, guardarMetadatos);
    history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?examen=" + examen);

    botones.forEach(b => {
        if (boton == b) b.classList.add("seleccionado");
        else b.classList.remove("seleccionado");
    });
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) pulsar(boton);
    });
});

botonAleatorio.addEventListener("click", () => {
    const boton = botones[Math.floor(Math.random() * botones.length)];
    const curso = boton.id.replace("boton-", "").slice(0, 4);
    boton.click();
    document.querySelector("#grupo-" + curso).click();
});

if (!examen) document.querySelector(".grupo").click();
else {
    const curso = examen.slice(0, 4);
    try {
        document.querySelector("#boton-" + examen).click();
        document.querySelector("#grupo-" + curso).click();
    }
    catch {
        document.querySelector(".grupo").click();
    }
}