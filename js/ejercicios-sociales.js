import { estado, mostrarCategoria } from "./math.js";

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

let categoriaSeleccionada;
let soloResueltos = casilla.checked;

let metadatos;
let mapaEjercicios = new Map();
const guardarMetadatos = datos => { metadatos = datos };

const categoriasProgramacionLineal = ["programacion-lineal", "problemas-de-optimizacion"];
const categoriasAlgebra = ["algebra", "dimensiones", "potencias", "ecuaciones-matriciales", "sistemas-de-ecuaciones-matriciales", "problemas-de-matrices", "sistemas-de-ecuaciones", "problemas-de-sistemas"];
const categoriasEstadistica = ["probabilidad", "problemas-de-sucesos", "estadistica", "muestreo", "estimacion-de-la-media", "estimacion-de-la-proporcion", "distribucion-de-medias-muestrales", "contraste-de-hipotesis"];

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
        categoriaSeleccionada = categoria;
        cinta.classList.remove("oculto");
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?categoria=" + categoria);

        botones.forEach(b => {
            if (boton == b) b.classList.add("seleccionado");
            else b.classList.remove("seleccionado");
        });

        mostrarCategoria("sociales", categoria, metadatos, mapaEjercicios, soloResueltos, cinta, guardarMetadatos);
    }
    else setTimeout(() => pulsar(boton));
}

function mostrarSoloResueltos() {
    if (!estado.cancelado) mostrarCategoria("sociales", categoriaSeleccionada, metadatos, mapaEjercicios, soloResueltos, cinta, guardarMetadatos);
    else setTimeout(() => mostrarSoloResueltos(soloResueltos));
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) {
            if (main.classList.contains("cargando")) estado.cancelar();
            pulsar(boton);
        }
    });
});

botonAleatorio.addEventListener("click", () => {
    const boton = botones[Math.floor(Math.random() * botones.length)];
    const categoria = boton.id.replace("boton-", "");
    boton.click();
    if (categoriasProgramacionLineal.includes(categoria)) document.querySelector("#grupo-programacion-lineal").click();
    else if (categoriasAlgebra.includes(categoria)) document.querySelector("#grupo-algebra").click();
    else if (categoriasEstadistica.includes(categoria)) document.querySelector("#grupo-estadistica").click();
    else document.querySelector(".grupo").click();
});

casilla.addEventListener("click", () => {
    soloResueltos = casilla.checked;
    if (main.classList.contains("cargando")) estado.cancelar();
    if (categoriaSeleccionada) mostrarSoloResueltos();
});

if (!categoria) document.querySelector(".grupo").click();
else {
    try {
        document.querySelector("#boton-" + categoria).click();
        if (categoriasProgramacionLineal.includes(categoria)) document.querySelector("#grupo-programacion-lineal").click();
        else if (categoriasAlgebra.includes(categoria)) document.querySelector("#grupo-algebra").click();
        else if (categoriasEstadistica.includes(categoria)) document.querySelector("#grupo-estadistica").click();
        else document.querySelector(".grupo").click();
    }
    catch {
        document.querySelector(".grupo").click();
    }
}