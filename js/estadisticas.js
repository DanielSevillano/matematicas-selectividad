import { BarController, BarElement, CategoryScale, Chart, Colors, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.js/+esm";

Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Colors);

const graficas = [];

function actualizarGrafica() {
    graficas.forEach((grafica) => {
        grafica.options.scales.x.grid.color = getComputedStyle(document.body).getPropertyValue("--border-color");
        grafica.options.scales.y.grid.color = getComputedStyle(document.body).getPropertyValue("--border-color");
        grafica.options.scales.x.ticks.color = getComputedStyle(document.body).getPropertyValue("--on-button");
        grafica.options.scales.y.ticks.color = getComputedStyle(document.body).getPropertyValue("--on-button");
        grafica.options.plugins.legend.labels.color = getComputedStyle(document.body).getPropertyValue("--on-button");
        grafica.update();
    });
}

async function crearGrafica(url, id) {
    const ejeX = [];
    const ejeY1 = [];
    const ejeY2 = [];

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    datos.forEach((dato) => {
        const { curso, ciencias, sociales } = dato;

        ejeX.push(curso);
        ejeY1.push(ciencias);
        ejeY2.push(sociales);
    });

    const ctx = document.getElementById(id);
    const grafica = new Chart(ctx, {
        type: "line",
        data: {
            labels: ejeX,
            datasets: [
                {
                    label: "Ciencias",
                    data: ejeY1
                },
                {
                    label: "Sociales",
                    data: ejeY2
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue("--on-button")
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue("--border-color")
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--on-button")
                    }
                },
                y: {
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue("--border-color")
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--on-button")
                    }
                }
            }
        }
    });

    return grafica;
}

function crearDiagrama(ejerciciosCiencias, ejerciciosSociales, resueltosCiencias, resueltosSociales) {
    const datos = {
        labels: ["Ciencias", "Sociales"],
        datasets: [
            {
                label: "Ejercicios totales",
                data: [ejerciciosCiencias, ejerciciosSociales],
                backgroundColor: "rgba(54, 162, 235)"
            },
            {
                label: "Ejercicios resueltos",
                data: [resueltosCiencias, resueltosSociales],
                backgroundColor: "rgb(255, 99, 132)"
            }
        ]
    };

    const ctx = document.getElementById("diagrama");
    const diagrama = new Chart(ctx, {
        type: "bar",
        data: datos,
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue("--on-button")
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue("--border-color")
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--on-button")
                    }
                },
                y: {
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue("--border-color")
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--on-button")
                    }
                }
            }
        }
    });

    return diagrama;
}

async function obtenerDatos() {
    const seccionCiencias = document.querySelector("#estadisticas-ciencias");
    const seccionSociales = document.querySelector("#estadisticas-sociales");
    const seccionGlobal = document.querySelector("#estadisticas-globales");

    //Estadísticas de ciencias

    const respuestaCiencias = await fetch("data\\ciencias\\metadata.json");
    const datosCiencias = await respuestaCiencias.json();

    const numeroEjerciciosCiencias = datosCiencias.length;

    const tarjetaEjerciciosCiencias = document.createElement("div");
    tarjetaEjerciciosCiencias.classList.add("tarjeta");
    tarjetaEjerciciosCiencias.textContent = numeroEjerciciosCiencias + " ejercicios";

    const tarjetaExamenesCiencias = document.createElement("div");
    tarjetaExamenesCiencias.classList.add("tarjeta");
    tarjetaExamenesCiencias.textContent = (numeroEjerciciosCiencias / 8) + " examenes";

    const numeroEjerciciosResueltosCiencias = datosCiencias.filter((ejercicio) => ejercicio.resuelto).length;

    const tarjetaEjerciciosResueltosCiencias = document.createElement("div");
    tarjetaEjerciciosResueltosCiencias.classList.add("tarjeta");
    tarjetaEjerciciosResueltosCiencias.textContent = numeroEjerciciosResueltosCiencias + " ejercicios resueltos";

    const tarjetaPorcentajeResueltosCiencias = document.createElement("div");
    tarjetaPorcentajeResueltosCiencias.classList.add("tarjeta");
    tarjetaPorcentajeResueltosCiencias.textContent = (numeroEjerciciosResueltosCiencias / numeroEjerciciosCiencias * 100).toFixed(2).replace(".", ",") + "% resuelto";

    seccionCiencias.append(tarjetaExamenesCiencias, tarjetaEjerciciosCiencias, tarjetaEjerciciosResueltosCiencias, tarjetaPorcentajeResueltosCiencias);
    seccionCiencias.classList.remove("cargando");

    // Estadísticas de sociales

    const respuestaSociales = await fetch("data\\sociales\\metadata.json");
    const datosSociales = await respuestaSociales.json();

    const numeroEjerciciosSociales = datosSociales.length;

    const tarjetaEjerciciosSociales = document.createElement("div");
    tarjetaEjerciciosSociales.classList.add("tarjeta");
    tarjetaEjerciciosSociales.textContent = numeroEjerciciosSociales + " ejercicios";

    const tarjetaExamenesSociales = document.createElement("div");
    tarjetaExamenesSociales.classList.add("tarjeta");
    tarjetaExamenesSociales.textContent = (numeroEjerciciosSociales / 8) + " examenes";

    const numeroEjerciciosResueltosSociales = datosSociales.filter((ejercicio) => ejercicio.resuelto).length;

    const tarjetaEjerciciosResueltosSociales = document.createElement("div");
    tarjetaEjerciciosResueltosSociales.classList.add("tarjeta");
    tarjetaEjerciciosResueltosSociales.textContent = numeroEjerciciosResueltosSociales + " ejercicios resueltos";

    const tarjetaPorcentajeResueltosSociales = document.createElement("div");
    tarjetaPorcentajeResueltosSociales.classList.add("tarjeta");
    tarjetaPorcentajeResueltosSociales.textContent = (numeroEjerciciosResueltosSociales / numeroEjerciciosSociales * 100).toFixed(2).replace(".", ",") + "% resuelto";

    seccionSociales.append(tarjetaExamenesSociales, tarjetaEjerciciosSociales, tarjetaEjerciciosResueltosSociales, tarjetaPorcentajeResueltosSociales);
    seccionSociales.classList.remove("cargando");

    // Estadísticas globales

    const numeroEjercicios = numeroEjerciciosCiencias + numeroEjerciciosSociales;

    const tarjetaEjercicios = document.createElement("div");
    tarjetaEjercicios.classList.add("tarjeta");
    tarjetaEjercicios.textContent = numeroEjercicios + " ejercicios";

    const tarjetaExamenes = document.createElement("div");
    tarjetaExamenes.classList.add("tarjeta");
    tarjetaExamenes.textContent = (numeroEjercicios / 8) + " examenes";

    const numeroEjerciciosResueltos = numeroEjerciciosResueltosCiencias + numeroEjerciciosResueltosSociales;

    const tarjetaEjerciciosResueltos = document.createElement("div");
    tarjetaEjerciciosResueltos.classList.add("tarjeta");
    tarjetaEjerciciosResueltos.textContent = numeroEjerciciosResueltos + " ejercicios resueltos";

    const tarjetaPorcentajeResueltos = document.createElement("div");
    tarjetaPorcentajeResueltos.classList.add("tarjeta");
    tarjetaPorcentajeResueltos.textContent = (numeroEjerciciosResueltos / numeroEjercicios * 100).toFixed(2).replace(".", ",") + "% resuelto";

    seccionGlobal.append(tarjetaExamenes, tarjetaEjercicios, tarjetaEjerciciosResueltos, tarjetaPorcentajeResueltos);
    seccionGlobal.classList.remove("cargando");

    // Diagrama
    const diagrama = crearDiagrama(numeroEjerciciosCiencias, numeroEjerciciosSociales, numeroEjerciciosResueltosCiencias, numeroEjerciciosResueltosSociales);
    graficas.push(diagrama);
}

const datosGraficas = [
    { archivo: "data/estadisticas/porcentaje-aprobados.json", elemento: "grafica-aprobados" },
    { archivo: "data/estadisticas/nota-media.json", elemento: "grafica-nota" }
];

datosGraficas.forEach((dato) => {
    crearGrafica(dato.archivo, dato.elemento).then((grafica) => {
        graficas.push(grafica);
    });
});

obtenerDatos();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", actualizarGrafica);