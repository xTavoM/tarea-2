import { ESTADOS } from '../../modelo.js';

export function Resumen({ conteos, alcance }) {
  return (
    <section aria-label="Resumen de lecturas" className="resumen">
      <p className="resumen__alcance">{alcance} · Resumen de todos los estados</p>
      <div className="resumen__datos">
        {ESTADOS.map((estado, indice) => (
          <div className={`estadistica tono-${indice}`} key={estado}>
            <span className="estadistica__numero">{conteos[estado]}</span>
            <span>{estado}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
