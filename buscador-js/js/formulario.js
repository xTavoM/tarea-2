import { enviarPropuesta } from './api.js';
import { elemento, aviso } from './render.js';
import { aplicarLimites, validarCampo, validarTodo } from './validacion.js';

export function iniciarFormulario(form) {
  const autores = form.querySelector('#autores');
  const agregar = form.querySelector('#agregar-autor');
  const enviar = form.querySelector('[type="submit"]');
  const mensaje = form.querySelector('#propuesta-aviso');
  let secuencia = 0;
  let enviando = false;

  function nuevoAutor() {
    const id = `autor-${++secuencia}`;
    const grupo = elemento('div', 'autor-grupo');
    grupo.dataset.autor = '';
    const datos = elemento('div');
    const label = elemento('label', 'form-label', 'Nombre del autor');
    label.htmlFor = id;
    const input = elemento('input', 'form-control');
    input.id = id;
    input.name = 'autores';
    input.required = true;
    input.maxLength = 100;
    input.setAttribute('aria-describedby', `error-${id}`);
    const error = elemento('small', 'error-campo');
    error.id = `error-${id}`;
    const quitar = elemento('button', 'btn btn-outline-secondary mt-4', 'Quitar autor');
    quitar.type = 'button';
    quitar.dataset.quitarAutor = '';
    datos.append(label, input, error);
    grupo.append(datos, quitar);
    return grupo;
  }

  function limites() {
    agregar.disabled = autores.children.length >= 5;
    for (const boton of autores.querySelectorAll('button')) {
      boton.disabled = autores.children.length <= 1;
    }
  }

  agregar.addEventListener('click', () => {
    if (autores.children.length >= 5) {
      return;
    }

    const grupo = nuevoAutor();
    autores.append(grupo);
    limites();
    grupo.querySelector('input').focus();
  });

  autores.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const boton = event.target.closest('[data-quitar-autor]');
    if (!boton || !autores.contains(boton) || autores.children.length <= 1) {
      return;
    }

    boton.closest('[data-autor]').remove();
    limites();
  });

  form.addEventListener('input', (event) => {
    if (event.target.matches('input, select, textarea')) {
      aplicarLimites(form);
      validarCampo(event.target);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (enviando || !validarTodo(form)) {
      return;
    }

    const datos = new FormData(form);
    const propuesta = Object.fromEntries(datos);
    propuesta.autores = datos.getAll('autores').map((autor) => autor.trim());
    propuesta.titulo = propuesta.titulo.trim();
    propuesta.motivo = propuesta.motivo.trim();
    propuesta.anio = Number(propuesta.anio);
    propuesta.paginas = Number(propuesta.paginas);

    enviando = true;
    enviar.disabled = true;
    aviso(mensaje, 'Enviando propuesta...', 'info');

    try {
      await enviarPropuesta(propuesta);
      aviso(
        mensaje,
        'Propuesta enviada al servicio de pruebas. ¡Gracias por compartir!',
        'success',
      );
      form.reset();
      autores.replaceChildren(nuevoAutor());
      limites();
      for (const campo of form.querySelectorAll('input, select, textarea')) {
        campo.setCustomValidity('');
        campo.classList.remove('is-invalid');
        campo.removeAttribute('aria-invalid');
      }
      for (const error of form.querySelectorAll('.error-campo')) {
        error.textContent = '';
      }
    } catch {
      aviso(
        mensaje,
        'No se pudo enviar. Tus datos siguen aquí para reintentar.',
        'danger',
      );
    } finally {
      enviando = false;
      enviar.disabled = false;
    }
  });

  autores.append(nuevoAutor());
  limites();
  aplicarLimites(form);
}
