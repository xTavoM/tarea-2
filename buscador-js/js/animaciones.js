export function animarEntrada(fila) {
  fila.classList.add('is-entering');
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      fila.classList.remove('is-entering');
    }),
  );
}

export function animarCambio(fila) {
  fila.classList.remove('is-changed');
  void fila.offsetWidth; // Reinicia la animación, incluso con clics consecutivos.
  fila.classList.add('is-changed');
}

export function animarSalida(fila, alTerminar) {
  let finalizado = false;

  function terminar() {
    if (finalizado) {
      return;
    }

    finalizado = true;
    clearTimeout(respaldo);
    fila.removeEventListener('transitionend', alFin);
    alTerminar();
    fila.remove();
  }

  function alFin(evento) {
    if (evento.target === fila && evento.propertyName === 'opacity') {
      terminar();
    }
  }

  fila.classList.remove('is-changed');
  fila.addEventListener('transitionend', alFin);
  const respaldo = setTimeout(terminar, 450); // CSS: .22s; tolera cancelaciones.
  fila.classList.add('is-leaving');
}
