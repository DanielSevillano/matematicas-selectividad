import { formatear, obtenerEjercicio } from "./math.js";

const contenedor = document.querySelector("#ejercicios-diarios");

async function ejercicioDiario(seccion) {
    const titulo = document.createElement("h3");
    titulo.textContent = seccion;

    const modalidad = seccion.toLowerCase();

    const fecha = new Date();
    const inicio = new Date(fecha.getFullYear(), 0, 1);
    const diferencia = fecha - inicio;
    const semilla = Math.ceil(diferencia / 86400000);
    let multiplicador = 115
    if (modalidad == "sociales") multiplicador = 119
    const indice = (semilla * multiplicador) % 366;

    const respuesta = await fetch("data\\" + modalidad + "\\metadata.json");
    const datos = await respuesta.json();
    const filtro = await datos.filter(objeto => objeto.ejercicio < 2025600);

    const objeto = filtro[indice];
    const codigo = String(objeto.ejercicio);
    const articulo = await obtenerEjercicio(modalidad, codigo.slice(0, 5), codigo.slice(-1), false, objeto.categorias, true);
    articulo.classList.add("tarjeta");

    articulo.prepend(titulo);
    contenedor.append(articulo);
    formatear(articulo);
}

async function ejerciciosDiarios() {
    ejercicioDiario("Ciencias")
        .then(() => ejercicioDiario("Sociales"))
        .then(() => contenedor.classList.remove("cargando"));
}

ejerciciosDiarios();