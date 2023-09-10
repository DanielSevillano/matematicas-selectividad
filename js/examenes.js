const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const examen = parametros.get("examen");

const main = document.querySelector("main");
const grupos = document.querySelectorAll(".grupo");
const contenidoGrupos = document.querySelectorAll(".contenido-grupo");
const botones = document.querySelectorAll(".contorno");

grupos.forEach((grupo, indice) => {
    grupo.addEventListener("click", () => {
        grupos.forEach(g => {
            if (grupo == g) g.classList.add("seleccionado");
            else g.classList.remove("seleccionado");
        });

        contenidoGrupos.forEach((contenido, i) => {
            if (indice == i) contenido.classList.add("visible");
            else contenido.classList.remove("visible");
        });
    });
});

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado") && !main.classList.contains("cargando")) {
            const examen = boton.id.replace("boton-", "");
            mostrarExamen(examen);
            history.pushState(history.state, document.title, direccion.origin + direccion.pathname + "?examen=" + examen);

            botones.forEach(b => {
                if (boton == b) b.classList.add("seleccionado");
                else b.classList.remove("seleccionado");
            });
        }
    });
});

if (!examen) document.querySelector(".grupo").click();
else {
    const curso = examen.slice(0, 4);
    try {
        document.querySelector("#boton-" + examen).click();
        document.querySelector("#grupo-" + curso).click();
    }
    catch {
        document.querySelector(".grupo").click();
    }
}

async function obtenerExamen(examen) {
    const main = document.querySelector("main");

    const titulo = document.createElement("h2");
    const codigo = String(examen);
    const curso = codigo.slice(0, 4);
    const edicion = codigo.slice(-1)

    let texto = "📋 ";
    if (edicion == 0) {
        if (curso == 2020) texto += "Julio de ";
        else texto += "Junio de ";
    }
    else if (edicion == 5) {
        if (curso >= 2021) texto += "Julio de ";
        else texto += "Septiembre de ";
    }
    else texto += "Reserva " + edicion + " de ";
    texto += curso;
    titulo.innerText = texto;

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);
    main.append(titulo);

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    for (let ejercicio = 1; ejercicio <= 8; ejercicio++) {
        const codigo = examen * 10 + ejercicio;
        const datosEjercicio = datos.find(dato => dato.ejercicio == codigo);

        let resuelto = false
        let categorias = []
        if (datosEjercicio != undefined) {
            if (datosEjercicio.resuelto) resuelto = true;
            categorias = datosEjercicio.categorias;
        }

        const seccion = await obtenerEjercicio(examen, ejercicio, resuelto, categorias);
        main.append(seccion);
        MathJax.typeset([seccion]);
    }

    return true;
}

async function mostrarExamen(examen) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerExamen(examen).then(() => main.classList.remove("cargando"));
}