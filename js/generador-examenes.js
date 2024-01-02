import { estado, formatear, obtenerEjercicio } from "./math.js";

async function obtenerExamen(modalidad, ejercicios) {
    const main = document.querySelector("main");

    const titulo = document.createElement("h2");
    titulo.innerText = "📋 Examen generado";

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.classList.add("cargando");
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    main.append(titulo);

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

        const seccion = await obtenerEjercicio(modalidad, parseInt(ejercicio.ejercicio / 10), ejercicio.ejercicio % 10, resuelto, categorias, true);
        main.append(seccion);
        formatear(seccion);
    }

    boton.disabled = false;
    boton.classList.remove("cargando");
}

async function mostrarExamen(modalidad, ejercicios) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerExamen(modalidad, ejercicios).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}

async function procesar(event) {
    event.preventDefault();

    let modalidad = "ciencias"
    if (document.querySelector("#sociales").checked) modalidad = "sociales";

    const respuesta = await fetch("data\\" + modalidad + "\\metadata.json");
    const datos = await respuesta.json();

    if (modalidad === "ciencias") {
        const ejerciciosFunciones = datos.filter(ejercicio => ejercicio.categorias.includes("Análisis") && !ejercicio.categorias.includes("Integrales"));
        const ejerciciosIntegrales = datos.filter(ejercicio => ejercicio.categorias.includes("Integrales"));
        const ejerciciosAlgebra = datos.filter(ejercicio => ejercicio.categorias.includes("Álgebra"));
        const ejerciciosGeometria = datos.filter(ejercicio => ejercicio.categorias.includes("Geometría"));

        const ejercicio1 = ejerciciosFunciones[Math.floor(Math.random() * ejerciciosFunciones.length)];
        const ejercicio2 = ejerciciosFunciones[Math.floor(Math.random() * ejerciciosFunciones.length)];
        const ejercicio3 = ejerciciosIntegrales[Math.floor(Math.random() * ejerciciosIntegrales.length)];
        const ejercicio4 = ejerciciosIntegrales[Math.floor(Math.random() * ejerciciosIntegrales.length)];
        const ejercicio5 = ejerciciosAlgebra[Math.floor(Math.random() * ejerciciosAlgebra.length)];
        const ejercicio6 = ejerciciosAlgebra[Math.floor(Math.random() * ejerciciosAlgebra.length)];
        const ejercicio7 = ejerciciosGeometria[Math.floor(Math.random() * ejerciciosGeometria.length)];
        const ejercicio8 = ejerciciosGeometria[Math.floor(Math.random() * ejerciciosGeometria.length)];

        mostrarExamen(modalidad, [ejercicio1, ejercicio2, ejercicio3, ejercicio4, ejercicio5, ejercicio6, ejercicio7, ejercicio8]);
    }
    else {
        const ejerciciosProgramacionLineal = datos.filter(ejercicio => ejercicio.categorias.includes("Programación lineal"));
        const ejerciciosAlgebra = datos.filter(ejercicio => ejercicio.categorias.includes("Álgebra"));
        const ejerciciosAnalisis = datos.filter(ejercicio => ejercicio.categorias.includes("Análisis"));
        const ejerciciosProbabilidad = datos.filter(ejercicio => ejercicio.categorias.includes("Probabilidad"));
        const ejerciciosEstadistica = datos.filter(ejercicio => ejercicio.categorias.includes("Estadística"));

        const ejercicio1 = ejerciciosProgramacionLineal[Math.floor(Math.random() * ejerciciosProgramacionLineal.length)];
        const ejercicio2 = ejerciciosAlgebra[Math.floor(Math.random() * ejerciciosAlgebra.length)];
        const ejercicio3 = ejerciciosAnalisis[Math.floor(Math.random() * ejerciciosAnalisis.length)];
        const ejercicio4 = ejerciciosAnalisis[Math.floor(Math.random() * ejerciciosAnalisis.length)];
        const ejercicio5 = ejerciciosProbabilidad[Math.floor(Math.random() * ejerciciosProbabilidad.length)];
        const ejercicio6 = ejerciciosProbabilidad[Math.floor(Math.random() * ejerciciosProbabilidad.length)];
        const ejercicio7 = ejerciciosEstadistica[Math.floor(Math.random() * ejerciciosEstadistica.length)];
        const ejercicio8 = ejerciciosEstadistica[Math.floor(Math.random() * ejerciciosEstadistica.length)];

        mostrarExamen(modalidad, [ejercicio1, ejercicio2, ejercicio3, ejercicio4, ejercicio5, ejercicio6, ejercicio7, ejercicio8]);
    }
}

const formulario = document.querySelector("form");
formulario.addEventListener("submit", procesar);