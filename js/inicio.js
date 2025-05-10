import { Ejercicio, obtenerEjercicio } from "./math.js";

const contenedor = document.querySelector("#ejercicios-diarios");

async function ejercicioDiario(modalidad) {
    const titulo = document.createElement("h3");
    titulo.textContent = modalidad.charAt(0).toUpperCase() + modalidad.slice(1);

    const fecha = new Date();
    const inicio = new Date(fecha.getFullYear(), 0, 1);
    const diferencia = fecha - inicio;
    const semilla = Math.ceil(diferencia / 86400000);
    let multiplicador = 115;
    if (modalidad == "sociales") multiplicador = 119;
    const indice = (semilla * multiplicador) % 366;

    const respuesta = await fetch("data\\" + modalidad + "\\metadata.json");
    const datos = await respuesta.json();
    const filtro = await datos.filter(objeto => objeto.ejercicio < 2025600);

    const objeto = filtro[indice];
    const ejercicio = new Ejercicio(modalidad, String(objeto.ejercicio), false, objeto.categorias);

    const articulo = document.createElement("article");
    articulo.classList.add("tarjeta");
    articulo.append(titulo);
    contenedor.append(articulo);
    await obtenerEjercicio(articulo, ejercicio, true);
    contenedor.classList.remove("cargando");
}

ejercicioDiario("ciencias").then(() => ejercicioDiario("sociales"));