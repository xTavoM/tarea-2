// Este módulo solo conoce HTTP y datos. No toca elementos de la página.
export async function buscarLibros(texto) {
  const url = new URL('https://openlibrary.org/search.json');
  url.searchParams.set('q', texto.trim());
  url.searchParams.set('limit', '12');

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`Búsqueda: HTTP ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  if (!Array.isArray(datos.docs)) {
    throw new Error('Formato de catálogo inesperado');
  }

  return datos.docs
    .filter((documento) => typeof documento.key === 'string')
    .map((documento) => ({
      id: documento.key,
      titulo: documento.title || 'Título no disponible',
      autores: Array.isArray(documento.author_name) ? documento.author_name : [],
      anio: documento.first_publish_year ?? null,
      portada: documento.cover_i ?? null,
    }));
}

export async function enviarPropuesta(propuesta) {
  const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(propuesta),
  });
  if (!respuesta.ok) {
    throw new Error(`Propuesta: HTTP ${respuesta.status}`);
  }

  return respuesta.json();
}
