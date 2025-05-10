import { obtenerExamenGenerado } from "./math.js";

const formulario = document.querySelector("form");

const boton = document.querySelector("#generar");
const botonCiencias = document.querySelector("#ciencias");
const botonSociales = document.querySelector("#sociales");

const intervalo1 = document.querySelector("#curso-inicial");
const intervalo2 = document.querySelector("#curso-final");
const intervalos = [intervalo1, intervalo2];

const minimoCiencias = 2012;
const minimoSociales = 2012;

let metadatosCiencias;
let metadatosSociales;

function establecerMinimo(minimo) {
    intervalos.forEach((intervalo) => {
        intervalo.min = minimo;
        if (parseInt(intervalo.value) < minimo) intervalo.value = minimo;
    });
}

if (intervalo1.checked) establecerMinimo(minimoCiencias);
if (intervalo2.checked) establecerMinimo(minimoSociales);

botonCiencias.addEventListener("click", () => establecerMinimo(minimoCiencias));
botonSociales.addEventListener("click", () => establecerMinimo(minimoSociales));

function ejercicioAleatorio(ejercicios, excepcion = null) {
    let aleatorio = ejercicios[Math.floor(Math.random() * ejercicios.length)];
    while (aleatorio === excepcion) aleatorio = ejercicios[Math.floor(Math.random() * ejercicios.length)];

    return aleatorio;
}

async function procesar(event) {
    event.preventDefault();
    if (boton.disabled) return;

    boton.disabled = true;
    let modalidad = "ciencias";
    if (document.querySelector("#sociales").checked) modalidad = "sociales";

    const intervalo1 = document.querySelector("#curso-inicial");
    const intervalo2 = document.querySelector("#curso-final");

    const cursoInicial = Math.max(parseInt(intervalo1.value), parseInt(intervalo2.value));
    const cursoFinal = Math.min(parseInt(intervalo1.value), parseInt(intervalo2.value));

    let metadatos;
    if (modalidad == "ciencias") {
        if (!metadatosCiencias) {
            const respuesta = await fetch("data\\" + modalidad + "\\metadata.json");
            metadatosCiencias = await respuesta.json();
        }
        metadatos = metadatosCiencias;
    } else if (modalidad == "sociales") {
        if (!metadatosSociales) {
            const respuesta = await fetch("data\\" + modalidad + "\\metadata.json");
            metadatosSociales = await respuesta.json();
        }
        metadatos = metadatosSociales;
    }

    const datos = metadatos.filter(ejercicio => {
        const curso = parseInt(ejercicio.ejercicio / 100);
        return curso >= cursoFinal && curso <= cursoInicial;
    });

    if (modalidad === "ciencias") {
        const ejerciciosAnalisis = datos.filter(ejercicio => ejercicio.categorias.includes("Análisis"));
        const ejerciciosFunciones1 = ejerciciosAnalisis.filter(ejercicio => !ejercicio.categorias.includes("Integrales"));
        const ejerciciosFunciones2 = ejerciciosFunciones1.filter(ejercicio => !ejercicio.categorias.includes("Optimización"));
        const ejerciciosIntegrales = ejerciciosAnalisis.filter(ejercicio => ejercicio.categorias.includes("Integrales"));

        const ejerciciosAlgebra = datos.filter(ejercicio => ejercicio.categorias.includes("Álgebra"));
        const ejerciciosMatrices = ejerciciosAlgebra.filter(ejercicio => !ejercicio.categorias.includes("Sistemas"));
        const ejerciciosSistemas = ejerciciosAlgebra.filter(ejercicio => ejercicio.categorias.includes("Sistemas"));

        const ejerciciosGeometria1 = datos.filter(ejercicio => ejercicio.categorias.includes("Geometría"));
        const ejerciciosGeometria2 = ejerciciosGeometria1.filter(ejercicio => !ejercicio.categorias.includes("Vectores"));

        const ejerciciosProbabilidad = metadatos.filter(ejercicio => ejercicio.categorias.includes("Probabilidad"));

        const bloques = ["Funciones", "Integrales", "Álgebra", "Geometría"];
        const indiceObligatorio = Math.floor(Math.random() * bloques.length);
        const bloqueObligatorio = bloques[indiceObligatorio];
        bloques.splice(indiceObligatorio, 1);

        const indiceFinal = Math.floor(Math.random() * bloques.length);
        const bloqueFinal = bloques[indiceFinal];
        bloques.splice(indiceFinal, 1);

        const ejercicios = [];

        if (bloqueObligatorio == "Funciones") ejercicios.push(ejercicioAleatorio(ejerciciosFunciones1));
        else if (bloqueObligatorio == "Integrales") ejercicios.push(ejercicioAleatorio(ejerciciosIntegrales));
        else if (bloqueObligatorio == "Álgebra") ejercicios.push(ejercicioAleatorio(ejerciciosAlgebra));
        else if (bloqueObligatorio == "Geometría") ejercicios.push(ejercicioAleatorio(ejerciciosGeometria1));

        bloques.forEach(bloque => {
            if (bloque == "Funciones") {
                const referencia = ejercicioAleatorio(ejerciciosFunciones1);
                ejercicios.push(referencia);
                ejercicios.push(ejercicioAleatorio(ejerciciosFunciones2, referencia));
            } else if (bloque == "Integrales") {
                const referencia = ejercicioAleatorio(ejerciciosIntegrales);
                ejercicios.push(referencia);
                ejercicios.push(ejercicioAleatorio(ejerciciosIntegrales, referencia));
            } else if (bloque == "Álgebra") {
                ejercicios.push(ejercicioAleatorio(ejerciciosMatrices));
                ejercicios.push(ejercicioAleatorio(ejerciciosSistemas));
            } else if (bloque == "Geometría") {
                const referencia = ejercicioAleatorio(ejerciciosGeometria1);
                ejercicios.push(referencia);
                ejercicios.push(ejercicioAleatorio(ejerciciosGeometria2, referencia));
            }
        });

        if (bloqueFinal == "Funciones") {
            ejercicios.push(ejercicioAleatorio(ejerciciosFunciones1));
            ejercicios.push(ejercicioAleatorio(ejerciciosProbabilidad));
        } else if (bloqueFinal == "Integrales") {
            ejercicios.push(ejercicioAleatorio(ejerciciosIntegrales));
            ejercicios.push(ejercicioAleatorio(ejerciciosProbabilidad));
        } else if (bloqueFinal == "Álgebra") {
            ejercicios.push(ejercicioAleatorio(ejerciciosAlgebra));
            ejercicios.push(ejercicioAleatorio(ejerciciosProbabilidad));
        } else if (bloqueFinal == "Geometría") {
            ejercicios.push(ejercicioAleatorio(ejerciciosGeometria1));
            ejercicios.push(ejercicioAleatorio(ejerciciosProbabilidad));
        }

        await obtenerExamenGenerado(modalidad, ejercicios);
    } else {
        const ejerciciosNumeros = datos.filter(ejercicio => ejercicio.categorias.includes("Programación lineal") || ejercicio.categorias.includes("Álgebra"));
        const ejerciciosProgramacionLineal = ejerciciosNumeros.filter(ejercicio => ejercicio.categorias.includes("Programación lineal"));
        const ejerciciosAlgebra = ejerciciosNumeros.filter(ejercicio => ejercicio.categorias.includes("Álgebra"));
        const ejerciciosAnalisis = datos.filter(ejercicio => ejercicio.categorias.includes("Análisis"));
        const ejerciciosProbabilidad = datos.filter(ejercicio => ejercicio.categorias.includes("Probabilidad"));
        const ejerciciosEstadistica = datos.filter(ejercicio => ejercicio.categorias.includes("Estadística") && !ejercicio.categorias.includes("Contraste de hipótesis"));

        const bloques = ["Números", "Análisis", "Probabilidad", "Estadística"];
        const indiceObligatorio = Math.floor(Math.random() * bloques.length);
        const bloqueObligatorio = bloques[indiceObligatorio];
        bloques.splice(indiceObligatorio, 1);

        const ejercicios = [];

        if (bloqueObligatorio == "Números") ejercicios.push(ejercicioAleatorio(ejerciciosNumeros));
        else if (bloqueObligatorio == "Análisis") ejercicios.push(ejercicioAleatorio(ejerciciosAnalisis));
        else if (bloqueObligatorio == "Probabilidad") ejercicios.push(ejercicioAleatorio(ejerciciosProbabilidad));
        else if (bloqueObligatorio == "Estadística") ejercicios.push(ejercicioAleatorio(ejerciciosEstadistica));

        bloques.forEach(bloque => {
            if (bloque == "Números") {
                ejercicios.push(ejercicioAleatorio(ejerciciosProgramacionLineal));
                ejercicios.push(ejercicioAleatorio(ejerciciosAlgebra));
            } else if (bloque == "Análisis") {
                const referencia = ejercicioAleatorio(ejerciciosAnalisis);
                ejercicios.push(referencia);
                ejercicios.push(ejercicioAleatorio(ejerciciosAnalisis, referencia));
            } else if (bloque == "Probabilidad") {
                const referencia = ejercicioAleatorio(ejerciciosProbabilidad);
                ejercicios.push(referencia);
                ejercicios.push(ejercicioAleatorio(ejerciciosProbabilidad, referencia));
            } else if (bloque == "Estadística") {
                const referencia = ejercicioAleatorio(ejerciciosEstadistica);
                ejercicios.push(referencia);
                ejercicios.push(ejercicioAleatorio(ejerciciosEstadistica, referencia));
            }
        });

        await obtenerExamenGenerado(modalidad, ejercicios);
    }

    boton.disabled = false;
}

formulario.addEventListener("submit", procesar);