// Declaración de las variables que pertenecen a las acciónes que realizan los botones de sugerencias y
// creación del array que se renderizará una vez realizado el click.

const botonesSugerencias = document.querySelectorAll(".sugerencias_lista button");
const listaMaterias = document.getElementById("lista-materias");

// Declaro la clave para la persistencia de los datos en caché
const CLAVE = "estudoro:materias"

// Puesta en marcha de los botones a través de clicks. Cada click agrega una materia al array
// que se renderizará luego en pantalla.

botonesSugerencias.forEach((boton) => {
    boton.addEventListener("click", () => {
        console.log ("click en:", boton.textContent)
        materias.push ({id: Date.now().toString(), titulo: boton.textContent}); //le doy un id a cada elemento a medida que se suceden los clicks
        guardarMaterias();
        renderizar();
    })
});

// Creo las funciones que van a realizar las acciones que tienen que ver con el guardado y cargado de los arrays
function guardarMaterias() {
    localStorage.setItem(CLAVE, JSON.stringify(materias));
}

function cargarMaterias() {
    const datos = localStorage.getItem(CLAVE);
    if (datos) {
        return JSON.parse(datos);
    }
    return[]
}

// Ahora mi array se llena con lo que carga del localStorage
let materias = cargarMaterias();

// Creación de la función renderizar que inyecta una materia en el HTML en la sección "Mis materias del día"
// cada vez que hago click en el botón, por orden.

function renderizar() {
    listaMaterias.innerHTML = "";

    materias.forEach((materia) => {
        const item = document.createElement("li")
        item.className = "tarjeta";
        item.innerHTML = `
          <div class="tarjeta_cuerpo">
             <p class="tarjeta_titulo">
                 <span class="tarjeta_vineta"></span>
                 <span class="tarjeta_nombre"></span>
             </p>
             <p class="tarjeta_indicacion">25 min</p>
          </div>
          <div class="tarjeta_acciones">
             <button class="boton boton_control" type="button">Play</button>
             <button class="boton boton_eliminar" type="button">Eliminar</button>
          </div> 
        `;
        item.querySelector(".tarjeta_nombre").textContent = materia.titulo;
        
        //Funcionalidad del boton eliminar para quitar la materia de la lista
        item.querySelector(".boton_eliminar").addEventListener("click", () => {
            console.log("se borra:", materia.id); // Invoca al id que declaré arriba para que no dé undefined y tenga trackeo del evento
            console.log("Restantes:", materias.map((m) => m.id));
            materias = materias.filter ((m) => m.id !== materia.id);
            guardarMaterias();
            renderizar(); 
        });
        
        listaMaterias.appendChild(item);
    });
}

renderizar();