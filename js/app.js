// Declaración de las variables que pertenecen a las acciónes que realizan los botones de sugerencias y
// creación del array que se renderizará una vez realizado el click.

const botonesSugerencias = document.querySelectorAll(".sugerencias_lista button");
const listaMaterias = document.getElementById("lista-materias");

let materias = []

// Creación de función renderizar que inyecta una materia en el HTML en la sección "Mis materias del día"
// cada vez que hago click en un botón, por orden.

function renderizar() {
    listaMaterias.innerHTML = "";

    materias.forEach((materia) => {
        const item = document.createElement("li")
        item.className = "tarjeta";
        item.textContent = materia.titulo;
        listaMaterias.appendChild(item);
    })
};

// Puesta en marcha de los botones a través de clicks. Cada click agrega una materia al array
// que se renderizará luego en pantalla.

botonesSugerencias.forEach((boton) => {
    boton.addEventListener("click", () => {
        console.log ("click en:", boton.textContent)
        materias.push ({titulo: boton.textContent});
        renderizar();
    })
});