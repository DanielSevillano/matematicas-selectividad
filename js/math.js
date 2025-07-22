export { Ejercicio, obtenerEjercicio, obtenerExamen, obtenerCategoria, obtenerTemario, obtenerExamenGenerado };

const main = document.querySelector("main");
let html = "";
if (location.href.includes(".html")) html = ".html";

let controlador = new AbortController();
let indicacion = controlador.signal;

async function formatear(elemento) {
    if (math) return window.MathJax.typesetPromise([elemento]);
    else setTimeout(() => formatear(elemento));
}

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

class Ejercicio {
    constructor(modalidad, codigo, resuelto = false, categorias = []) {
        this.modalidad = modalidad;
        this.curso = parseInt(String(codigo).slice(0, 4));
        this.edicion = parseInt(String(codigo)[4]);
        this.numero = parseInt(String(codigo).slice(5));
        this.resuelto = resuelto;
        this.categorias = categorias;
        this.examen = parseInt(String(codigo).slice(0, 5));
    }

    codigo() {
        return String(this.curso) + String(this.edicion) + String(this.numero);
    }
}

function tituloEjercicio(ejercicio, tituloCompleto) {
    const titulo = document.createElement("h3");

    let numeracion = ejercicio.numero;
    let letra = "";
    if (ejercicio.curso <= 2019) {
        if (ejercicio.numero <= 4) letra = "A";
        else {
            numeracion = ejercicio.numero - 4;
            letra = "B";
        }
    }

    if (tituloCompleto) {
        titulo.textContent = "Ejercicio " + letra + numeracion + ": ";

        if (ejercicio.examen == 20256 || ejercicio.curso < 2010) titulo.textContent += tituloExamen(ejercicio.examen);
        else {
            const enlace = document.createElement("a");
            enlace.textContent = tituloExamen(ejercicio.examen);
            enlace.href = "/examenes-" + ejercicio.modalidad + html + "?examen=" + ejercicio.examen;
            titulo.append(enlace);
        }
    } else titulo.textContent = "Ejercicio " + letra + numeracion;

    return titulo;
}

function categoriasEjercicio(modalidad, categorias) {
    const contenedorCategorias = document.createElement("ul");
    contenedorCategorias.classList.add("categorias");
    categorias.forEach(categoria => {
        const elementoCategoria = document.createElement("li");
        const enlaceCategoria = document.createElement("a");
        enlaceCategoria.textContent = categoria;
        enlaceCategoria.href = "/ejercicios-" + modalidad + html + "?categoria=" + normalizar(categoria);
        enlaceCategoria.classList.add("contorno");
        elementoCategoria.append(enlaceCategoria);
        contenedorCategorias.append(elementoCategoria);
    });

    return contenedorCategorias;
}

function tituloExamen(examen) {
    const curso = String(examen).slice(0, 4);
    const edicion = String(examen).slice(-1);

    if (edicion == 6) return "Modelo de prueba";

    let titulo = "";
    if (edicion == 0) {
        if (examen.curso == 2020) titulo += "Julio";
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

function encabezadoExamen(titulo) {
    const encabezado = document.createElement("h2");
    encabezado.innerText = "📋 " + titulo;

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.addEventListener("click", () => window.print());
    encabezado.append(boton);

    return { encabezado, boton };
}

async function descargarMetadatos(modalidad, metadatos, guardarMetadatos) {
    let datos;
    if (!metadatos) {
        const respuesta = await fetch("data\\" + modalidad + "\\metadata.json");
        datos = await respuesta.json();
        guardarMetadatos(datos);
    } else datos = metadatos;

    return datos;
}

async function obtenerEjercicio(articulo, ejercicio, tituloCompleto = false, prioridad = "auto", enunciado = undefined) {
    articulo.append(tituloEjercicio(ejercicio, tituloCompleto));
    if (ejercicio.resuelto) articulo.classList.add("resuelto");
    if (ejercicio.categorias.length > 0) articulo.append(categoriasEjercicio(ejercicio.modalidad, ejercicio.categorias));

    const contenido = document.createElement("div");
    contenido.classList.add("cargando");
    articulo.append(contenido);

    const parrafo = document.createElement("p");
    let datos;
    if (!enunciado) {
        const ruta = "data\\" + ejercicio.modalidad + "\\" + ejercicio.curso + "\\" + ejercicio.codigo() + ".txt";
        const respuesta = await fetch(ruta, {
            priority: prioridad,
            signal: indicacion
        });
        datos = await respuesta.text();
    } else datos = enunciado;
    parrafo.innerHTML = datos;
    contenido.append(parrafo);
    await formatear(parrafo);
    contenido.classList.remove("cargando");

    if (ejercicio.resuelto) {
        const contenedorResolucion = document.createElement("details");
        const tituloResolucion = document.createElement("summary");
        tituloResolucion.textContent = "Resolución";
        contenedorResolucion.append(tituloResolucion);
        articulo.append(contenedorResolucion);

        const textoResolucion = document.createElement("div");
        textoResolucion.classList.add("cargando");
        contenedorResolucion.append(textoResolucion);

        const codigoResolucion = "R" + ejercicio.codigo();
        const rutaResolucion = "data\\" + ejercicio.modalidad + "\\" + ejercicio.curso + "\\" + codigoResolucion + ".txt";
        const respuestaResolucion = await fetch(rutaResolucion, {
            priority: "low",
            signal: indicacion
        });
        const datosResolucion = await respuestaResolucion.text();
        textoResolucion.innerHTML = datosResolucion;

        await formatear(textoResolucion);
        textoResolucion.classList.remove("cargando");
    }

    return true;
}

async function obtenerExamen(modalidad, examen, metadatos, guardarMetadatos) {
    controlador.abort();
    controlador = new AbortController();
    indicacion = controlador.signal;
    main.textContent = "";

    const titulo = tituloExamen(examen);
    const { encabezado, boton } = encabezadoExamen(titulo);
    main.append(encabezado);

    const datos = await descargarMetadatos(modalidad, metadatos, guardarMetadatos);
    const metadatosFiltrados = datos.filter(dato => String(dato.ejercicio).startsWith(examen));
    const ejercicios = metadatosFiltrados.length;

    const promesas = [];

    for (let numero = 1; numero <= ejercicios; numero++) {
        const codigo = examen * 10 + numero;
        const datosEjercicio = datos.find(dato => dato.ejercicio == codigo);
        const ejercicio = new Ejercicio(modalidad, codigo, datosEjercicio.resuelto, datosEjercicio.categorias);
        const articulo = document.createElement("article");
        main.append(articulo);

        let prioridad;
        if (numero <= 3) prioridad = "high";
        promesas.push(obtenerEjercicio(articulo, ejercicio, false, prioridad));
    }

    await Promise.all(promesas).catch(() => { return false; });
    boton.disabled = false;
    return true;
}

async function obtenerCategoria(modalidad, categoria, metadatos, contador, soloResueltos, guardarMetadatos) {
    controlador.abort();
    controlador = new AbortController();
    indicacion = controlador.signal;
    main.textContent = "";

    const datos = await descargarMetadatos(modalidad, metadatos, guardarMetadatos);
    const ejercicios = datos.filter(ejercicio => ejercicio.categorias.map(c => normalizar(c)).includes(categoria));
    let total = ejercicios.length;
    if (soloResueltos) total = ejercicios.filter(ejercicio => ejercicio.resuelto).length;
    contador.textContent = total;

    const promesas = [];

    ejercicios.forEach((objeto, indice) => {
        const ejercicio = new Ejercicio(modalidad, objeto.ejercicio, objeto.resuelto, objeto.categorias);
        const articulo = document.createElement("article");
        main.append(articulo);

        let prioridad;
        if (indice < 5) prioridad = "high";
        promesas.push(obtenerEjercicio(articulo, ejercicio, true, prioridad));
    });

    await Promise.all(promesas).catch(() => { return false; });
    return true;
}

async function obtenerTemario(seccion) {
    main.textContent = "";
    main.classList.add("cargando");

    const respuesta = await fetch("data\\temario\\" + seccion + ".txt");
    const datos = await respuesta.text();

    const articulo = document.createElement("article");
    main.append(articulo);
    articulo.innerHTML = datos;
    await formatear(articulo);
    main.classList.remove("cargando");

    return true;
}

async function obtenerExamenGenerado(modalidad, ejercicios) {
    main.textContent = "";

    const titulo = "Examen de " + modalidad;
    const { encabezado, boton } = encabezadoExamen(titulo);
    main.append(encabezado);

    const promesas = [];

    for (let numero = 1; numero <= 7; numero++) {
        const objeto = ejercicios[numero - 1];
        const ejercicio = new Ejercicio(modalidad, objeto.ejercicio, objeto.resuelto, objeto.categorias);
        const articulo = document.createElement("article");

        if (numero == 1 || numero % 2 == 0) {
            const indicacion = document.createElement("div");
            indicacion.classList.add("indicacion");
            if (modalidad == "ciencias") {
                if (numero == 1) indicacion.innerHTML = "<b>Bloque obligatorio.</b> Resuelve el siguiente ejercicio";
                else indicacion.innerHTML = "<b>Bloque con optatividad " + numero / 2 + ".</b> Resuelve solo uno de los siguientes ejercicios";
            } else {
                if (numero == 1) indicacion.innerHTML = "<b>Bloque obligatorio.</b> Resuelva el siguiente ejercicio";
                else indicacion.innerHTML = "<b>Bloque con optatividad " + numero / 2 + ".</b> Resuelva solo uno de los siguientes ejercicios";
            }

            const grupo = document.createElement("div");
            grupo.classList.add("cadena");
            grupo.append(indicacion, articulo);
            main.append(grupo);


        } else main.append(articulo);

        promesas.push(obtenerEjercicio(articulo, ejercicio, true));
    }

    await Promise.all(promesas);
    boton.disabled = false;
    boton.classList.remove("cargando");
    return true;
}