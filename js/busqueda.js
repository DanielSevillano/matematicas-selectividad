import { estado, formatear, obtenerEjercicio } from "./math.js";

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const texto = parametros.get("texto");

const main = document.querySelector("main");
const busqueda = document.querySelector("input");
const cinta = document.querySelector("#cinta");

const grupos = document.querySelectorAll(".grupo");
const contenidoGrupos = document.querySelectorAll(".contenido-grupo");
const contenidoCiencias = document.querySelector("#ciencias");
const contenidoSociales = document.querySelector("#sociales");

let metadatosCiencias;
let metadatosSociales;

let mapaEjerciciosCiencias = new Map();
let mapaEjerciciosSociales = new Map();

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

async function buscar(texto) {
    contenidoCiencias.textContent = "";
    contenidoSociales.textContent = "";
    main.classList.add("cargando");

    contenidoCiencias.classList.remove("oculto");
    contenidoSociales.classList.remove("oculto");

    cinta.classList.remove("oculto");
    cinta.classList.add("cargando");
    cinta.style.setProperty("--progreso", 0);
    const contador = cinta.querySelector("#contador");
    contador.textContent = 0;
    let escaneados = 0;

    if (!metadatosCiencias) {
        const respuesta = await fetch("data\\ciencias\\metadata.json");
        const metadatos = await respuesta.json();
        metadatosCiencias = metadatos.filter(dato => dato.ejercicio < 2025000);
    }

    if (!metadatosSociales) {
        const respuesta = await fetch("data\\sociales\\metadata.json");
        metadatosSociales = await respuesta.json();
    }

    const total = metadatosCiencias.length + metadatosSociales.length;

    for (let dato of metadatosCiencias) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        const codigo = dato.ejercicio;
        let contenido;

        if (!mapaEjerciciosCiencias.get(codigo)) {
            const curso = String(codigo).slice(0, 4);
            const ruta = "data\\ciencias\\" + curso + "\\" + codigo + ".txt";
            const respuesta = await fetch(ruta);
            contenido = await respuesta.text();
            if (curso > 2021) mapaEjerciciosCiencias.set(codigo, contenido);
        } else {
            contenido = mapaEjerciciosCiencias.get(codigo);
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        escaneados++;
        cinta.style.setProperty("--progreso", escaneados / total * 100);

        if (contenido.includes(texto)) {
            let resuelto = false;
            let categorias = [];
            if (dato.resuelto) resuelto = true;
            categorias = dato.categorias;

            const examen = parseInt(String(dato.ejercicio).slice(0, 5));
            const numero = parseInt(String(dato.ejercicio).slice(5));

            contador.textContent = parseInt(contador.textContent) + 1;

            const seccion = await obtenerEjercicio("ciencias", examen, numero, resuelto, categorias, mapaEjerciciosCiencias);
            seccion.classList.add("ciencias");
            contenidoCiencias.append(seccion);
            formatear(seccion);
        }
    }

    for (let dato of metadatosSociales) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        const codigo = dato.ejercicio;
        let contenido;

        if (!mapaEjerciciosSociales.get(codigo)) {
            const curso = String(codigo).slice(0, 4);
            const ruta = "data\\sociales\\" + curso + "\\" + codigo + ".txt";
            const respuesta = await fetch(ruta);
            contenido = await respuesta.text();
            if (curso > 2021) mapaEjerciciosSociales.set(codigo, contenido);
        } else {
            contenido = mapaEjerciciosSociales.get(codigo);
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        escaneados++;
        cinta.style.setProperty("--progreso", escaneados / total * 100);

        if (contenido.includes(texto)) {
            let resuelto = false;
            let categorias = [];
            if (dato.resuelto) resuelto = true;
            categorias = dato.categorias;

            const examen = parseInt(String(dato.ejercicio).slice(0, 5));
            const numero = parseInt(String(dato.ejercicio).slice(5));

            contador.textContent = parseInt(contador.textContent) + 1;

            const seccion = await obtenerEjercicio("sociales", examen, numero, resuelto, categorias, mapaEjerciciosCiencias);
            seccion.classList.add("sociales");
            contenidoSociales.append(seccion);
            formatear(seccion);
        }
    }

    cinta.classList.remove("cargando");
    main.classList.remove("cargando");
    estado.reanudar();
}

function pulsar() {
    if (!estado.cancelado) {
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?texto=" + busqueda.value);
        buscar(busqueda.value.trim().toLowerCase());
    }
    else setTimeout(() => pulsar());
}

busqueda.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && busqueda.value.trim().length >= 1) {
        if (main.classList.contains("cargando")) estado.cancelar();
        pulsar();
    }
});

document.querySelector(".grupo").click();
if (texto) {
    busqueda.value = texto;
    buscar(texto.trim().toLowerCase());
}