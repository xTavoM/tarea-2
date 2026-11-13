# Estantería Común · Tarea 2

SOFT-12, Programación Web Avanzada. Dos aplicaciones para el club de lectura: un buscador público con JavaScript, Bootstrap y Sass, y un tablero interno con React y Vite.

## Instalación y ejecución

Requisitos: Node.js 22.12 o posterior, npm y un navegador moderno. Desde la raíz del repositorio:

```sh
npm ci
npm run dev:js
```

Abrir http://127.0.0.1:5173/. En una segunda terminal, desde la misma raíz:

```sh
npm run dev:react
```

Abrir http://127.0.0.1:5174/. Deben ejecutarse mediante estos servidores, no abriendo los HTML con `file://`.

## Compilación de Sass y producción

```sh
npm run sass
npm run sass:watch --workspace buscador-js
npm run build
```

El inicio y build del buscador compilan Sass automáticamente. Durante el desarrollo, ejecutar `sass` después de cambiar SCSS o mantener `sass:watch` en otra terminal. Bootstrap se instala localmente: sus variables de origen se personalizan en `buscador-js/scss/_variables.scss` antes de importar sus parciales en `main.scss`. Los estilos propios incluyen variable, función, mixin y anidamiento. Los avisos de deprecación de la integración Sass de Bootstrap se silencian explícitamente en el script.

El build genera `buscador-js/dist/` y `tablero-react/dist/`. Para revisarlos:

```sh
npm run preview --workspace buscador-js
npm run preview --workspace tablero-react
```

Cada comando se ejecuta en su terminal. Los puertos de producción son 4173 y 4174, respectivamente. Las dependencias y archivos generados se excluyen mediante `.gitignore`.

## Parte A: buscador

Enviar el formulario consulta Open Library por título o autor, con un máximo de 12 resultados. Se distinguen carga, error, vacío y resultados. Las tarjetas muestran título, autores, primera publicación y portada alternativa; «Ver detalle» abre el modal de Bootstrap. Los datos externos se crean con métodos del DOM y `textContent`.

«Mis lecturas» impide duplicados por identificador. «Cambiar estado» recorre Pendiente, Leyendo y Leído; «Quitar» elimina la fila al finalizar su transición. Una sola escucha delegada en el contenedor gestiona ambos botones, incluso al pulsar su contenido interno. Las filas no tienen acciones de clic competidoras: la propagación no dispara otra acción y no requiere `stopPropagation`.

El formulario de propuesta valida título, entre uno y cinco autores dinámicos, año, páginas, género, correo, fecha y motivo. Combina restricciones HTML y la API de validación de restricciones con errores junto a cada campo. El año no puede ser futuro y la sesión no puede ser anterior a la fecha local actual. El envío asincrónico a JSONPlaceholder muestra éxito o error y conserva los datos si falla. Este servicio simula la creación y no guarda propuestas permanentemente.

La grilla, utilidades y componentes Bootstrap incluyen navegación, tarjetas, modal, formulario, alertas y tabla. `.resumen-club` es un componente propio con CSS Grid, variable CSS, unidades relativas y diseño mobile-first. La lista se mantiene únicamente en memoria durante la sesión.

## Parte B: tablero React

Los libros y miembros iniciales están en [src/data/libros.js](tablero-react/src/data/libros.js); esta aplicación no consume APIs. Permite cambiar estados, quitar libros y agregar mediante un formulario controlado con validación por campo.

Los filtros por estado y miembro y el resumen son componentes hermanos. Su estado compartido vive en `App.jsx`. El resumen cuenta todos los estados del miembro seleccionado; el filtro de estado limita la lista, con un mensaje si no hay coincidencias. Los valores derivados se calculan durante el renderizado. Los componentes funcionales usan props, callbacks y `children`, actualizaciones inmutables y keys basadas en identificadores. No manipulan directamente el DOM. Los cambios se reinician al recargar.

## Del DOM manual a React

En la Parte A, [main.js](buscador-js/js/main.js) atiende el clic delegado, encuentra el botón con `closest` y obtiene el identificador de su fila. La función `avanzar` de [estado.js](buscador-js/js/estado.js) calcula y guarda el siguiente estado. Después, el manejador debe localizar la celda y asignar explícitamente `lectura.estado` a su `textContent`, además de activar la animación de [animaciones.js](buscador-js/js/animaciones.js). Cambiar el dato sin escribir también en el nodo dejaría la tabla desactualizada. Las funciones de [render.js](buscador-js/js/render.js) crean los elementos; el controlador mantiene sincronizados datos, filas y contador con actualizaciones precisas.

En la Parte B, [App.jsx](tablero-react/src/App.jsx) recibe la intención mediante una prop de función y llama a `setLibros(actuales => avanzarLibros(actuales, id))`. El `map` de [modelo.js](tablero-react/src/modelo.js) produce un nuevo arreglo y un objeto nuevo para el libro afectado. [LibroItem.jsx](tablero-react/src/components/ListaLibros/LibroItem.jsx) declara `{libro.estado}` en JSX. React procesa el nuevo renderizado y sincroniza la interfaz usando las keys estables. Dejan de ser necesarias la búsqueda de la celda y la asignación manual de su texto: la representación se deriva del estado. La aplicación sigue siendo responsable de sus reglas y de actualizar los datos de forma inmutable. La lista filtrada y los conteos también se derivan en `App.jsx`, sin guardar copias en estados independientes.

## Depuración y comprobaciones

[docs/depuracion.md](docs/depuracion.md) contiene el error localizado con un punto de interrupción, capturas reales, análisis de red y la comparación de rendimiento. Durante la revisión del 29 de octubre de 2026 se ejecutaron 6 pruebas unitarias y 6 pruebas de interfaz, todas satisfactorias, y se compilaron ambas aplicaciones. Se verificaron DOM seguro, modal, duplicados, estados, autores dinámicos, validación, errores HTTP, reintento, filtros y adaptación a 320 px. Las pruebas de interfaz simulan las APIs; la comprobación separada con servicios reales está documentada.

El 12 de noviembre de 2026 se repitieron las 12 pruebas y la compilación de ambas aplicaciones después de organizar el formato, aclarar nombres de variables y separar el cálculo del siguiente estado. Todas finalizaron correctamente. Los nombres de funciones, componentes y controles se conservan.

## Entrega e historial

Repositorio público: [xTavoM/tarea-2](https://github.com/xTavoM/tarea-2). La etiqueta [tarea-2](https://github.com/xTavoM/tarea-2/tree/tarea-2) identifica el commit de entrega. Para ensayar la defensa sin alterar la entrega:

```sh
git switch -c practica-defensa tarea-2
```

El ZIP recibido no incluía `.git`. No se puede autenticar ni reconstruir el requisito de al menos quince commits descriptivos distribuidos durante el período de la tarea. La publicación actual no acredita ese requisito ni una entrega previa al 25 de octubre de 2026 a las 11:55 p. m. No se fabricaron commits ni fechas. Las evidencias publicadas se generaron durante esta revisión; no acreditan autoría o trabajo histórico del estudiante. La defensa y el envío del TXT a Moodle corresponden al estudiante.
