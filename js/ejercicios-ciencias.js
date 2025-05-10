import { obtenerCategoria } from "./math.js";

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const categoria = parametros.get("categoria");

const main = document.querySelector("main");
const grupos = document.querySelectorAll(".grupo");
const contenidoGrupos = document.querySelectorAll(".contenido-grupo");
const botones = document.querySelectorAll(".contorno");
const botonAleatorio = document.querySelector("#aleatorio");
const cinta = document.querySelector("#cinta");
const casilla = cinta.querySelector("#casilla");
const contador = cinta.querySelector("#contador");

let categoriaSeleccionada;
let soloResueltos = casilla.checked;

let metadatos;
const guardarMetadatos = datos => { metadatos = datos; };

const categoriasAlgebra = ["algebra", "potencias", "determinantes", "rango", "ecuaciones-matriciales", "sistemas", "discusion-de-sistemas", "problemas"];
const categoriasGeometria = ["geometria", "vectores", "posicion-relativa", "punto-simetrico", "distancia", "angulos", "area", "volumen"];
const categoriasProbabilidad = ["probabilidad", "probabilidad-total", "distribucion-binomial", "distribucion-normal"];

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
    const categoria = boton.id.replace("boton-", "");
    categoriaSeleccionada = categoria;
    cinta.classList.remove("oculto");
    history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?categoria=" + categoria);

    botones.forEach(b => {
        if (boton == b) b.classList.add("seleccionado");
        else b.classList.remove("seleccionado");
    });

    obtenerCategoria("ciencias", categoria, metadatos, contador, soloResueltos, guardarMetadatos);
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) pulsar(boton);
    });
});

botonAleatorio.addEventListener("click", () => {
    const boton = botones[Math.floor(Math.random() * botones.length)];
    const categoria = boton.id.replace("boton-", "");
    boton.click();
    if (categoriasAlgebra.includes(categoria)) document.querySelector("#grupo-algebra").click();
    else if (categoriasGeometria.includes(categoria)) document.querySelector("#grupo-geometria").click();
    else if (categoriasProbabilidad.includes(categoria)) document.querySelector("#grupo-probabilidad").click();
    else document.querySelector(".grupo").click();
});

casilla.addEventListener("click", () => {
    soloResueltos = casilla.checked;
    if (soloResueltos) {
        main.classList.add("resueltos");
        contador.textContent = main.querySelectorAll(".resuelto").length;
    }
    else {
        main.classList.remove("resueltos");
        contador.textContent = main.querySelectorAll("article").length;
    }
});

if (!categoria) document.querySelector(".grupo").click();
else {
    try {
        document.querySelector("#boton-" + categoria).click();
        if (categoriasAlgebra.includes(categoria)) document.querySelector("#grupo-algebra").click();
        else if (categoriasGeometria.includes(categoria)) document.querySelector("#grupo-geometria").click();
        else if (categoriasProbabilidad.includes(categoria)) document.querySelector("#grupo-probabilidad").click();
        else document.querySelector(".grupo").click();
    }
    catch {
        document.querySelector(".grupo").click();
    }
}