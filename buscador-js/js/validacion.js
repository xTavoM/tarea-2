export function hoyLocal(ahora = new Date()) {
  return [
    ahora.getFullYear(),
    String(ahora.getMonth() + 1).padStart(2, '0'),
    String(ahora.getDate()).padStart(2, '0'),
  ].join('-');
}

export function aplicarLimites(form) {
  form.elements.anio.max = String(new Date().getFullYear());
  form.elements.fecha.min = hoyLocal();
}

export function validarCampo(campo) {
  campo.setCustomValidity('');
  const texto = campo.value.trim();
  let mensaje = '';

  if (!texto && campo.required) {
    mensaje = 'Completa este campo.';
  } else if (campo.name === 'anio' && Number(texto) > new Date().getFullYear()) {
    mensaje = 'El año de publicación no puede ser futuro.';
  } else if (campo.name === 'fecha' && texto < hoyLocal()) {
    mensaje = 'La sesión debe ser hoy o una fecha posterior.';
  } else if (campo.minLength > 0 && texto.length < campo.minLength) {
    mensaje = `Escribe al menos ${campo.minLength} caracteres, sin espacios de relleno.`;
  } else if (campo.validity.typeMismatch) {
    mensaje = 'Escribe un correo válido.';
  } else if (campo.validity.rangeUnderflow) {
    mensaje = `El valor mínimo es ${campo.min}.`;
  } else if (campo.validity.rangeOverflow) {
    mensaje = `El valor máximo es ${campo.max}.`;
  } else if (campo.validity.stepMismatch || campo.validity.badInput) {
    mensaje = 'Escribe un número entero válido.';
  } else if (campo.validity.tooLong) {
    mensaje = `Usa como máximo ${campo.maxLength} caracteres.`;
  }

  campo.setCustomValidity(mensaje);
  const valido = campo.checkValidity();
  const error = campo.form.querySelector(`#error-${campo.id}`);
  error.textContent = valido ? '' : campo.validationMessage;
  campo.setAttribute('aria-invalid', String(!valido));
  campo.classList.toggle('is-invalid', !valido);
  return valido;
}

export function validarTodo(form) {
  aplicarLimites(form);
  const campos = [...form.querySelectorAll('input, select, textarea')];
  // Primero validamos todos los campos para mostrar todos sus errores.
  const resultados = campos.map(validarCampo);
  if (resultados.includes(false)) {
    campos[resultados.indexOf(false)].focus();
  }

  return resultados.every(Boolean);
}
