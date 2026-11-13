export const ESTADOS = ['Pendiente', 'Leyendo', 'Leído'];

export function avanzarLibros(libros, id) {
  return libros.map((libro) => {
    if (libro.id !== id) {
      return libro;
    }

    const indiceActual = ESTADOS.indexOf(libro.estado);
    const siguienteIndice = (indiceActual + 1) % ESTADOS.length;

    return { ...libro, estado: ESTADOS[siguienteIndice] };
  });
}

export function quitarLibro(libros, id) {
  return libros.filter((libro) => libro.id !== id);
}

export function validarLibro(valores, miembros) {
  const errores = {};

  if (valores.titulo.trim().length < 2) {
    errores.titulo = 'Escribe un título de al menos 2 caracteres.';
  } else if (valores.titulo.length > 180) {
    errores.titulo = 'Usa como máximo 180 caracteres en el título.';
  }

  if (!valores.autor.trim()) {
    errores.autor = 'Indica al menos un autor.';
  } else if (valores.autor.length > 200) {
    errores.autor = 'Usa como máximo 200 caracteres en los autores.';
  }

  if (!miembros.some((miembro) => miembro.id === valores.miembroId)) {
    errores.miembroId = 'Selecciona un miembro del club.';
  }

  return errores;
}
