export function LibroItem({ libro, miembro, onAvanzar, onQuitar }) {
  return (
    <li className="libro">
      <div className={`libro__lomo estado-${libro.estado}`} aria-hidden="true">
        ec
      </div>
      <div className="libro__contenido">
        <span className="etiqueta">{libro.estado}</span>
        <h3>{libro.titulo}</h3>
        <p>{libro.autor}</p>
        <p className="miembro">Propuesto por {miembro}</p>
        <div className="acciones">
          <button
            className="boton secundario"
            type="button"
            onClick={() => onAvanzar(libro.id)}
          >
            Cambiar estado
          </button>
          <button
            className="boton quitar"
            type="button"
            onClick={() => onQuitar(libro.id)}
          >
            Quitar
          </button>
        </div>
      </div>
    </li>
  );
}
