import Collapse from 'bootstrap/js/dist/collapse';
import { buscarLibros } from './api.js';
import { agregar, avanzar, quitar, cantidad } from './estado.js';
import { aviso, mostrarResultados, crearFila, abrirDetalle } from './render.js';
import { animarEntrada, animarCambio, animarSalida } from './animaciones.js';
import { iniciarFormulario } from './formulario.js';

// Importar Collapse registra el comportamiento data-bs-* de la navegación.
void Collapse;
const busqueda = document.querySelector('#busqueda');
const resultados = document.querySelector('#resultados');
const mensaje = document.querySelector('#busqueda-aviso');
const lista = document.querySelector('#lecturas');
const avisoLista = document.querySelector('#lista-aviso');

function actualizarCantidad() {
  document.querySelector('#cantidad').textContent = cantidad();
  document.querySelector('#lista-vacia').hidden = cantidad() !== 0;
  document.querySelector('#tabla-contenedor').hidden = cantidad() === 0;
}

function agregarLectura(libro) {
  const lectura = agregar(libro);
  if (!lectura) {
    aviso(avisoLista, 'Ese libro ya está en tus lecturas.', 'warning');
    return;
  }

  const fila = crearFila(lectura);
  lista.append(fila);
  animarEntrada(fila);
  actualizarCantidad();
  aviso(avisoLista, `Agregaste «${lectura.titulo}».`, 'success');
}

busqueda.addEventListener('submit', async (event) => {
  event.preventDefault();
  const boton = busqueda.querySelector('button');
  if (boton.disabled) {
    return;
  }

  const texto = busqueda.elements.consulta.value.trim();
  if (!texto) {
    mensaje.dataset.estado = 'inicial';
    aviso(mensaje, 'Escribe un título o autor para buscar.', 'warning');
    return;
  }

  boton.disabled = true;
  resultados.setAttribute('aria-busy', 'true');
  mensaje.dataset.estado = 'cargando';
  resultados.replaceChildren();
  aviso(mensaje, 'Buscando en Open Library...', 'info');

  try {
    const libros = await buscarLibros(texto);
    mostrarResultados(resultados, libros, agregarLectura, abrirDetalle);
    aviso(
      mensaje,
      libros.length
        ? `${libros.length} libros para descubrir.`
        : 'No encontramos coincidencias. Prueba otro título o autor.',
      'info',
    );
    mensaje.dataset.estado = libros.length ? 'resultados' : 'vacio';
  } catch {
    mensaje.dataset.estado = 'error';
    aviso(
      mensaje,
      'No pudimos consultar el catálogo. Revisa tu conexión e intenta de nuevo.',
      'danger',
    );
  } finally {
    boton.disabled = false;
    resultados.setAttribute('aria-busy', 'false');
  }
});

// Un solo listener atiende los botones de las filas actuales y futuras.
lista.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const boton = event.target.closest('button[data-accion]');
  if (!boton || !lista.contains(boton)) {
    return;
  }

  const fila = boton.closest('tr[data-id]');
  if (!fila || fila.dataset.saliendo === 'si') {
    return;
  }

  if (boton.dataset.accion === 'avanzar') {
    const lectura = avanzar(fila.dataset.id);
    if (!lectura) {
      return;
    }

    fila.querySelector('[data-campo="estado"]').textContent = lectura.estado;
    animarCambio(fila);
    aviso(avisoLista, `Estado actualizado a ${lectura.estado}.`, 'info');
  } else if (boton.dataset.accion === 'quitar') {
    fila.dataset.saliendo = 'si';
    for (const botonFila of fila.querySelectorAll('button')) {
      botonFila.disabled = true;
    }

    animarSalida(fila, () => {
      quitar(fila.dataset.id);
      actualizarCantidad();
      aviso(avisoLista, 'Libro retirado de tus lecturas.', 'info');
    });
  }
});

iniciarFormulario(document.querySelector('#propuesta'));
