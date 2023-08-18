function tarjetaProgreso(numero, texto, progreso = 100) {
    const tarjeta = document.createElement("fluent-card");
    const contenido = document.createElement("p");
    const barra = document.createElement("fluent-progress");
    contenido.textContent = numero + " " + texto;
    barra.value = progreso;
    tarjeta.append(contenido, barra);
    return tarjeta
}

async function mostrarProgreso() {
    const progreso = document.querySelector("#progreso");
    const carga = document.createElement("fluent-progress-ring");
    progreso.append(carga);

    const respuestaExamenes = await fetch("data\\index.json");
    const datosExamenes = await respuestaExamenes.json();

    const respuestaCategorias = await fetch("data\\tags.json");
    const datosCategorias = await respuestaCategorias.json();

    const respuestaEjercicios = await fetch("data\\metadata.json");
    const datosEjercicios = await respuestaEjercicios.json();

    let numeroExamenes = 0;
    datosExamenes.forEach(examen => {
        numeroExamenes += examen.ediciones.length;
    });
    let progresoExamenes = numeroExamenes / 37 * 100;
    const tarjetaExamenes = tarjetaProgreso(numeroExamenes, "exámenes", progresoExamenes);

    let numeroEjercicios = numeroExamenes * 8;
    const tarjetaEjercicios = tarjetaProgreso(numeroEjercicios, "ejercicios", numeroExamenes / 37 * 100);

    let numeroCategorias = 0;
    datosCategorias.forEach(categoria => {
        numeroCategorias += categoria.categorias.length + 1;
    });
    const tarjetaCategorias = tarjetaProgreso(numeroCategorias, "categorías", numeroCategorias / 20 * 100);

    let numeroEjerciciosResueltos = 0;
    datosEjercicios.forEach(ejercicio => {
        if (ejercicio.resuelto) numeroEjerciciosResueltos += 1;
    });
    const tarjetaEjerciciosResueltos = tarjetaProgreso(numeroEjerciciosResueltos, "ejercicios resueltos", numeroEjerciciosResueltos / numeroEjercicios * 100);

    let numeroEjerciciosCategorizados = 0;
    datosEjercicios.forEach(ejercicio => {
        if (ejercicio.categorias.length >= 1) numeroEjerciciosCategorizados += 1;
    });
    const tarjetaEjerciciosCategorizados = tarjetaProgreso(numeroEjerciciosCategorizados, "ejercicios categorizados", numeroEjerciciosCategorizados / numeroEjercicios * 100);

    progreso.textContent = "";
    progreso.append(tarjetaExamenes, tarjetaEjercicios, tarjetaCategorias, tarjetaEjerciciosResueltos, tarjetaEjerciciosCategorizados);
}

mostrarProgreso();