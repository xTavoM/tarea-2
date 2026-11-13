import Modal from 'bootstrap/js/dist/modal';

const PLACEHOLDER = `${import.meta.env.BASE_URL}img/sin-portada.svg`;

// Toda cadena externa se asigna como texto, nunca se interpreta como HTML.
export function elemento(etiqueta, clases = '', texto = '') {
  const nodo = document.createElement(etiqueta);
  nodo.className = clases;
  nodo.textContent = texto;
  return nodo;
}

function boton(texto, clases = 'btn btn-outline-primary btn-sm') {
  const nodo = elemento('button', clases, texto);
  nodo.type = 'button';
  return nodo;
}

function portada(libro) {
  const imagen = elemento('img', 'tarjeta-libro__imagen');
  imagen.src =
    Number.isInteger(libro.portada) && libro.portada > 0
      ? `https://covers.openlibrary.org/b/id/${libro.portada}-M.jpg`
      : PLACEHOLDER;
  imagen.alt = `Portada de ${libro.titulo}`;
  imagen.width = 240;
  imagen.height = 320;
  imagen.loading = 'lazy';
  imagen.addEventListener(
    'error',
    () => {
      imagen.src = PLACEHOLDER;
    },
    { once: true },
  );
  return imagen;
}

export function aviso(contenedor, texto, tipo = 'info') {
  contenedor.replaceChildren(elemento('p', `alert alert-${tipo} mb-0`, texto));
}

export function mostrarResultados(contenedor, libros, alAgregar, alDetalle) {
  const fragmento = document.createDocumentFragment();
  for (const libro of libros) {
    const columna = elemento('div', 'col-12 col-md-6 col-lg-4');
    const tarjeta = elemento('article', 'card tarjeta-libro');
    const cuerpo = elemento('div', 'card-body');
    const titulo = elemento('h3', 'h5 card-title', libro.titulo);
    const autores = elemento(
      'p',
      'small text-secondary mb-0',
      libro.autores.join(', ') || 'Autor no disponible',
    );
    const anio = elemento(
      'p',
      'small',
      `Primera publicación: ${libro.anio ?? 'No disponible'}`,
    );
    const acciones = elemento('div', 'acciones');
    const agregar = boton('+ Mis lecturas', 'btn btn-primary btn-sm');
    const detalle = boton('Ver detalle');
    agregar.addEventListener('click', () => alAgregar(libro));
    detalle.addEventListener('click', () => alDetalle(libro));
    acciones.append(agregar, detalle);
    cuerpo.append(titulo, autores, anio, acciones);
    tarjeta.append(portada(libro), cuerpo);
    columna.append(tarjeta);
    fragmento.append(columna);
  }
  contenedor.replaceChildren(fragmento);
}

export function crearFila(libro) {
  const fila = elemento('tr', 'lectura');
  fila.dataset.id = libro.id;
  const titulo = elemento('th', '', libro.titulo);
  titulo.scope = 'row';
  const estado = elemento('td', '', libro.estado);
  estado.dataset.campo = 'estado';
  const acciones = elemento('td');
  const avanzar = boton('Cambiar estado');
  avanzar.dataset.accion = 'avanzar';
  const quitar = boton('', 'btn btn-outline-danger btn-sm ms-2');
  // El clic en este span también llega al listener delegado de la tabla.
  quitar.append(elemento('span', '', 'Quitar'));
  quitar.dataset.accion = 'quitar';
  acciones.append(avanzar, quitar);
  fila.append(titulo, estado, acciones);
  return fila;
}

export function abrirDetalle(libro) {
  const contenedor = document.querySelector('#detalle');
  document.querySelector('#detalle-titulo').textContent = libro.titulo;
  document
    .querySelector('#detalle-cuerpo')
    .replaceChildren(
      portada(libro),
      elemento('p', 'mt-3', `Autores: ${libro.autores.join(', ') || 'No disponibles'}`),
      elemento('p', '', `Primera publicación: ${libro.anio ?? 'No disponible'}`),
    );
  Modal.getOrCreateInstance(contenedor).show();
}
