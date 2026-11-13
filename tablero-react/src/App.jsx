import { useState } from 'react';
import { miembros, librosIniciales } from './data/libros.js';
import { ESTADOS, avanzarLibros, quitarLibro } from './modelo.js';
import { Panel } from './components/Panel/Panel.jsx';
import { Filtros } from './components/Filtros/Filtros.jsx';
import { Resumen } from './components/Resumen/Resumen.jsx';
import { ListaLibros } from './components/ListaLibros/ListaLibros.jsx';
import { FormularioLibro } from './components/FormularioLibro/FormularioLibro.jsx';

export default function App() {
  const [libros, setLibros] = useState(librosIniciales);
  const [filtros, setFiltros] = useState({ estado: '', miembroId: '' });
  const [mensaje, setMensaje] = useState('');

  // Derivados: se recalculan durante el renderizado. No son estados adicionales.
  const delMiembro = libros.filter(
    (libro) => !filtros.miembroId || libro.miembroId === filtros.miembroId,
  );
  const visibles = delMiembro.filter(
    (libro) => !filtros.estado || libro.estado === filtros.estado,
  );
  const conteos = Object.fromEntries(
    ESTADOS.map((estado) => [
      estado,
      delMiembro.filter((libro) => libro.estado === estado).length,
    ]),
  );
  const nombre =
    miembros.find((miembro) => miembro.id === filtros.miembroId)?.nombre ??
    'Todo el club';

  function agregar(datos) {
    const nuevo = { ...datos, id: crypto.randomUUID(), estado: 'Pendiente' };
    setLibros((actuales) => [...actuales, nuevo]);
    setMensaje(
      `Agregaste «${nuevo.titulo}». Los filtros pueden ocultarlo; usa «Limpiar filtros» para verlo.`,
    );
  }

  function avanzar(id) {
    setLibros((actuales) => avanzarLibros(actuales, id));
    setMensaje('Estado actualizado. La lista y el resumen reflejan el cambio.');
  }

  function quitar(id) {
    setLibros((actuales) => quitarLibro(actuales, id));
    setMensaje('Libro retirado del tablero.');
  }

  return (
    <>
      <nav className="cabecera" aria-label="Navegación principal">
        <div className="contenedor cabecera__contenido">
          <a className="marca" href="#">
            <span className="sello">ec</span> Estantería Común
          </a>
          <div className="enlaces">
            <a href="#tablero">Tablero del club</a>
            <a href="#nuevo-libro">Agregar lectura</a>
          </div>
        </div>
      </nav>
      <main className="contenedor">
        <header className="hero">
          <p className="eyebrow">Nuestro espacio de lectura</p>
          <h1>
            Las historias que
            <br />
            compartimos.
          </h1>
          <p className="intro">
            Organiza las lecturas del club, acompaña el progreso y encuentra la próxima
            conversación.
          </p>
        </header>
        <Panel
          id="tablero"
          titulo="Tablero del club"
          subtitulo={`${libros.length} lecturas en nuestra estantería`}
        >
          <Filtros valor={filtros} miembros={miembros} onCambiar={setFiltros} />
          <Resumen conteos={conteos} alcance={nombre} />
          <p className="aviso" role="status" aria-live="polite">
            {mensaje}
          </p>
          <ListaLibros
            libros={visibles}
            miembros={miembros}
            onAvanzar={avanzar}
            onQuitar={quitar}
          />
        </Panel>
        <Panel
          id="nuevo-libro"
          titulo="Sumemos otra historia"
          subtitulo="Propón un libro para la estantería del club."
        >
          <FormularioLibro miembros={miembros} onAgregar={agregar} />
        </Panel>
      </main>
      <footer className="contenedor">
        Estantería Común · Historias que nos acercan.
        <br />
        Datos locales de demostración. Los cambios se reinician al recargar.
      </footer>
    </>
  );
}
