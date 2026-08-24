// Declaración de las variables que pertenecen a las acciónes que realizan los botones de sugerencias y
// creación del array que se renderizará una vez realizado el click.

const listaMaterias = document.getElementById("lista-materias");

const listaSugerencias = document.querySelector(".sugerencias_lista");

const COLORES = ["azul", "rojo", "verde"];

// Creo Variables y Funcion de los toast de confirmación de materias agregadas
const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    timer: 2000,
    showConfirmButton: false,
})

function avisar(mensaje, tipo="info") {
    const iconos = { exito: "success", error: "error", info: "info"};
    return Toast.fire({ title: mensaje, icon: iconos[tipo] });
}

// Creo el DOM del funcionamiento del Reloj, el core de mi app

const dom = {
    pestanias: document.querySelectorAll(".pestanias button"),
    reloj: document.querySelector(".reloj"),
    tiempo: document.getElementById("reloj-tiempo"),
    fase: document.getElementById("reloj-fase"),
    estado: document.getElementById("reloj-estado"),
    foco: document.getElementById("foco-actividad"),
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
    descanso: {nombre: "Descanso", segundos: 300}, // Eso son 5 minutos
    descansoLargo: {nombre:"Descanso largo", segundos:900 } // Eso son 15 minutos
}

// Estado por default del reloj
let fase = "estudio";
let segundos = fases.estudio.segundos;
let corriendo = false;
let intervalo = null;
let materiaId = null;
let bloquesCompletados = 0;

function mostrarVista(nombre) {
    dom.pestanias.forEach((pestania) => {
        const elegida = pestania.id === `btn-${nombre}`;
        pestania.classList.toggle("pestania-activa", elegida);
    });

    document.querySelector(".vista_pomodoro").classList.toggle("vista-oculta", nombre !== "pomodoro");
    document.querySelector(".vista_lista").classList.toggle("vista-oculta", nombre !== "lista");
}

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
    dom.estado.textContent = "";
    if (materiaId && !corriendo) dom.estado.textContent = "En pausa";
    if (materiaId && corriendo) dom.estado.textContent = "Corriendo";
}

dibujar();

function actualizarFoco() {
    const materia = materias.find((m) => m.id === materiaId);
    dom.foco.textContent = materia ? materia.titulo : "Elegí una materia para empezar";
}

// Ahora implemento las funciones que ejecutan el funcionamiento del reloj (por ahora en consola)

function comenzar() {
    if(corriendo) return;
    corriendo = true;
    intervalo = setInterval(tic, 1000);
    dibujar();
}
// Funciones para los bloques Pomodoro
function cambiarFase(nuevaFase) {
    detener();
    fase = nuevaFase;
    segundos = fases[fase].segundos;
    dibujar();
}

function terminarFase() {
    if (fase ==="estudio") {
        bloquesCompletados += 1;
        let materiaTerminada = false;
        if (materiaId) materiaTerminada = completarBloque(materiaId);
        
        if (materiaTerminada) {
            restablecerTemporizador();
            avisar("Completaste la materia", "exito");
            return;
        }

        if (bloquesCompletados === 4) {
            cambiarFase("descansoLargo");
            bloquesCompletados = 0;
        } else {
        cambiarFase("descanso");
        } 
    } else {
        cambiarFase("estudio");
    }
    comenzar();
}

function restablecerTemporizador() {
    detener();
    materiaId = null;
    bloquesCompletados = 0;
    fase = "estudio";
    segundos = fases.estudio.segundos;
    dibujar();
    renderizar();
    actualizarFoco();
}

// Funcionamiento del reloj
function tic() {
    segundos -=1;
    if (segundos <= 0) {
        terminarFase();
        return;
    }
    dibujar()
}

function detener() {
    clearInterval(intervalo);
    intervalo = null;
    corriendo = false;
    dibujar();
}

// Creo función asincrona que depende del fetch del json que tiene la data para renderizar los botones
async function cargarSugerencias() {
    const respuesta = await fetch("data/plantillas.json");
    const datos = await respuesta.json();
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
            const yaExiste = materias.some(
                (materia) => materia.titulo.toLowerCase() === sugerencia.titulo.toLowerCase()
            );

            if (yaExiste) {
                avisar("Esa materia ya está en la agenda", "info");
                return;
            }

            materias.push({
               id: Date.now().toString(),
               titulo: sugerencia.titulo,
               color: COLORES[materias.length % COLORES.length],
               bloques:1,
               bloquesCompletados:0,
               completada: false
            });
               guardarMaterias();
               renderizar();
               avisar("Materia agregada", "exito"); 
        });

        item.appendChild(boton);
        listaSugerencias.insertBefore(item, listaSugerencias.firstChild); //Para que se renderize primero lo de js antes que el botón Otra que están en el html
    });
}

cargarSugerencias();

// Eventos
dom.pestanias.forEach((boton) => {
    boton.addEventListener("click", () => mostrarVista(boton.id.replace("btn-", "")));
});
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

function completarBloque(id) {
    const materia = materias.find((m) => m.id === id);
    materia.bloquesCompletados += 1;
    materia.completada = materia.bloquesCompletados >= materia.bloques;
    guardarMaterias();
    renderizar();
    return materia.completada;
}

// Ahora mi array se llena con lo que carga del localStorage
let materias = cargarMaterias();

function controlarMateria(materia) {
    if (materiaId === materia.id) {
        if (corriendo) {
            detener();
        }
        else {
            comenzar();
        }
        renderizar();
        return;
    }

    if (materiaId) {
        avisar("Terminá o eliminá la materia activa antes de empezar otra", "info");
        return;
    }

    materiaId = materia.id;
    fase = "estudio";
    segundos = fases.estudio.segundos;
    comenzar ();
    renderizar();
    actualizarFoco();
}

// Creación de la función renderizar que inyecta una materia en el HTML en la sección "Mis materias del día"
// cada vez que hago click en el botón, por orden.

function renderizar() {
    listaMaterias.innerHTML = "";

    materias.forEach((materia) => {
        const item = document.createElement("li")
        item.className = `tarjeta tarjeta--${materia.color}`;

        const activa = materiaId === materia.id;
        let textoControl = activa && corriendo ? "Detener" : "Comenzar";
        if (materia.completada) textoControl = "Completada";

        item.innerHTML = `
          <div class="tarjeta_cuerpo">
             <p class="tarjeta_titulo">
                 <span class="tarjeta_vinieta"></span>
                 <span class="tarjeta_nombre"></span>
             </p>
             <p class="tarjeta_indicacion">${materia.bloques * 25}min</p>
          </div>
          <div class="tarjeta_acciones">
             <button class="boton boton_control" type="button" ${materia.completada ? "disabled" : ""}>${textoControl}</button>
             <button class="boton boton_eliminar" type="button">Eliminar</button>
          </div> 
        `;
        item.querySelector(".tarjeta_nombre").textContent = materia.titulo;
        
        item.querySelector(".boton_control").addEventListener("click", () => controlarMateria(materia));
        //Funcionalidad del boton eliminar para quitar la materia de la lista
        item.querySelector(".boton_eliminar").addEventListener("click", () => {
           Swal.fire({  //modal tipo notificación
           title: `¿Eliminar ${materia.titulo}?`,
           icon: "warning",
           showCancelButton: true,
           confirmButtonText: "Sí, eliminar",
           cancelButtonText: "Cancelar"
           }).then((resultado) => {
            if(!resultado.isConfirmed) return;

            if (materiaId === materia.id) {
               restablecerTemporizador();
            }
            
            materias = materias.filter ((otraMateria) => otraMateria.id !== materia.id);
            guardarMaterias();
            renderizar(); 
        });
     });

        listaMaterias.appendChild(item);
    });
}

renderizar();

// Funciones para el formulario del modal

function abrirFormulario() {
    dom.campoTitulo.value = "";
    dom.campoBloques.value = "1";
    dom.modal.classList.add("modal--abierto");
    dom.campoTitulo.focus();
}

function cerrarFormulario() {
    dom.modal.classList.remove("modal--abierto");
}

function guardarMateria(evento) {
    evento.preventDefault();
    const titulo = dom.campoTitulo.value.trim();

    const yaExiste = materias.some(
        (materia) => materia.titulo.toLowerCase() === titulo.toLowerCase()
    );

    if (yaExiste) {
        avisar("Esa materia ya está en la agenda", "info");
        return;
    }

    materias.push({
        id: Date.now().toString(),
        titulo,
        color: COLORES[materias.length % COLORES.length],
        bloques: Number(dom.campoBloques.value),
        bloquesCompletados: 0,
        completada: false,
    });

    guardarMaterias();
    cerrarFormulario();
    renderizar();
    avisar("Materia agregada", "exito")
}