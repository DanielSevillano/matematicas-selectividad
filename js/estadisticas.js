import { CategoryScale, Chart, Colors, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.js/+esm";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Colors);

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
        }
    });

    return grafica;
}

async function obtenerDatos() {
    const seccionCiencias = document.querySelector("#estadisticas-ciencias");
    const seccionSociales = document.querySelector("#estadisticas-sociales");

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

    const tarjetaPorcentajeResueltosCiencias2019 = document.createElement("div");
    tarjetaPorcentajeResueltosCiencias2019.classList.add("tarjeta");
    tarjetaPorcentajeResueltosCiencias2019.textContent = (numeroEjerciciosResueltosCiencias / 240 * 100).toFixed(2).replace(".", ",") + "% desde 2019";

    const numeroEjerciciosResueltosCiencias2023 = datosCiencias.filter((ejercicio) => ejercicio.resuelto && String(ejercicio.ejercicio).slice(0, 4) == 2023).length;

    const tarjetaPorcentajeResueltosCiencias2023 = document.createElement("div");
    tarjetaPorcentajeResueltosCiencias2023.classList.add("tarjeta");
    tarjetaPorcentajeResueltosCiencias2023.textContent = (numeroEjerciciosResueltosCiencias2023 / 48 * 100).toFixed(2).replace(".", ",") + "% de 2023";

    seccionCiencias.append(tarjetaExamenesCiencias, tarjetaEjerciciosCiencias, tarjetaEjerciciosResueltosCiencias, tarjetaPorcentajeResueltosCiencias, tarjetaPorcentajeResueltosCiencias2019, tarjetaPorcentajeResueltosCiencias2023);
    seccionCiencias.classList.remove("cargando");

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
}

const datosGraficas = [
    { archivo: "data/estadisticas/porcentaje-aprobados.json", elemento: "grafica-aprobados" },
    { archivo: "data/estadisticas/nota-media.json", elemento: "grafica-nota" }
];

const graficas = [];
datosGraficas.forEach((dato) => {
    crearGrafica(dato.archivo, dato.elemento).then((grafica) => {
        graficas.push(grafica);
    });
});

obtenerDatos();