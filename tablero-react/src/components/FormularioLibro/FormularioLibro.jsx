import { useState } from 'react';
import { validarLibro } from '../../modelo.js';

const INICIALES = { titulo: '', autor: '', miembroId: '' };

export function FormularioLibro({ miembros, onAgregar }) {
  const [valores, setValores] = useState(INICIALES);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  function cambiar(event) {
    const { name, value } = event.target;
    setValores((actuales) => ({ ...actuales, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: '' }));
  }

  function enviar(event) {
    event.preventDefault();
    const nuevos = validarLibro(valores, miembros);
    setErrores(nuevos);
    if (Object.keys(nuevos).length) {
      setMensaje('Revisa los campos indicados.');
      return;
    }
    onAgregar({
      titulo: valores.titulo.trim(),
      autor: valores.autor.trim(),
      miembroId: valores.miembroId,
    });
    setValores(INICIALES);
    setMensaje('Libro agregado a la estantería.');
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="campos">
        <div>
          <label htmlFor="nuevo-titulo">Título</label>
          <input
            id="nuevo-titulo"
            name="titulo"
            value={valores.titulo}
            onChange={cambiar}
            required
            minLength={2}
            maxLength={180}
            aria-describedby="error-react-titulo"
            aria-invalid={Boolean(errores.titulo)}
          />
          <small id="error-react-titulo" className="error">
            {errores.titulo}
          </small>
        </div>
        <div>
          <label htmlFor="nuevo-autor">Autor o autores</label>
          <input
            id="nuevo-autor"
            name="autor"
            value={valores.autor}
            onChange={cambiar}
            required
            maxLength={200}
            aria-describedby="error-react-autor"
            aria-invalid={Boolean(errores.autor)}
          />
          <small id="error-react-autor" className="error">
            {errores.autor}
          </small>
        </div>
        <div>
          <label htmlFor="nuevo-miembro">Miembro que propone</label>
          <select
            id="nuevo-miembro"
            name="miembroId"
            value={valores.miembroId}
            onChange={cambiar}
            required
            aria-describedby="error-react-miembro"
            aria-invalid={Boolean(errores.miembroId)}
          >
            <option value="">Selecciona un miembro</option>
            {miembros.map((miembro) => (
              <option key={miembro.id} value={miembro.id}>
                {miembro.nombre}
              </option>
            ))}
          </select>
          <small id="error-react-miembro" className="error">
            {errores.miembroId}
          </small>
        </div>
      </div>
      <button className="boton primario" type="submit">
        + Agregar al club
      </button>
      <p className="aviso" role="status" aria-live="polite">
        {mensaje}
      </p>
    </form>
  );
}
