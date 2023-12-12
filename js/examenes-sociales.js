import { estado, formatear } from "./math.js";

function normalizar(texto) {
    let procesado = texto.toLowerCase();
    procesado = procesado.replaceAll("á", "a");
    procesado = procesado.replaceAll("é", "e");
    procesado = procesado.replaceAll("í", "i");
    procesado = procesado.replaceAll("ó", "o");
    procesado = procesado.replaceAll("ú", "u");
    procesado = procesado.replaceAll(" ", "-");
    return procesado;
}

function tituloExamen(examen) {
    const codigo = String(examen);
    const curso = codigo.slice(0, 4);
    const edicion = codigo.slice(-1);

    let titulo = "";
    if (edicion == 0) {
        if (curso == 2020) titulo += "Julio";
        else titulo += "Junio";
    }
    else if (edicion == 5) {
        if (curso >= 2021) titulo += "Julio";
        else titulo += "Septiembre";
    }
    else titulo += "Reserva " + edicion;
    titulo += " de " + curso;

    return titulo;
}

async function obtenerEjercicio(examen, ejercicio, categorias = []) {
    const articulo = document.createElement("article");
    const titulo = document.createElement("h3");
    const parrafo = document.createElement("p");

    titulo.textContent = "Ejercicio " + ejercicio;
    articulo.append(titulo);

    const contenedorCategorias = document.createElement("ul");
    contenedorCategorias.classList.add("categorias");
    categorias.forEach(categoria => {
        const elementoCategoria = document.createElement("li");
        const enlaceCategoria = document.createElement("a");
        enlaceCategoria.textContent = categoria;
        enlaceCategoria.href = "/ejercicios-sociales.html?categoria=" + normalizar(categoria);
        enlaceCategoria.classList.add("contorno");
        elementoCategoria.append(enlaceCategoria);
        contenedorCategorias.append(elementoCategoria);
    })
    articulo.append(contenedorCategorias);

    const curso = String(examen).slice(0, 4);
    const ruta = "data\\sociales\\" + curso + "\\" + examen + ejercicio + ".txt";

    const respuesta = await fetch(ruta);
    const datos = await respuesta.text();

    parrafo.innerHTML = datos;

    articulo.append(parrafo);

    return articulo;
}

async function obtenerExamen(examen) {
    const main = document.querySelector("main");

    const titulo = document.createElement("h2");
    titulo.innerText = "📋 " + tituloExamen(examen);

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.classList.add("cargando");
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    main.append(titulo);

    const respuesta = await fetch("data\\sociales\\metadata.json");
    const datos = await respuesta.json();

    for (let ejercicio = 1; ejercicio <= 8; ejercicio++) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        const codigo = examen * 10 + ejercicio;
        const datosEjercicio = datos.find(dato => dato.ejercicio == codigo);

        let categorias = [];
        if (datosEjercicio != undefined) categorias = datosEjercicio.categorias;

        boton.style.setProperty("--progreso", ejercicio / 8 * 100);

        const seccion = await obtenerEjercicio(examen, ejercicio, categorias);
        main.append(seccion);
        formatear(seccion);
    }

    boton.disabled = false;
    boton.classList.remove("cargando");

    return true;
}

async function mostrarExamen(examen) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerExamen(examen).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const examen = parametros.get("examen");

const main = document.querySelector("main");
const grupos = document.querySelectorAll(".grupo");
const contenidoGrupos = document.querySelectorAll(".contenido-grupo");
const botones = document.querySelectorAll(".contorno");
const botonAleatorio = document.querySelector("#aleatorio");

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
        const examen = boton.id.replace("boton-", "");
        mostrarExamen(examen);
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?examen=" + examen);

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