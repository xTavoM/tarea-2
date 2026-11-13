// children compone contenido diferente dentro de una superficie compartida.
export function Panel({ id, titulo, subtitulo, children }) {
  return (
    <section className="panel" id={id} aria-labelledby={`${id}-titulo`}>
      <div className="cabecera-seccion">
        <h2 id={`${id}-titulo`}>{titulo}</h2>
        <p>{subtitulo}</p>
      </div>
      {children}
    </section>
  );
}
