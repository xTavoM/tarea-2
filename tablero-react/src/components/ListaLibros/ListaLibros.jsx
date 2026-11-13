import { LibroItem } from './LibroItem.jsx';

export function ListaLibros({ libros, miembros, onAvanzar, onQuitar }) {
  if (!libros.length) {
    return (
      <p className="vacio" role="status">
        No hay libros que coincidan con los filtros. Prueba otra selección o agrega una
        lectura.
      </p>
    );
  }

  return (
    <ul className="libros">
      {libros.map((libro) => (
        <LibroItem
          key={libro.id}
          libro={libro}
          miembro={
            miembros.find((miembro) => miembro.id === libro.miembroId)?.nombre ??
            'Miembro no disponible'
          }
          onAvanzar={onAvanzar}
          onQuitar={onQuitar}
        />
      ))}
    </ul>
  );
}
