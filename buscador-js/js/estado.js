export const ESTADOS = ['Pendiente', 'Leyendo', 'Leído'];
const lecturas = new Map();

export function agregar(libro) {
  if (lecturas.has(libro.id)) {
    return null;
  }

  const lectura = { ...libro, estado: 'Pendiente' };
  lecturas.set(libro.id, lectura);
  return lectura;
}

export function avanzar(id) {
  const libro = lecturas.get(id);
  if (!libro) {
    return null;
  }

  const indiceActual = ESTADOS.indexOf(libro.estado);
  const siguienteIndice = (indiceActual + 1) % ESTADOS.length;
  const estado = ESTADOS[siguienteIndice];
  const actualizado = { ...libro, estado };
  lecturas.set(id, actualizado);
  return actualizado;
}

export function quitar(id) {
  return lecturas.delete(id);
}

export function cantidad() {
  return lecturas.size;
}
