import { formatear, obtenerEjercicio } from "./math.js";

async function ejercicioDiario() {
    const contenedor = document.querySelector("#ejercicio-diario");

    const fecha = new Date();
    const inicio = new Date(fecha.getFullYear(), 0, 1);
    const diferencia = fecha - inicio;
    const semilla = Math.ceil(diferencia / 86400000);
    const indice = (semilla * 115) % 366;

    const respuesta = await fetch("data\\ciencias\\metadata.json");
    const datos = await respuesta.json();

    const objeto = datos[indice];
    const codigo = String(objeto.ejercicio);
    const articulo = await obtenerEjercicio(codigo.slice(0, 5), codigo.slice(-1), false, objeto.categorias, true);
    articulo.classList.add("tarjeta");

    contenedor.append(articulo);
    formatear(articulo);
    contenedor.classList.remove("cargando");
}

ejercicioDiario();