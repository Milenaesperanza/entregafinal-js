# Estudoro

Estudoro es una aplicación web interactiva para organizar sesiones de estudio utilizando la técnica Pomodoro. Permite crear una agenda diaria de materias, iniciar bloques de enfoque, realizar descansos y llevar un registro del progreso.

## Proyecto y contexto

Este proyecto fue desarrollado como entrega final del curso de JavaScript de Coderhouse. El objetivo es simular una herramienta de uso cotidiano para estudiantes, aplicando manipulación del DOM, eventos, asincronismo, arrays, persistencia de datos y una librería externa.

## Funcionalidades

- Cargar materias sugeridas desde un archivo JSON mediante `fetch`.
- Agregar materias personalizadas.
- Elegir entre uno y cuatro bloques de estudio.
- Iniciar, pausar y continuar sesiones Pomodoro.
- Alternar automáticamente entre bloques de estudio y descansos.
- Mostrar descansos largos después de completar cuatro bloques.
- Marcar las materias como completadas.
- Eliminar materias con confirmación visual.
- Guardar las materias del día en `localStorage`.
- Guardar y mostrar el nombre del usuario.
- Mostrar mensajes, confirmaciones y notificaciones sin utilizar `alert`, `prompt` ni `confirm` nativos.
- Adaptar la interfaz a dispositivos de distintos tamaños.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- SweetAlert2, incorporada mediante CDN
- Fetch API
- LocalStorage API
- Google Fonts

## Requisitos técnicos de la evaluación

La aplicación cumple los siguientes objetivos técnicos:

- **Manipulación del DOM y eventos:** la interfaz se actualiza dinámicamente a partir de las acciones del usuario.
- **Arrays:** la información de las materias sugeridas se encuentra en `data/plantillas.json` y se obtiene mediante `fetch`. Las materias creadas por el usuario se administran dinámicamente y se persisten en `localStorage`.
- **Lógica del simulador:** el proceso incluye agenda de materias, bloques de estudio, descansos, progreso y finalización.
- **Asincronismo:** se utiliza `async/await` junto con `fetch` y manejo de errores mediante `try/catch`.
- **Métodos de arrays:** se utilizan métodos como `forEach`, `find`, `some` y `filter`.
- **Librería externa:** se utiliza SweetAlert2 para alertas, confirmaciones y notificaciones visuales.
- **Buenas prácticas:** no se utilizan cuadros de diálogo nativos ni mensajes en la consola.

## Cómo ejecutar el proyecto

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Milenaesperanza/entregafinal-js.git
   ```

2. Abrir la carpeta del proyecto en Visual Studio Code.

3. Ejecutar `index.html` utilizando Live Server u otro servidor local.

   También se puede utilizar la extensión Live Server configurada en el puerto `5501`.

> Es necesario utilizar un servidor local para que el navegador permita cargar correctamente `data/plantillas.json` mediante `fetch`.

## Cómo utilizar la aplicación

1. Ingresar el nombre de usuario.
2. Elegir una materia sugerida o seleccionar **Agregar otra**.
3. Indicar la cantidad de bloques de estudio.
4. Presionar el botón de inicio en la materia elegida.
5. Trabajar durante el bloque de enfoque y continuar con el descanso correspondiente.
6. Consultar el progreso desde la lista de materias.
7. Eliminar una materia cuando sea necesario mediante el botón correspondiente.

## Estructura del proyecto

```text
entregafinal-js/
├── index.html
├── README.md
├── assets/
│   ├── estudoro-applogo.png
│   ├── estudoro-favicon.png
│   ├── reloj-dibujo.png
│   └── sounds/
├── css/
│   └── styles.css
├── data/
│   └── plantillas.json
└── js/
    └── app.js
```

## Repositorio

[https://github.com/Milenaesperanza/entregafinal-js]

## Demo

La aplicación puede ejecutarse localmente con Live Server desde `index.html`.

## Deploy

En Github Pages: https://milenaesperanza.github.io/entregafinal-js/