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
const contador = cinta.querySelector("#contador");

let categoriaSeleccionada;

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
        mostrarCategoria("sociales", categoria, false, contador);
        categoriaSeleccionada = categoria;
        cinta.classList.remove("oculto");
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?categoria=" + categoria);

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

botonAleatorio.addEventListener("click", () => {
    const boton = botones[Math.floor(Math.random() * botones.length)];
    const categoria = boton.id.replace("boton-", "");
    boton.click();
    if (["analisis", "asintotas", "recta-tangente", "integrales"].includes(categoria)) document.querySelector("#grupo-analisis").click();
    else if (["programacion-lineal", "problemas-de-optimizacion"].includes(categoria)) document.querySelector("#grupo-programacion-lineal").click();
    else if (["algebra", "problemas-de-matrices"].includes(categoria)) document.querySelector("#grupo-algebra").click();
    else document.querySelector("#grupo-estadistica").click();
});

if (!categoria) document.querySelector(".grupo").click();
else {
    try {
        document.querySelector("#boton-" + categoria).click();
        if (["analisis", "asintotas", "recta-tangente", "integrales"].includes(categoria)) document.querySelector("#grupo-analisis").click();
        else if (["programacion-lineal", "problemas-de-optimizacion"].includes(categoria)) document.querySelector("#grupo-programacion-lineal").click();
        else if (["algebra", "problemas-de-matrices"].includes(categoria)) document.querySelector("#grupo-algebra").click();
        else document.querySelector("#grupo-estadistica").click();
    }
    catch {
        document.querySelector(".grupo").click();
    }
}