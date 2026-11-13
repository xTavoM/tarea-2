import { ESTADOS } from '../../modelo.js';

export function Filtros({ valor, miembros, onCambiar }) {
  return (
    <div className="filtros">
      <div>
        <label htmlFor="filtro-estado">Estado de lectura</label>
        <select
          id="filtro-estado"
          value={valor.estado}
          onChange={(event) => onCambiar({ ...valor, estado: event.target.value })}
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((estado) => (
            <option key={estado}>{estado}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filtro-miembro">Propuesto por</label>
        <select
          id="filtro-miembro"
          value={valor.miembroId}
          onChange={(event) => onCambiar({ ...valor, miembroId: event.target.value })}
        >
          <option value="">Todo el club</option>
          {miembros.map((miembro) => (
            <option key={miembro.id} value={miembro.id}>
              {miembro.nombre}
            </option>
          ))}
        </select>
      </div>
      <button
        className="boton secundario"
        type="button"
        onClick={() => onCambiar({ estado: '', miembroId: '' })}
      >
        Limpiar filtros
      </button>
    </div>
  );
}
