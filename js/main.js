import { formatear, obtenerEjercicio } from "./math.js";

async function ejercicioDiario() {
    const contenedor = document.querySelector("#ejercicio-diario");

    const fecha = new Date();
    const semilla = fecha.getDate() * 100 + fecha.getMonth();
    const indice = semilla % 366;

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    const objeto = datos[indice];
    const codigo = String(objeto.ejercicio);
    const articulo = await obtenerEjercicio(codigo.slice(0, 5), codigo.slice(-1), false, objeto.categorias, true);
    articulo.classList.add("tarjeta");

    contenedor.append(articulo);
    formatear(articulo);
}

ejercicioDiario();