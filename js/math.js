export { estado, formatear, obtenerEjercicio, mostrarExamen, mostrarCategoria, mostrarTemario }

const estado = new Object({
    cancelado: false,
    reanudar: function () {
        this.cancelado = false;
    },
    cancelar: function () {
        this.cancelado = true;
    }
});

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

    if (edicion == 6) {
        titulo += "Modelo de prueba";
        return titulo;
    }

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

function formatear(elemento) {
    if (math) MathJax.typeset([elemento]);
    else setTimeout(() => formatear(elemento));
}

async function obtenerEjercicio(modalidad, examen, ejercicio, resuelto = false, categorias = [], tituloCompleto = false, mapaEjercicios = undefined) {
    const articulo = document.createElement("article");
    const titulo = document.createElement("h3");
    const parrafo = document.createElement("p");

    let numeracion = ejercicio;
    let letra = "";
    if (examen < 20200) {
        if (ejercicio <= 4) letra = "A";
        else {
            numeracion = ejercicio - 4;
            letra = "B"

        }
    }

    let html = "";
    if (location.href.includes(".html")) html = ".html";

    if (tituloCompleto) {
        titulo.textContent = "Ejercicio " + letra + numeracion + ": ";

        if (examen == 20256 || examen < 20100) titulo.textContent += tituloExamen(examen);
        else {
            const enlace = document.createElement("a");
            enlace.textContent = tituloExamen(examen);
            enlace.href = "/examenes-" + modalidad + html + "?examen=" + examen;
            titulo.append(enlace);
        }
    } else titulo.textContent = "Ejercicio " + letra + numeracion;

    articulo.append(titulo);

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
    })
    articulo.append(contenedorCategorias);

    const curso = String(examen).slice(0, 4);
    const codigo = String(examen) + String(ejercicio);

    let datos;
    if (!mapaEjercicios || !mapaEjercicios.get(codigo)) {
        const ruta = "data\\" + modalidad + "\\" + curso + "\\" + codigo + ".txt";
        const respuesta = await fetch(ruta);
        datos = await respuesta.text();
        if (mapaEjercicios && curso >= 2021) mapaEjercicios.set(codigo, datos);
    } else {
        datos = mapaEjercicios.get(codigo);
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    parrafo.innerHTML = datos;

    if (resuelto) {
        const contenedorResolucion = document.createElement("details");
        const tituloResolucion = document.createElement("summary");
        const textoResolucion = document.createElement("div");

        tituloResolucion.textContent = "Resolución";

        const codigoResolucion = "R" + codigo;

        if (!mapaEjercicios || !mapaEjercicios.get(codigoResolucion)) {
            const ruta = "data\\" + modalidad + "\\" + curso + "\\" + codigoResolucion + ".txt";
            const respuesta = await fetch(ruta);
            datos = await respuesta.text();
            if (mapaEjercicios && curso >= 2023) mapaEjercicios.set(codigoResolucion, datos);
        } else {
            datos = mapaEjercicios.get(codigoResolucion);
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        textoResolucion.innerHTML = datos;

        contenedorResolucion.append(tituloResolucion, textoResolucion);
        parrafo.append(contenedorResolucion);
    }

    articulo.append(parrafo);

    return articulo;
}

async function obtenerExamen(modalidad, examen, metadatos) {
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

    for (let ejercicio = 1; ejercicio <= 8; ejercicio++) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        const codigo = examen * 10 + ejercicio;
        const datosEjercicio = metadatos.find(dato => dato.ejercicio == codigo);

        let resuelto = false;
        let categorias = [];
        if (datosEjercicio != undefined) {
            if (datosEjercicio.resuelto) resuelto = true;
            categorias = datosEjercicio.categorias;
        }

        boton.style.setProperty("--progreso", ejercicio / 8 * 100);

        const seccion = await obtenerEjercicio(modalidad, examen, ejercicio, resuelto, categorias);
        main.append(seccion);
        formatear(seccion);
    }

    boton.disabled = false;
    boton.classList.remove("cargando");

    return true;
}

async function mostrarExamen(modalidad, examen, metadatos, guardarMetadatos) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    let datos;
    if (!metadatos) {
        const respuesta = await fetch("data\\" + modalidad + "\\metadata.json");
        datos = await respuesta.json();
        guardarMetadatos(datos);
    } else datos = metadatos;

    obtenerExamen(modalidad, examen, datos).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}

async function obtenerCategoria(modalidad, categoria, metadatos, mapaEjercicios, soloResueltos, cinta) {
    const main = document.querySelector("main");

    let ejercicios = metadatos.filter(ejercicio => ejercicio.categorias.map(c => normalizar(c)).includes(categoria));
    if (soloResueltos) ejercicios = ejercicios.filter(ejercicio => ejercicio.resuelto);
    const total = ejercicios.length;

    cinta.querySelector("#contador").textContent = total;
    cinta.classList.add("cargando");
    let contador = 0;

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

        const examen = parseInt(String(ejercicio.ejercicio).slice(0, 5));
        const numero = parseInt(String(ejercicio.ejercicio).slice(5));

        contador++;
        cinta.style.setProperty("--progreso", contador / total * 100);

        const parrafo = await obtenerEjercicio(modalidad, examen, numero, resuelto, categorias, true, mapaEjercicios);
        main.append(parrafo);
        formatear(parrafo);
    };

    cinta.classList.remove("cargando");

    return true;
}

async function mostrarCategoria(modalidad, categoria, metadatos, mapaEjercicios, soloResueltos = false, cinta, guardarMetadatos) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    let datos;
    if (!metadatos) {
        const respuesta = await fetch("data\\" + modalidad + "\\metadata.json");
        datos = await respuesta.json();
        guardarMetadatos(datos);
    } else datos = metadatos;

    obtenerCategoria(modalidad, categoria, datos, mapaEjercicios, soloResueltos, cinta).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}

async function obtenerTemario(modalidad, seccion) {
    const main = document.querySelector("main");

    const respuesta = await fetch("data\\" + modalidad + "\\temario\\" + seccion + ".txt");
    const datos = await respuesta.text();

    const articulo = document.createElement("article");
    articulo.innerHTML = datos;
    main.append(articulo);
    formatear(articulo);

    return true;
}

async function mostrarTemario(modalidad, seccion) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerTemario(modalidad, seccion).then(() => {
        main.classList.remove("cargando");
    });
}