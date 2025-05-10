import { Ejercicio, obtenerEjercicio } from "./math.js";

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const texto = parametros.get("texto");

const main = document.querySelector("main");
const busqueda = document.querySelector("input");
const cinta = document.querySelector("#cinta");
const contador = cinta.querySelector("#contador");

const contenedorGrupos = document.querySelector(".contenedor-grupos");
const grupos = document.querySelectorAll(".grupo");
const contenidoGrupos = document.querySelectorAll(".contenido-grupo");
const contenidoCiencias = document.querySelector("#ciencias");
const contenidoSociales = document.querySelector("#sociales");

let metadatosCiencias;
let metadatosSociales;

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

async function buscarEjercicio(texto, ejercicio) {
    let contenido;

    const ruta = "data\\" + ejercicio.modalidad + "\\" + ejercicio.curso + "\\" + ejercicio.codigo() + ".txt";
    const respuesta = await fetch(ruta);
    contenido = await respuesta.text();

    if (contenido.toLowerCase().includes(texto)) {
        const articulo = document.createElement("article");
        articulo.classList.add(ejercicio.modalidad);
        if (ejercicio.modalidad == "ciencias") contenidoCiencias.append(articulo);
        else contenidoSociales.append(articulo);
        await obtenerEjercicio(articulo, ejercicio, true);
        return true;
    }
}

async function buscar(texto) {
    contenidoCiencias.textContent = "";
    contenidoSociales.textContent = "";
    main.classList.add("cargando");
    cinta.classList.add("oculto");

    contenedorGrupos.classList.remove("oculto");
    contenidoCiencias.classList.remove("oculto");
    contenidoSociales.classList.remove("oculto");

    contador.textContent = 0;

    if (!metadatosCiencias) {
        const respuesta = await fetch("data\\ciencias\\metadata.json");
        const metadatos = await respuesta.json();
        metadatosCiencias = metadatos.filter(dato => dato.ejercicio < 2025000);
    }

    if (!metadatosSociales) {
        const respuesta = await fetch("data\\sociales\\metadata.json");
        metadatosSociales = await respuesta.json();
    }

    const promesas = [];

    for (let dato of metadatosCiencias) {
        const ejercicio = new Ejercicio("ciencias", dato.ejercicio, false, dato.categorias);
        promesas.push(buscarEjercicio(texto, ejercicio));
    }

    for (let dato of metadatosSociales) {
        const ejercicio = new Ejercicio("sociales", dato.ejercicio, false, dato.categorias);
        promesas.push(buscarEjercicio(texto, ejercicio));
    }

    await Promise.all(promesas).catch(() => { return false; });
    main.classList.remove("cargando");
    contador.textContent = document.querySelectorAll("article").length;
    cinta.classList.remove("oculto");
}

function pulsar() {
    history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?texto=" + busqueda.value);
    buscar(busqueda.value.trim().toLowerCase());
}

busqueda.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && busqueda.value.trim().length >= 1) pulsar();
});

document.querySelector(".grupo").click();
if (texto) {
    busqueda.value = texto;
    buscar(texto.trim().toLowerCase());
}