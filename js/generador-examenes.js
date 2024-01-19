import { formatear, obtenerEjercicio } from "./math.js";

async function obtenerExamenGenerado(modalidad, ejercicios) {
    const main = document.querySelector("main");

    const titulo = document.createElement("h2");
    titulo.innerText = "📋 Examen de " + modalidad;

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.classList.add("cargando");
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    main.append(titulo);

    for (let numero = 1; numero <= 8; numero++) {
        const ejercicio = ejercicios[numero - 1];

        let resuelto = false
        let categorias = []
        if (ejercicio != undefined) {
            if (ejercicio.resuelto) resuelto = true;
            categorias = ejercicio.categorias;
        }

        boton.style.setProperty("--progreso", numero / 8 * 100);

        const seccion = await obtenerEjercicio(modalidad, parseInt(ejercicio.ejercicio / 10), ejercicio.ejercicio % 10, resuelto, categorias, true);
        main.append(seccion);
        formatear(seccion);
    }

    boton.disabled = false;
    boton.classList.remove("cargando");
}

async function mostrarExamenGenerado(modalidad, ejercicios) {
    const main = document.querySelector("main");
    const boton = document.querySelector("#generar");

    obtenerExamenGenerado(modalidad, ejercicios).then(() => {
        main.classList.remove("cargando");
        boton.disabled = false;
    });
}

function ejercicioAleatorio(ejercicios, excepcion = null) {
    let aleatorio = ejercicios[Math.floor(Math.random() * ejercicios.length)];
    while (aleatorio === excepcion) aleatorio = ejercicios[Math.floor(Math.random() * ejercicios.length)];

    return aleatorio;
}

async function procesar(event) {
    event.preventDefault();

    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    const boton = document.querySelector("#generar");
    boton.disabled = true;

    let modalidad = "ciencias"
    if (document.querySelector("#sociales").checked) modalidad = "sociales";

    const respuesta = await fetch("data\\" + modalidad + "\\metadata.json");
    const datos = await respuesta.json();

    if (modalidad === "ciencias") {
        const ejerciciosAnalisis = datos.filter(ejercicio => ejercicio.categorias.includes("Análisis"));
        const ejerciciosFunciones1 = ejerciciosAnalisis.filter(ejercicio => ejercicio.categorias.includes("Análisis") && !ejercicio.categorias.includes("Integrales"));
        const ejerciciosFunciones2 = ejerciciosFunciones1.filter(ejercicio => !ejercicio.categorias.includes("Optimización"));
        const ejerciciosIntegrales = ejerciciosAnalisis.filter(ejercicio => ejercicio.categorias.includes("Integrales"));

        const ejerciciosAlgebra = datos.filter(ejercicio => ejercicio.categorias.includes("Álgebra"));
        const ejerciciosMatrices = ejerciciosAlgebra.filter(ejercicio => ejercicio.categorias.includes("Matrices"));
        const ejerciciosSistemas = ejerciciosAlgebra.filter(ejercicio => ejercicio.categorias.includes("Sistemas"));

        const ejerciciosGeometria1 = datos.filter(ejercicio => ejercicio.categorias.includes("Geometría"));
        const ejerciciosGeometria2 = ejerciciosGeometria1.filter(ejercicio => !ejercicio.categorias.includes("Vectores"));

        const ejercicio1 = ejercicioAleatorio(ejerciciosFunciones1);
        const ejercicio2 = ejercicioAleatorio(ejerciciosFunciones2, ejercicio1);
        const ejercicio3 = ejercicioAleatorio(ejerciciosIntegrales);
        const ejercicio4 = ejercicioAleatorio(ejerciciosIntegrales, ejercicio3);
        const ejercicio5 = ejercicioAleatorio(ejerciciosMatrices);
        const ejercicio6 = ejercicioAleatorio(ejerciciosSistemas);
        const ejercicio7 = ejercicioAleatorio(ejerciciosGeometria1);
        const ejercicio8 = ejercicioAleatorio(ejerciciosGeometria2, ejercicio7);

        mostrarExamenGenerado(modalidad, [ejercicio1, ejercicio2, ejercicio3, ejercicio4, ejercicio5, ejercicio6, ejercicio7, ejercicio8]);
    }
    else {
        const ejerciciosProgramacionLineal = datos.filter(ejercicio => ejercicio.categorias.includes("Programación lineal"));
        const ejerciciosAlgebra = datos.filter(ejercicio => ejercicio.categorias.includes("Álgebra"));
        const ejerciciosAnalisis = datos.filter(ejercicio => ejercicio.categorias.includes("Análisis"));
        const ejerciciosProbabilidad = datos.filter(ejercicio => ejercicio.categorias.includes("Probabilidad"));
        const ejerciciosEstadistica = datos.filter(ejercicio => ejercicio.categorias.includes("Estadística"));

        const ejercicio1 = ejercicioAleatorio(ejerciciosProgramacionLineal);
        const ejercicio2 = ejercicioAleatorio(ejerciciosAlgebra);
        const ejercicio3 = ejercicioAleatorio(ejerciciosAnalisis);
        const ejercicio4 = ejercicioAleatorio(ejerciciosAnalisis, ejercicio3);
        const ejercicio5 = ejercicioAleatorio(ejerciciosProbabilidad);
        const ejercicio6 = ejercicioAleatorio(ejerciciosProbabilidad, ejercicio5);
        const ejercicio7 = ejercicioAleatorio(ejerciciosEstadistica);
        const ejercicio8 = ejercicioAleatorio(ejerciciosEstadistica, ejercicio7);

        mostrarExamenGenerado(modalidad, [ejercicio1, ejercicio2, ejercicio3, ejercicio4, ejercicio5, ejercicio6, ejercicio7, ejercicio8]);
    }
}

const formulario = document.querySelector("form");
formulario.addEventListener("submit", procesar);