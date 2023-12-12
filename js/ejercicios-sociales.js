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

async function obtenerEjercicio(examen, ejercicio, categorias = [], tituloCompleto = false) {
    const articulo = document.createElement("article");
    const titulo = document.createElement("h3");
    const parrafo = document.createElement("p");

    if (tituloCompleto) {
        titulo.textContent = "Ejercicio " + ejercicio + ": ";

        const enlace = document.createElement("a");
        enlace.textContent = tituloExamen(examen);
        enlace.href = "/examenes-sociales.html?examen=" + examen;

        titulo.append(enlace);
    } else titulo.textContent = "Ejercicio " + ejercicio;

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

async function obtenerCategoria(categoria) {
    const main = document.querySelector("main");

    const respuesta = await fetch("data\\sociales\\metadata.json");
    const datos = await respuesta.json();

    const ejercicios = datos.filter(ejercicio => ejercicio.categorias.map(c => normalizar(c)).includes(categoria));

    for (let ejercicio of ejercicios) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        let resuelto = false
        let categorias = []
        if (ejercicio != undefined) {
            if (ejercicio.resuelto) resuelto = true;
            categorias = ejercicio.categorias;
        }

        const parrafo = await obtenerEjercicio(parseInt(ejercicio.ejercicio / 10), ejercicio.ejercicio % 10, categorias, true);
        main.append(parrafo);
        formatear(parrafo);
    };

    return true;
}

async function mostrarCategoria(categoria) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerCategoria(categoria).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const categoria = parametros.get("categoria");

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
        const categoria = boton.id.replace("boton-", "");
        mostrarCategoria(categoria);
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
    if (["analisis", "integrales", "programacion-lineal", "problemas-de-optimizacion"].includes(categoria)) document.querySelector("#grupo-analisis").click();
    else if (["algebra", "problemas-de-matrices"].includes(categoria)) document.querySelector("#grupo-algebra").click();
    else document.querySelector("#grupo-estadistica").click();
});

if (!categoria) document.querySelector(".grupo").click();
else {
    try {
        document.querySelector("#boton-" + categoria).click();
        if (["analisis", "integrales", "programacion-lineal", "problemas-de-optimizacion"].includes(categoria)) document.querySelector("#grupo-analisis").click();
        else if (["algebra", "problemas-de-matrices"].includes(categoria)) document.querySelector("#grupo-algebra").click();
        else document.querySelector("#grupo-estadistica").click();
    }
    catch {
        document.querySelector(".grupo").click();
    }
}