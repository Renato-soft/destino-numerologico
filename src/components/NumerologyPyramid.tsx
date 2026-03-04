import { motion } from "framer-motion";

interface NumerologyPyramidProps {
  destino: number;
  io: number;
  anima: number;
  persona: number;
  quintessenza: number;
}

const NumerologyPyramid = ({ destino, io, anima, persona, quintessenza }: NumerologyPyramidProps) => {
  return (
    <div className="glass-cosmic rounded-2xl p-6 md:p-8">
      <h2 className="font-display text-xl font-bold mb-6 text-center">Mappa dei Numeri</h2>
      <div className="relative w-full max-w-lg mx-auto" style={{ aspectRatio: "4/3" }}>
        <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Water line */}
          <line x1="40" y1="100" x2="360" y2="100" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
          
          {/* Labels on the line */}
          <text x="200" y="92" textAnchor="middle" className="fill-muted-foreground" fontSize="9" fontStyle="italic">Area di eccellenza (talenti)</text>
          <text x="200" y="140" textAnchor="middle" className="fill-muted-foreground" fontSize="9" fontStyle="italic">Vision / essere</text>

          {/* Pyramid triangle */}
          <polygon 
            points="200,110 120,260 280,260" 
            fill="none" 
            stroke="hsl(var(--primary))" 
            strokeWidth="1.5" 
            opacity="0.6"
          />

          {/* Internal horizontal lines */}
          <line x1="148" y1="185" x2="252" y2="185" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.4" />
          <line x1="133" y1="220" x2="267" y2="220" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.4" />

          {/* Internal labels */}
          <text x="200" y="165" textAnchor="middle" className="fill-muted-foreground" fontSize="8" fontStyle="italic">Sentiero della fortuna</text>
          <text x="200" y="205" textAnchor="middle" className="fill-muted-foreground" fontSize="8" fontStyle="italic">Capacità e carattere</text>
          <text x="200" y="250" textAnchor="middle" className="fill-muted-foreground" fontSize="8" fontStyle="italic">Mission / fare</text>

          {/* QUINTESSENZA - Sun shape at top center */}
          <g>
            {/* Sun rays */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
              <line
                key={angle}
                x1={200 + Math.cos((angle * Math.PI) / 180) * 16}
                y1={55 + Math.sin((angle * Math.PI) / 180) * 16}
                x2={200 + Math.cos((angle * Math.PI) / 180) * 22}
                y2={55 + Math.sin((angle * Math.PI) / 180) * 22}
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />
            ))}
            <circle cx="200" cy="55" r="16" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            <text x="200" y="59" textAnchor="middle" className="fill-primary font-bold" fontSize="13">{quintessenza}</text>
          </g>
          <text x="200" y="30" textAnchor="middle" className="fill-foreground font-display" fontSize="10" fontWeight="600">Quintessenza</text>

          {/* ANIMA - Circle top right */}
          <circle cx="350" cy="75" r="18" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <text x="350" y="80" textAnchor="middle" className="fill-primary font-bold" fontSize="13">{anima}</text>
          <text x="350" y="55" textAnchor="middle" className="fill-foreground font-display" fontSize="10" fontWeight="600">Anima</text>

          {/* PERSONA - Triangle top-right area */}
          <polygon points="350,155 335,180 365,180" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <text x="350" y="175" textAnchor="middle" className="fill-primary font-bold" fontSize="11">{persona}</text>
          <text x="350" y="195" textAnchor="middle" className="fill-foreground font-display" fontSize="10" fontWeight="600">Persona</text>

          {/* IO - Square bottom right */}
          <rect x="335" y="225" width="30" height="30" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <text x="350" y="245" textAnchor="middle" className="fill-primary font-bold" fontSize="13">{io}</text>
          <text x="350" y="270" textAnchor="middle" className="fill-foreground font-display" fontSize="10" fontWeight="600">Io</text>

          {/* DESTINO - Diamond bottom left */}
          <polygon points="50,240 65,225 80,240 65,255" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <text x="65" y="245" textAnchor="middle" className="fill-primary font-bold" fontSize="11">{destino}</text>
          <text x="65" y="270" textAnchor="middle" className="fill-foreground font-display" fontSize="10" fontWeight="600">Destino</text>

          {/* QUINTESSENZA connector left - Balance/scale shape */}
          <circle cx="50" cy="75" r="18" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          {/* Scale arms */}
          <line x1="32" y1="75" x2="68" y2="75" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <line x1="50" y1="57" x2="50" y2="75" stroke="hsl(var(--primary))" strokeWidth="1" />
          {/* Scale pans */}
          <path d="M32,75 Q32,82 38,82" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
          <path d="M68,75 Q68,82 62,82" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

export default NumerologyPyramid;
