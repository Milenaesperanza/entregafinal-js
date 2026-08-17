// Declaración de las variables que pertenecen a las acciónes que realizan los botones de sugerencias y
// creación del array que se renderizará una vez realizado el click.

const listaMaterias = document.getElementById("lista-materias");

const listaSugerencias = document.querySelector(".sugerencias_lista");

// Creo el DOM del funcionamiento del Reloj, el core de mi app

const dom = {
    reloj: document.querySelector(".reloj"),
    tiempo: document.getElementById("reloj-tiempo"),
    fase: document.getElementById("reloj-fase"),
    estado: document.getElementById("reloj-estado"),
    modal: document.getElementById("modal-materia"),
    formulario: document.getElementById("formulario-materia"),
    campoTitulo: document.getElementById("campo-titulo"),
    campoBloques: document.getElementById("campo-bloques"),
    btnCerrarmodal: document.getElementById("btn-cerrarmodal"),
    btnOtra: document.getElementById("btn-otra")
}

// Declaro que cantidad de tiempo usa el reloj, ya que el pomodoro funciona así, por períodos de tiempo.

const fases = {
    estudio: { nombre: "Estudio", segundos: 1500}, // Eso son 25 minutos
    descanso: {nombre: "Descanso", segundos: 300} // Eso son 5 minutos
}

let fase = "estudio";
let segundos = fases.estudio.segundos;
let corriendo = false;
let intervalo = null

// Creo la funcion que normaliza el formato de los números
function dosDigitos(numero) {
    if (numero<10) {
        return "0" + numero;
    }
    return String(numero);
} 

// Creo la funcion que renderiza el paso del tiempo y su update de estado para el usuario
function dibujar() {
    const minutos = (segundos - (segundos % 60)) / 60;
    dom.tiempo.textContent = `${dosDigitos(minutos)}:${dosDigitos(segundos % 60)}`;
    dom.fase.textContent = fases[fase].nombre;
    dom.estado.textContent = "En pausa";
    if (corriendo) dom.estado.textContent = "";
}

dibujar();

// Ahora implemento las funciones que ejecutan el funcionamiento del reloj (por ahora en consola)

function comenzar() {
    if(corriendo) return;
    corriendo = true;
    intervalo = setInterval(tic, 1000);
    dibujar();
}

function tic() {
    segundos -=1;
    dibujar()
}

function detener() {
    clearInterval(intervalo);
    intervalo = null;
    corriendo = false;
}

// Creo función asincrona que depende del fetch del json que tiene la data para renderizar los botones
async function cargarSugerencias() {
    const respuesta = await fetch("data/plantillas.json");
    const datos = await respuesta.json();
    console.log(respuesta);
    renderizarSugerencias(datos);
}

function renderizarSugerencias(sugerencias) {
    sugerencias.forEach((sugerencia) => {
        const boton = document.createElement("button");
        boton.className = "boton";
        boton.textContent = sugerencia.titulo;

        const item = document.createElement("li"); // cada elemento debe crearse en el mismo tipo que en el html para que siga la misma lógica del maquetado
        item.className = "sugerencia";
        
        boton.addEventListener("click", () => {
            materias.push({
               id: Date.now().toString(),
               titulo: sugerencia.titulo
            });
               guardarMaterias();
               renderizar(); 
        });

        item.appendChild(boton);
        listaSugerencias.insertBefore(item, listaSugerencias.firstChild); //Para que se renderize primero lo de js antes que el botón Otra que están en el html
    });
}

cargarSugerencias();

dom.btnCerrarmodal.addEventListener("click", cerrarFormulario);
dom.btnOtra.addEventListener("click", abrirFormulario);
dom.formulario.addEventListener("submit", guardarMateria);

// Declaro la clave para la persistencia de los datos en localStorage
const CLAVE = "estudoro:materias"

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
                 <span class="tarjeta_vinieta"></span>
                 <span class="tarjeta_nombre"></span>
             </p>
             <p class="tarjeta_indicacion">25 min</p>
          </div>
          <div class="tarjeta_acciones">
             <button class="boton boton_eliminar" type="button">Eliminar</button>
          </div> 
        `;
        item.querySelector(".tarjeta_nombre").textContent = materia.titulo;
        
        //Funcionalidad del boton eliminar para quitar la materia de la lista
        item.querySelector(".boton_eliminar").addEventListener("click", () => {
            console.log("se borra:", materia.id); // Invoca al id que declaré arriba para que no dé undefined y tenga trackeo del evento
            materias = materias.filter ((otraMateria) => otraMateria.id !== materia.id);
            console.log("Restantes:", materias.map((otraMateria) => otraMateria.id));
            guardarMaterias();
            renderizar(); 
        });
        
        listaMaterias.appendChild(item);
    });
}

renderizar();

function abrirFormulario() {
    dom.campoTitulo.value = "";
    dom.campoBloques.value = "1";
    dom.modal.classList.add("modal--abierto");
    dom.campoTitulo.focus();
    console.log("Formulario abierto")
}

function cerrarFormulario() {
    dom.modal.classList.remove("modal--abierto");
    console.log("Formulario cerrado");
}

function guardarMateria(evento) {
    evento.preventDefault();
    const titulo = dom.campoTitulo.value.trim();

    materias.push({
        id: Date.now().toString(),
        titulo,
        bloques: Number(dom.campoBloques.value),
    });
    guardarMaterias();
    cerrarFormulario();
    renderizar();
}