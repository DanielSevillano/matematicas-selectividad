function tarjetaProgreso(numero, texto) {
    const tarjeta = document.createElement("fluent-card");
    const contenido = document.createElement("p");
    contenido.textContent = numero + " " + texto;
    tarjeta.append(contenido);
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

    let numero = 0;
    datosExamenes.forEach(examen => {
        numero += examen.ediciones.length;
    });
    const tarjetaExamenes = tarjetaProgreso(numero, "exámenes");

    numero *= 8;
    const tarjetaEjercicios = tarjetaProgreso(numero, "ejercicios");

    numero = 0;
    datosCategorias.forEach(categoria => {
        numero += categoria.categorias.length + 1;
    });
    const tarjetaCategorias = tarjetaProgreso(numero, "categorías");

    numero = 0;
    datosEjercicios.forEach(ejercicio => {
        if (ejercicio.resuelto) numero += 1;
    });
    const tarjetaEjerciciosResueltos = tarjetaProgreso(numero, "ejercicios resueltos");

    numero = 0;
    datosEjercicios.forEach(ejercicio => {
        if (ejercicio.categorias.length >= 1) numero += 1;
    });
    tarjetaEjerciciosCategorizados = tarjetaProgreso(numero, "ejercicios categorizados");

    progreso.textContent = "";
    progreso.append(tarjetaExamenes, tarjetaEjercicios, tarjetaCategorias, tarjetaEjerciciosResueltos, tarjetaEjerciciosCategorizados);
}

mostrarProgreso();