async function mostrarContenido() {
    const encabezadoExamenes = document.querySelector("#encabezado-examenes");
    const encabezadoEjercicios = document.querySelector("#encabezado-ejercicios");

    const contadorExamenes = document.createElement("p");
    const contadorEjercicios = document.createElement("p");

    const respuesta = await fetch("data\\index.json");
    const datos = await respuesta.json();

    let numeroExamenes = 0;
    datos.forEach(examen => {
        numeroExamenes += examen.ediciones.length;
    });

    contadorExamenes.textContent = numeroExamenes;
    contadorEjercicios.textContent = numeroExamenes * 8;

    encabezadoExamenes.append(contadorExamenes);
    encabezadoEjercicios.append(contadorEjercicios);
}

mostrarContenido();