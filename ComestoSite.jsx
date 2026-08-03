import React, { useState, useEffect, useRef, useCallback, useId } from "react";

/* ===========================================================================
   comesto - sito vetrina (one page + pagine legali)
   File unico. React + Tailwind (solo classi core) + un blocco <style> per
   palette, scala tipografica e le poche animazioni.

   Direzione visiva: minimal chiaro, quasi monocromatico. Titoli in frase con
   tracking stretto, corpo grigio, bottoni quasi neri con angoli morbidi.
   Il colore compare solo dove serve: la luce calda dello specchio e il rosso
   insegna su pochi dettagli. Una sola sezione scura, quella della demo, cosi
   lo specchio e l'unico momento che stacca.

   ---------------------------------------------------------------------------
   META TAG / OPEN GRAPH
   I crawler di WhatsApp e Instagram NON eseguono JavaScript: i tag iniettati
   a runtime da React non vengono letti. Questo blocco va incollato dentro
   <head> nel file index.html statico, altrimenti l'anteprima in chat resta
   vuota. L'immagine og deve essere un URL assoluto e reale (1200x630).

   <title>comesto - il taglio lo vede prima, poi entra</title>
   <meta name="description" content="Il tuo cliente si fa un selfie, sceglie dal tuo menu tagli e si vede col taglio addosso. Tu ricevi un link e un QR. 19,99 euro al mese, primo mese gratis." />
   <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
   <meta name="theme-color" content="#FFFFFF" />
   <link rel="canonical" href="https://<< dominio da inserire >>/" />

   <meta property="og:type" content="website" />
   <meta property="og:site_name" content="comesto" />
   <meta property="og:locale" content="it_IT" />
   <meta property="og:url" content="https://<< dominio da inserire >>/" />
   <meta property="og:title" content="Corto ai lati vuol dire dieci cose diverse" />
   <meta property="og:description" content="Il cliente si vede col taglio addosso prima di sedersi. Tu metti un QR sullo specchio. Primo mese gratis, disdici quando vuoi." />
   <meta property="og:image" content="https://<< dominio da inserire >>/og-comesto.jpg" />
   <meta property="og:image:width" content="1200" />
   <meta property="og:image:height" content="630" />
   <meta property="og:image:alt" content="Uno specchio da barbiere con lo stesso cliente prima e dopo il taglio" />

   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content="Corto ai lati vuol dire dieci cose diverse" />
   <meta name="twitter:description" content="Il cliente si vede col taglio addosso prima di sedersi." />
   <meta name="twitter:image" content="https://<< dominio da inserire >>/og-comesto.jpg" />
   =========================================================================== */

/* ---------------------------------------------------------------- costanti */

const WA_NUMERO = "393714240981";
const WA_TESTO =
  "Ciao, ho visto comesto e vorrei attivare la prova gratuita per la mia barberia.";
const WA_LINK = "https://wa.me/" + WA_NUMERO + "?text=" + encodeURIComponent(WA_TESTO);

// "demo" e lo slug della barberia dimostrativa nel database: cambiando slug
// va aggiornato anche qui, altrimenti il pulsante porta a una pagina vuota.
const DEMO_URL = "https://demo.comesto.me/demo";
const DEMO_E_LOCALE = false;

const PREZZO_MESE = "19,99";
const PREZZO_ANNO = "187,99";
const PREZZO_ANNO_AL_MESE = "15,66";
const PREZZO_AL_GIORNO = "66 centesimi";

/* ------------------------------------------------------------ segnaposto */

function Ph({ children }) {
  return (
    <span className="ph" title="Dato da inserire">
      {"‹‹ " + children + " ››"}
    </span>
  );
}

/* ----------------------------------------------------------------- stili */

const CSS = `
:root{
  --bianco:#FFFFFF;
  --nebbia:#F5F4F1;
  --inchiostro:#17181A;
  --grigio:#6E7176;
  --linea:#E4E2DD;
  --insegna:#D8453B;
  --luce:#FFD9A0;
  --notte:#101215;
  --font-testo:-apple-system,BlinkMacSystemFont,"Segoe UI Variable Display","Segoe UI",Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif;
}

html{ -webkit-text-size-adjust:100%; scroll-behavior:smooth; }
body{
  margin:0; background:var(--bianco); color:var(--inchiostro);
  font-family:var(--font-testo);
  -webkit-font-smoothing:antialiased;
}

.bg-bianco{ background-color:var(--bianco); }
.bg-nebbia{ background-color:var(--nebbia); }
.bg-notte{ background-color:var(--notte); }
.bg-inchiostro{ background-color:var(--inchiostro); }
.bg-bianco-velo{ background-color:rgba(255,255,255,.92); }
.bg-notte-velo{ background-color:rgba(16,18,21,.94); }

.c-inchiostro{ color:var(--inchiostro); }
.c-grigio{ color:var(--grigio); }
.c-bianco{ color:var(--bianco); }
.c-insegna{ color:var(--insegna); }
.c-luce{ color:var(--luce); }
.c-grigio-chiaro{ color:#A6A9AE; }

.b-linea{ border-color:var(--linea); }
.b-notte{ border-color:rgba(255,255,255,.14); }

/* scala tipografica: 13 15 17 20 24 32 42 56 64 */
.t-hero{ font-size:clamp(38px,9.2vw,64px); line-height:1.06; letter-spacing:-.032em; font-weight:600; }
.t-h2{ font-size:clamp(28px,5.8vw,44px); line-height:1.1; letter-spacing:-.028em; font-weight:600; }
.t-h3{ font-size:clamp(19px,4vw,22px); line-height:1.25; letter-spacing:-.014em; font-weight:600; }
.t-lead{ font-size:clamp(17px,4vw,19px); line-height:1.55; }
.t-body{ font-size:17px; line-height:1.6; }
.t-small{ font-size:15px; line-height:1.55; }
.t-micro{ font-size:13px; line-height:1.5; }
.t-occhiello{ font-size:13px; letter-spacing:.02em; font-weight:500; }

.logo{ font-size:20px; font-weight:600; letter-spacing:-.03em; }

.ph{
  background:rgba(216,69,59,.10);
  border-bottom:1px dashed rgba(216,69,59,.65);
  padding:0 .16em;
  border-radius:3px;
  font-style:italic;
}

/* specchio: unico momento decorato della pagina */
.specchio-cornice{
  border:9px solid #DDDBD6;
  border-radius:170px 170px 20px 20px;
  background:linear-gradient(168deg,#F7F6F3 0%,#E9E7E2 58%,#DEDCD6 100%);
  box-shadow:0 1px 0 rgba(255,255,255,.9) inset, 0 22px 50px -24px rgba(23,24,26,.45);
  overflow:hidden;
  position:relative;
  touch-action:none;
}
.specchio-cornice.su-notte{
  border-color:#3A3D42;
  box-shadow:0 0 0 1px rgba(255,255,255,.06), 0 26px 60px -26px rgba(0,0,0,.9);
}
.specchio-alone{
  position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(120% 58% at 50% -10%, rgba(255,217,160,.42) 0%, rgba(255,217,160,.10) 40%, rgba(255,217,160,0) 68%);
}
.lampadina{
  width:13px; height:13px; border-radius:9999px;
  background:radial-gradient(circle at 34% 30%, #FFFCF4 0%, var(--luce) 48%, #D8AE72 100%);
  box-shadow:0 0 10px rgba(255,217,160,.9), 0 0 22px rgba(255,217,160,.5);
  opacity:.3;
  animation:accendi .45s ease-out forwards;
}
@keyframes accendi{ to{ opacity:1; } }

.maniglia{
  position:absolute; top:0; bottom:0; width:44px; margin-left:-22px;
  display:flex; align-items:center; justify-content:center;
  cursor:ew-resize; touch-action:none;
}
.maniglia-barra{ position:absolute; top:0; bottom:0; width:2px; background:rgba(255,255,255,.92); box-shadow:0 0 12px rgba(23,24,26,.35); }
.maniglia-pallino{
  position:relative; width:44px; height:44px; border-radius:9999px;
  background:var(--bianco); color:var(--inchiostro);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 6px 18px rgba(23,24,26,.28), 0 0 0 1px rgba(23,24,26,.08);
  animation:invito 1.6s ease-in-out 1.2s 3;
}
@keyframes invito{
  0%,100%{ transform:translateX(0); }
  35%{ transform:translateX(-8px); }
  65%{ transform:translateX(8px); }
}

.telefono{
  border:7px solid #DDDBD6; border-radius:32px; background:var(--bianco);
  box-shadow:0 18px 40px -22px rgba(23,24,26,.55);
  overflow:hidden; max-width:236px; margin:0 auto;
}

/* misure fuori dalla scala core di Tailwind */
.specchio-basso{ height:286px; }
.specchio-alto{ height:380px; }
.foto-fondatore{ width:156px; height:156px; flex:0 0 156px; }
@media (min-width:640px){
  .specchio-basso{ height:380px; }
  .specchio-alto{ height:500px; }
}

.btn{
  border-radius:12px;
  font-weight:500;
  transition:background-color .15s ease, border-color .15s ease, opacity .15s ease;
}
.btn:hover{ opacity:.88; }
.btn:active{ transform:translateY(1px); }
.link-sottile{ text-decoration:underline; text-underline-offset:3px; text-decoration-thickness:1px; }

.campo{
  border:1px solid var(--linea); border-radius:12px; background:var(--bianco);
  padding:13px 15px; font-size:17px; width:100%; color:var(--inchiostro);
  font-family:var(--font-testo);
}
.campo::placeholder{ color:#A6A9AE; }
.campo:focus{ border-color:var(--inchiostro); outline:none; }

:focus-visible{ outline:2px solid var(--inchiostro); outline-offset:3px; border-radius:4px; }
.su-notte :focus-visible, .bg-notte :focus-visible{ outline-color:var(--luce); }

@media (prefers-reduced-motion: reduce){
  html{ scroll-behavior:auto; }
  .lampadina{ animation:none; opacity:1; }
  .maniglia-pallino{ animation:none; }
  .btn{ transition:none; }
}
`;

function Stili() {
  return <style>{CSS}</style>;
}

/* --------------------------------------------------------------- ritratti
   Illustrazioni vettoriali, non persone reali e non foto stock.
   Vanno sostituite con due scatti veri appena disponibili.            */

function Ritratto({ variante }) {
  const dopo = variante === "dopo";
  const uid = useId().replace(/:/g, "");
  const idSfondo = "sfondo" + uid;
  const idTesta = "testa" + uid;
  return (
    <svg viewBox="0 0 320 420" className="w-full h-full block" role="img"
      aria-label={dopo ? "Illustrazione: stesso viso con taglio sfumato e barba curata" : "Illustrazione: viso con capelli lunghi e disordinati"}>
      <defs>
        <linearGradient id={idSfondo} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dopo ? "#FAF9F7" : "#F1EFEB"} />
          <stop offset="100%" stopColor={dopo ? "#E8E6E1" : "#DFDCD6"} />
        </linearGradient>
        {/* la barba viene ritagliata sulla testa: cosi resta una massa piena
            che segue la mascella, invece di una mezzaluna che sembra un sorriso */}
        <clipPath id={idTesta}>
          <ellipse cx="160" cy="212" rx="76" ry="92" />
        </clipPath>
      </defs>
      <rect width="320" height="420" fill={"url(#" + idSfondo + ")"} />

      {/* spalle */}
      <path d="M42 420c6-58 44-92 118-92s112 34 118 92z" fill={dopo ? "#2A2D33" : "#3A3D43"} />
      <path d="M132 330h56v-38h-56z" fill="#C99A74" />

      {/* testa */}
      <ellipse cx="160" cy="212" rx="76" ry="92" fill="#DCB99B" />
      <ellipse cx="84" cy="216" rx="11" ry="17" fill="#D0AA8B" />
      <ellipse cx="236" cy="216" rx="11" ry="17" fill="#D0AA8B" />

      {/* occhi, sopracciglia, naso */}
      <g fill="#3A2E26">
        <ellipse cx="132" cy="202" rx="6" ry="7" />
        <ellipse cx="188" cy="202" rx="6" ry="7" />
      </g>
      <g stroke="#2E2721" strokeWidth="5" strokeLinecap="round">
        <path d={dopo ? "M120 184h24" : "M119 186h26"} />
        <path d={dopo ? "M176 184h24" : "M175 186h26"} />
      </g>
      <path d="M160 210v20c0 5-4 8-9 9" stroke="#B48A66" strokeWidth="4" fill="none" strokeLinecap="round" />

      {dopo ? (
        <g>
          {/* barba corta: massa piena col bordo superiore curvo, mai una
              mezzaluna sottile (a distanza sembrerebbe una bocca sorridente) */}
          <g clipPath={"url(#" + idTesta + ")"}>
            <path d="M84 212C96 250 126 260 160 260s64-10 76-48v118H84z" fill="#2C241F" />
          </g>
          <path d="M148 276h24" stroke="#7A5140" strokeWidth="4" strokeLinecap="round" />
          {/* taglio corto: calotta che si ferma sopra le orecchie */}
          <path d="M84 178C88 118 118 96 160 96s72 22 76 82c-18-22-44-32-76-32s-58 10-76 32z" fill="#26201C" />
        </g>
      ) : (
        <g>
          {/* barba lunga: stessa massa, ma piu alta sulle guance e prolungata
              sotto il mento con una punta arrotondata */}
          <g clipPath={"url(#" + idTesta + ")"}>
            <path d="M84 196C96 242 126 252 160 252s64-10 76-56v134H84z" fill="#332A22" />
          </g>
          {/* la punta parte da dove la testa e larga uguale, altrimenti sui
              lati resta uno scalino di sfondo */}
          <path d="M110 278c10 74 32 100 50 100s40-26 50-100z" fill="#332A22" />
          <path d="M148 270h24" stroke="#7A5140" strokeWidth="4" strokeLinecap="round" />
          {/* capelli lunghi che coprono le orecchie e scendono sui lati */}
          <path d="M70 220C62 132 100 92 160 92s98 40 90 128c-4-34-10-54-24-64-14 20-36 28-66 24-26-4-44-14-52-28-10 20-24 34-38 44z" fill="#2E2721" />
          <path d="M74 200c-12 34-10 66 2 90-4-36-2-62 8-90z" fill="#2E2721" />
          <path d="M246 200c12 34 10 66-2 90 4-36 2-62-8-90z" fill="#2E2721" />
        </g>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------- specchio */

function Specchio({ compatto, suNotte }) {
  const [pos, setPos] = useState(52);
  const boxRef = useRef(null);
  const trascina = useRef(false);

  const aggiorna = useCallback((clientX) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left - el.clientLeft) / el.clientWidth) * 100;
    setPos(Math.min(98, Math.max(2, p)));
  }, []);

  useEffect(() => {
    function move(e) {
      if (!trascina.current) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      aggiorna(x);
    }
    function su() { trascina.current = false; }
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", su);
    window.addEventListener("touchend", su);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", su);
      window.removeEventListener("touchend", su);
    };
  }, [aggiorna]);

  function giu(e) {
    trascina.current = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    aggiorna(x);
  }

  function tastiera(e) {
    if (e.key === "ArrowLeft") { setPos((p) => Math.max(2, p - 4)); e.preventDefault(); }
    if (e.key === "ArrowRight") { setPos((p) => Math.min(98, p + 4)); e.preventDefault(); }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-3 sm:gap-4 pb-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="lampadina" style={{ animationDelay: 130 * i + "ms" }} />
        ))}
      </div>

      <div
        ref={boxRef}
        className={
          "specchio-cornice w-full " +
          (compatto ? "specchio-basso " : "specchio-alto ") +
          (suNotte ? "su-notte" : "")
        }
        onMouseDown={giu}
        onTouchStart={giu}
      >
        <div className="absolute inset-0">
          <Ritratto variante="dopo" />
        </div>
        {/* stesso ingombro dello strato sotto: il taglio lo fa clip-path, non la
            larghezza, cosi i due ritratti combaciano senza misurare niente */}
        <div className="absolute inset-0" style={{ clipPath: "inset(0 " + (100 - pos) + "% 0 0)" }}>
          <Ritratto variante="prima" />
        </div>

        <div className="specchio-alone" />

        <div className="absolute top-4 left-4 t-micro bg-bianco-velo c-grigio px-2 py-1 rounded-lg">Come arriva</div>
        <div className="absolute top-4 right-4 t-micro bg-inchiostro c-bianco px-2 py-1 rounded-lg">Come esce</div>

        <div
          className="maniglia"
          style={{ left: pos + "%" }}
          role="slider"
          tabIndex={0}
          aria-label="Trascina per confrontare prima e dopo"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={tastiera}
        >
          <span className="maniglia-barra" />
          <span className="maniglia-pallino" aria-hidden="true">
            <svg width="20" height="14" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3 2 8l5 5M15 3l5 5-5 5" />
            </svg>
          </span>
        </div>
      </div>

      <p className={"t-micro pt-3 text-center " + (suNotte ? "c-grigio-chiaro" : "c-grigio")}>
        Illustrazione dimostrativa. Trascina la maniglia.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- componenti */

function Bottone({ children, href, onClick, variante, largo }) {
  const base =
    "btn inline-flex items-center justify-center gap-2 px-6 py-4 t-body text-center " +
    (largo ? "w-full " : "");
  const stile =
    variante === "scuro"
      ? "bg-inchiostro c-bianco"
      : variante === "chiaro"
      ? "bg-bianco c-inchiostro border b-linea"
      : variante === "notte"
      ? "border b-notte c-bianco"
      : "bg-nebbia c-inchiostro border b-linea";
  if (href) {
    return (
      <a href={href} className={base + stile} target={href.indexOf("http") === 0 ? "_blank" : undefined} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={base + stile}>
      {children}
    </button>
  );
}

function Sezione({ id, tono, children, className }) {
  const sfondo =
    tono === "nebbia" ? "bg-nebbia c-inchiostro " :
    tono === "notte" ? "bg-notte c-bianco " :
    "bg-bianco c-inchiostro ";
  return (
    <section id={id} className={sfondo + "px-5 sm:px-8 py-16 sm:py-24 " + (className || "")}>
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}

function Occhiello({ children, scura }) {
  return (
    <p className={"t-occhiello pb-3 " + (scura ? "c-grigio-chiaro" : "c-grigio")}>{children}</p>
  );
}

/* Marchio: l'arco dello specchio da barbiere tagliato a meta, chiaro da un lato
   e luce calda dall'altro. Stesso disegno del favicon in public/favicon.svg:
   se tocchi uno, tocca anche l'altro. */
function Marchio({ misura }) {
  const n = misura || 28;
  // id unico per istanza: due marchi nella stessa pagina non devono
  // condividere lo stesso clipPath
  const idArco = "arcoMarchio" + useId().replace(/:/g, "");
  return (
    <svg width={n} height={n} viewBox="0 0 64 64" aria-hidden="true" className="block">
      <defs>
        <clipPath id={idArco}>
          <path d="M13 31a19 19 0 0 1 38 0v17a5 5 0 0 1-5 5H18a5 5 0 0 1-5-5z" />
        </clipPath>
      </defs>
      <rect width="64" height="64" rx="14" fill="#17181A" />
      <g clipPath={"url(#" + idArco + ")"}>
        <rect x="13" y="12" width="19" height="41" fill="#FFFFFF" />
        <rect x="32" y="12" width="19" height="41" fill="#FFD9A0" />
      </g>
      <circle cx="32" cy="8" r="2.6" fill="#FFD9A0" />
    </svg>
  );
}

function IconaWA() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.4 1.3-1.94 1.34-.5.04-.98.22-3.3-.69-2.78-1.1-4.55-3.94-4.69-4.12-.14-.18-1.12-1.49-1.12-2.84 0-1.35.7-2.01.95-2.29.25-.28.55-.35.73-.35h.52c.17 0 .4-.06.63.48.24.55.8 1.9.87 2.04.07.14.12.3.02.48-.1.18-.15.29-.29.45-.14.16-.3.36-.43.48-.14.14-.29.29-.13.57.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.23 2.23 1.37.28.14.44.12.6-.07.17-.2.7-.81.88-1.09.19-.28.37-.23.63-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.66-.17 1.34z" />
    </svg>
  );
}

/* -------------------------------------------------------------- sezioni */

function BarraAlta() {
  return (
    <header className="sticky top-0 z-40 bg-bianco-velo backdrop-blur border-b b-linea">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 c-inchiostro" aria-label="comesto, torna in cima">
          <Marchio misura={26} />
          <span className="logo">comesto<span className="c-insegna">.</span></span>
        </a>
        <div className="flex items-center gap-5">
          <a href="#prezzi" className="t-small c-grigio hidden sm:inline">Prezzi</a>
          <a href="#demo" className="t-small c-grigio hidden sm:inline">Demo</a>
          <a href="#attiva" className="btn bg-inchiostro c-bianco px-4 py-2 t-small">
            Attiva la prova
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="bg-bianco px-5 sm:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="t-occhiello c-grigio pb-4">Per barberie</p>
            <h1 className="t-hero">
              Corto ai lati vuol dire dieci cose diverse
            </h1>
            <p className="t-lead c-grigio pt-6 max-w-md">
              Selfie, sceglie dal tuo menu tagli, si vede col taglio addosso. Poi entra e sa già cosa vuole.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-8">
              <Bottone href="#attiva" variante="scuro">Attiva la prova gratuita</Bottone>
              <Bottone href="#demo" variante="chiaro">Provala adesso</Bottone>
            </div>
            <p className="t-micro c-grigio pt-5">
              Primo mese gratis. Nessun costo di attivazione. Disdici quando vuoi.
            </p>
          </div>

          <div>
            <Specchio compatto />
          </div>
        </div>
      </div>
    </section>
  );
}

function Problema() {
  const righe = [
    "Ti dice corto ai lati e lunghi sopra. Tu pensi a una sfumatura media, lui aveva in testa una cosa vista su TikTok tre giorni fa.",
    "Te ne accorgi a metà servizio, quando i capelli per terra ci sono già.",
    "Paga, sorride, ti ringrazia. Poi non lo vedi più e non sai nemmeno perché."
  ];
  return (
    <Sezione id="problema" tono="nebbia">
      <Occhiello>Il problema</Occhiello>
      <h2 className="t-h2 max-w-2xl">La faccia che fa allo specchio quando ormai hai tagliato</h2>
      <div className="pt-10 grid gap-6 sm:grid-cols-3">
        {righe.map((r, i) => (
          <div key={i} className="border-t b-linea pt-4">
            <span className="t-micro c-insegna">{"0" + (i + 1)}</span>
            <p className="t-body pt-2">{r}</p>
          </div>
        ))}
      </div>
      <p className="t-lead pt-10 max-w-2xl">
        Non hai sbagliato la mano. Vi siete capiti male prima di iniziare, e a quel punto era già tardi.
      </p>
    </Sezione>
  );
}

function ComeFunziona() {
  const passi = [
    { t: "Inquadra il QR", d: "Sullo specchio, sul biglietto da visita o nel link in bio. Non scarica niente." },
    { t: "Si fa un selfie", d: "Poi sceglie un taglio dal menu, quello che hai deciso tu. Non un catalogo preso da internet." },
    { t: "Si vede col taglio", d: "In pochi secondi. Salva l'immagine e te la manda per prendere l'appuntamento." }
  ];
  return (
    <Sezione id="come">
      <Occhiello>Come funziona</Occhiello>
      <h2 className="t-h2 max-w-2xl">Trenta secondi, dal telefono suo</h2>
      <div className="pt-10 grid gap-8 sm:grid-cols-3">
        {passi.map((p, i) => (
          <div key={i}>
            <div className="w-9 h-9 rounded-full border b-linea c-grigio t-small flex items-center justify-center">
              {i + 1}
            </div>
            <h3 className="t-h3 pt-4">{p.t}</h3>
            <p className="t-body c-grigio pt-2">{p.d}</p>
          </div>
        ))}
      </div>
      <p className="t-small c-grigio pt-10">
        Tu non installi niente e non impari niente. Ricevi un link e un QR già pronti da stampare.
      </p>
    </Sezione>
  );
}

function Demo() {
  return (
    <Sezione id="demo" tono="notte">
      <div className="text-center">
        <Occhiello scura>Provala adesso</Occhiello>
        <h2 className="t-h2">Prima guardala. Poi mettici la tua faccia.</h2>
        <p className="t-lead c-grigio-chiaro pt-5 max-w-xl mx-auto">
          Trascina la maniglia sullo specchio qui sotto. Quando hai capito il meccanismo, apri la demo vera e caricaci una foto tua.
        </p>
      </div>

      <div className="pt-10 max-w-2xl mx-auto">
        <Specchio suNotte />
      </div>

      <div className="pt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Bottone href={DEMO_URL} variante="chiaro">Apri la demo</Bottone>
        <Bottone href="#attiva" variante="notte">Attiva la prova gratuita</Bottone>
      </div>

      {DEMO_E_LOCALE ? (
        <p className="t-micro c-grigio-chiaro pt-5 text-center">
          Il pulsante punta a <Ph>URL pubblico della demo</Ph>, oggi ancora in locale.
        </p>
      ) : null}

      <div className="mt-12 border b-notte rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto">
        <h3 className="t-h3">Quanto è fedele il risultato</h3>
        <p className="t-body c-grigio-chiaro pt-2">
          È uno strumento di consulenza, non una fotografia del futuro. Serve a mettervi d'accordo su lunghezza, volume e forma prima che accendi la macchinetta. La mano poi ce la metti tu, e quella nessun programma la sostituisce.
        </p>
      </div>
    </Sezione>
  );
}

function Guadagno() {
  const voci = [
    {
      t: "Il cliente che non torna",
      d: "Non ti costa un taglio. Ti costa tutti quelli che avrebbe fatto quest'anno: circa ‹‹ scontrino medio ›› per ‹‹ visite all'anno ››."
    },
    {
      t: "La poltrona gira di più",
      d: "La consulenza all'inizio del servizio si chiude in due minuti invece di dieci, perché state guardando la stessa immagine."
    },
    {
      t: "Lo scontrino sale",
      d: "Quando uno si vede già col taglio addosso, osa. Dalla spuntata di sempre passa al lavoro fatto per bene, con la barba."
    },
    {
      t: "Instagram si riempie da solo",
      d: "Ogni prova è un contenuto. Prima e dopo, senza che tu debba fermarti a fotografare tra un cliente e l'altro."
    },
    {
      t: "Un motivo per scegliere te",
      d: "Quello a duecento metri taglia bene come te e costa uguale. Questo però non ce l'ha."
    }
  ];
  return (
    <Sezione id="guadagno" tono="nebbia">
      <Occhiello>Cosa ci guadagni</Occhiello>
      <h2 className="t-h2 max-w-2xl">In poltrone occupate, non in aggettivi</h2>
      <div className="pt-10 grid gap-6 sm:grid-cols-2">
        {voci.map((v, i) => (
          <div key={i} className="border-t b-linea pt-4">
            <h3 className="t-h3">{v.t}</h3>
            <p className="t-body c-grigio pt-2">{v.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-bianco border b-linea rounded-2xl p-6 sm:p-8">
        <h3 className="t-h3">Quando rientri</h3>
        <p className="t-lead c-grigio pt-3">
          {PREZZO_MESE} euro al mese fanno {PREZZO_AL_GIORNO} al giorno, meno di un caffè. Ti basta un cliente all'anno che invece di sparire torna, e sei già sopra: con uno scontrino da <Ph>scontrino medio</Ph> e <Ph>visite all'anno</Ph> visite, quel singolo cliente vale <Ph>valore annuo cliente</Ph>.
        </p>
        <p className="t-small c-grigio pt-4">
          Riempi tu i tre numeri con i tuoi, il conto lo fai in dieci secondi.
        </p>
      </div>
    </Sezione>
  );
}

function FintoTelefono({ accento, nomeInsegna, tagli, fondo, testo, bordo }) {
  return (
    <div className="telefono w-full">
      <div style={{ background: fondo, color: testo }} className="p-4">
        <div className="flex items-center gap-2 pb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center t-micro" style={{ background: accento, color: fondo }}>
            LOGO
          </div>
          <div className="t-micro leading-tight">{nomeInsegna}</div>
        </div>

        <div className="rounded-xl overflow-hidden h-32">
          <Ritratto variante="dopo" />
        </div>

        <div className="t-micro pt-4 pb-2" style={{ opacity: .6 }}>Il menu tagli</div>
        <div className="space-y-2">
          {tagli.map((t, i) => (
            <div
              key={i}
              className="t-micro rounded-lg px-3 py-2"
              style={
                i === 0
                  ? { background: accento, color: fondo }
                  : { border: "1px solid " + bordo }
              }
            >
              {t}
            </div>
          ))}
        </div>

        <div className="t-micro rounded-lg px-3 py-2 mt-3 text-center" style={{ background: accento, color: fondo }}>
          Provalo
        </div>
      </div>
    </div>
  );
}

function TuaApp() {
  return (
    <Sezione id="tuaapp">
      <Occhiello>La brandizzazione</Occhiello>
      <h2 className="t-h2 max-w-2xl">Diventa l'app della tua barberia</h2>
      <p className="t-lead c-grigio pt-5 max-w-2xl">
        Ci mettiamo il tuo logo e i tuoi colori. Soprattutto, il menu tagli lo decidi tu: il cliente prova i tagli che fai davvero, con i nomi che usi in negozio. Per lui non è un programma di qualcun altro, è roba tua.
      </p>

      <div className="pt-12 grid gap-10 sm:grid-cols-2 items-start">
        <div>
          <FintoTelefono
            accento="#D8453B"
            nomeInsegna="La tua insegna"
            fondo="#FFFFFF"
            testo="#17181A"
            bordo="rgba(23,24,26,.14)"
            tagli={["Sfumatura alta", "Taglio a forbice", "Rasoio e contorni", "Barba scolpita"]}
          />
          <p className="t-micro c-grigio pt-4 text-center">I tuoi colori, i tuoi tagli</p>
        </div>
        <div>
          <FintoTelefono
            accento="#C9A227"
            nomeInsegna="Un'altra insegna"
            fondo="#17181A"
            testo="#F2F1EE"
            bordo="rgba(255,255,255,.18)"
            tagli={["Classico a scalare", "Sfumato basso", "Solo barba", "Taglio bambino"]}
          />
          <p className="t-micro c-grigio pt-4 text-center">Stessa app, un'altra barberia</p>
        </div>
      </div>

      <p className="t-small c-grigio pt-12 max-w-2xl">
        Il menu si cambia quando vuoi. Se d'estate spingi su una cosa e d'inverno su un'altra, lo scriviamo su WhatsApp e lo aggiorno io.
      </p>
    </Sezione>
  );
}

function Founding() {
  const punti = [
    "Il prezzo che paghi adesso resta quello per sempre, anche quando per gli altri sale.",
    "Il menu tagli lo costruiamo insieme, guardando il lavoro che fai tu.",
    "Hai il mio numero diretto. Non un modulo di assistenza, non un ticket."
  ];
  return (
    <Sezione id="founding" tono="nebbia">
      <Occhiello>Founding partner</Occhiello>
      <h2 className="t-h2 max-w-2xl">Le prime <Ph>numero posti</Ph> barberie</h2>
      <p className="t-lead c-grigio pt-5 max-w-2xl">
        Sto entrando in un numero chiuso di negozi, uno alla volta, perché ogni barberia che entra mi dice cosa manca e quella cosa la costruisco. Chi arriva dopo trova un prodotto già deciso e un listino diverso.
      </p>
      <ul className="pt-8 space-y-4 max-w-2xl">
        {punti.map((p, i) => (
          <li key={i} className="flex gap-3 border-t b-linea pt-4">
            <span className="c-insegna t-body leading-none pt-1">/</span>
            <span className="t-body">{p}</span>
          </li>
        ))}
      </ul>
      <div className="pt-10">
        <Bottone href="#attiva" variante="scuro">Attiva la prova gratuita</Bottone>
      </div>
    </Sezione>
  );
}

function Prezzi() {
  return (
    <Sezione id="prezzi">
      <Occhiello>Prezzi</Occhiello>
      <h2 className="t-h2">Scritti qui, non dopo un preventivo</h2>

      <div className="pt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border b-linea p-6 sm:p-8">
          <p className="t-occhiello c-grigio">Mese per mese</p>
          <p className="t-hero pt-3">
            {PREZZO_MESE}<span className="t-h3"> euro</span>
          </p>
          <p className="t-small c-grigio">al mese, IVA esclusa</p>
          <p className="t-body c-grigio pt-4">
            Primo mese gratis. Poi decidi tu se continuare, senza dover avvisare nessuno con tre mesi di anticipo.
          </p>
          <div className="pt-6">
            <Bottone href="#attiva" variante="scuro" largo>Attiva la prova gratuita</Bottone>
          </div>
        </div>

        <div className="rounded-2xl border b-linea bg-nebbia p-6 sm:p-8">
          <p className="t-occhiello c-grigio">Un anno intero</p>
          <p className="t-hero pt-3">
            {PREZZO_ANNO}<span className="t-h3"> euro</span>
          </p>
          <p className="t-small c-grigio">all'anno, cioè {PREZZO_ANNO_AL_MESE} al mese</p>
          <p className="t-body c-grigio pt-4">
            Due mesi in regalo rispetto al mensile. Fattura unica, la scarichi e la passi al commercialista una volta sola.
          </p>
          <div className="pt-6">
            <Bottone href="#attiva" variante="chiaro" largo>Attiva la prova gratuita</Bottone>
          </div>
        </div>
      </div>

      <div className="pt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="t-h3">Cosa c'è dentro</h3>
          <ul className="pt-3 space-y-2 t-body c-grigio">
            <li>Prove al mese incluse: <Ph>numero prove</Ph></li>
            <li>Tagli nel menu: <Ph>numero tagli</Ph></li>
            <li>Logo, colori e menu personalizzati</li>
            <li>Link e QR pronti da stampare</li>
            <li>Assistenza WhatsApp <Ph>orari assistenza</Ph></li>
          </ul>
        </div>
        <div>
          <h3 className="t-h3">Cosa non c'è</h3>
          <ul className="pt-3 space-y-2 t-body c-grigio">
            <li>Costo di attivazione</li>
            <li>Vincolo di durata</li>
            <li>Penali di disdetta</li>
            <li>Gestionali da cambiare</li>
          </ul>
          <p className="t-small c-grigio pt-4">
            Fattura elettronica su ogni pagamento. Attivazione entro <Ph>tempi di attivazione</Ph> dalla conferma.
          </p>
        </div>
      </div>
    </Sezione>
  );
}

function Domande() {
  const faq = [
    {
      q: "Con la tecnologia non ci so fare",
      a: "Non devi installare niente e non devi imparare niente. Ti mando un link e un QR già pronti: attacchi il QR allo specchio, il link lo metti in bio su Instagram. Finisce lì il tuo lavoro."
    },
    {
      q: "E se poi non lo usa nessuno",
      a: "Il primo mese è gratis apposta per scoprirlo senza rischiare soldi. Se dopo trenta giorni non ti ha portato niente, disdici e non paghi. Nessun vincolo, nessuna penale."
    },
    {
      q: "I miei clienti sono grandi, non lo useranno mai",
      a: "Allora usalo tu. Tablet in mano all'inizio del servizio, gli fai la foto e gli fai vedere due opzioni. Diventa un pezzo della consulenza, non un compito da dare al cliente."
    },
    {
      q: "Le foto dei miei clienti dove vanno a finire",
      a: "Restano il tempo che serve a generare l'immagine, poi vengono cancellate in automatico. Non le vendiamo, non le passiamo a terzi, non le usiamo per addestrare niente. Trattamento conforme al GDPR, e la privacy policy la trovi in fondo alla pagina."
    },
    {
      q: "Il risultato è realistico",
      a: "Ti dà forma, lunghezza e volume, e serve a mettervi d'accordo prima. Non è una fotografia del taglio finito e non ti dico che lo sia: chi le teste le taglia da vent'anni se ne accorgerebbe in due secondi."
    },
    {
      q: "Ho già il book dei tagli e Instagram",
      a: "Lì vede un modello con la faccia di un altro e pensa che a lui non starebbe bene. Qui vede se stesso. È l'unica differenza, ed è quella che gli fa dire va bene, facciamolo."
    },
    {
      q: "Devo cambiare gestionale o programma degli appuntamenti",
      a: "No. Non tocca niente di quello che usi adesso. Ci si affianca e basta: il cliente ti manda l'immagine e tu prendi l'appuntamento come hai sempre fatto."
    }
  ];
  const [aperta, setAperta] = useState(0);

  return (
    <Sezione id="domande" tono="nebbia">
      <Occhiello>Domande</Occhiello>
      <h2 className="t-h2">Quelle che mi fanno sempre</h2>
      <div className="pt-8">
        {faq.map((f, i) => {
          const attiva = aperta === i;
          return (
            <div key={i} className="border-t b-linea">
              <button
                type="button"
                onClick={() => setAperta(attiva ? -1 : i)}
                aria-expanded={attiva}
                className="w-full text-left py-5 flex items-start justify-between gap-4"
              >
                <span className="t-h3">{f.q}</span>
                <span className="t-h3 c-grigio leading-none pt-1" aria-hidden="true">
                  {attiva ? "–" : "+"}
                </span>
              </button>
              {attiva ? <p className="t-body c-grigio pb-6 max-w-2xl">{f.a}</p> : null}
            </div>
          );
        })}
      </div>
    </Sezione>
  );
}

function ChiSiamo() {
  return (
    <Sezione id="chisiamo">
      <div className="sm:flex sm:gap-10 sm:items-start">
        <div className="foto-fondatore rounded-2xl bg-nebbia border b-linea flex items-center justify-center text-center p-3 mb-8 sm:mb-0">
          <span className="t-micro c-grigio">
            <Ph>foto del fondatore</Ph>
          </span>
        </div>
        <div className="min-w-0">
          <Occhiello>Chi c'è dietro</Occhiello>
          <h2 className="t-h2">Sono <Ph>nome fondatore</Ph></h2>
          <p className="t-body c-grigio pt-4 max-w-2xl">
            Ho fatto comesto dopo aver sentito la stessa scena decine di volte da questa parte della sedia: uno che spiega il taglio con le mani e un barbiere che tira a indovinare. Il problema non era la bravura di nessuno dei due, era che stavano parlando di due cose diverse.
          </p>
          <p className="t-body c-grigio pt-4 max-w-2xl">
            Se qualcosa non va rispondo io, sullo stesso numero WhatsApp che vedi qui sotto. Non c'è un call center in mezzo.
          </p>
          <div className="pt-6">
            <Bottone href={WA_LINK} variante="chiaro">
              <IconaWA /> Scrivimi su WhatsApp
            </Bottone>
          </div>
        </div>
      </div>
    </Sezione>
  );
}

function Attiva() {
  const [dati, setDati] = useState({ nome: "", barberia: "", citta: "", telefono: "" });
  const [errore, setErrore] = useState("");
  const [inviato, setInviato] = useState(false);

  function campo(k, v) {
    setDati((d) => {
      const n = Object.assign({}, d);
      n[k] = v;
      return n;
    });
  }

  function invia() {
    if (!dati.nome.trim() || !dati.barberia.trim() || !dati.citta.trim()) {
      setErrore("Mancano nome, barberia o città.");
      return;
    }
    const tel = dati.telefono.replace(/[^0-9+]/g, "");
    if (tel.length < 8) {
      setErrore("Il numero di telefono non sembra completo.");
      return;
    }
    setErrore("");
    // TODO: collegare qui l'endpoint reale che riceve il contatto.
    setInviato(true);
  }

  function suWhatsapp() {
    const testo =
      "Ciao, voglio attivare la prova gratuita di comesto.\n" +
      "Nome: " + (dati.nome || "-") + "\n" +
      "Barberia: " + (dati.barberia || "-") + "\n" +
      "Città: " + (dati.citta || "-") + "\n" +
      "Telefono: " + (dati.telefono || "-");
    window.open("https://wa.me/" + WA_NUMERO + "?text=" + encodeURIComponent(testo), "_blank");
  }

  return (
    <Sezione id="attiva">
      <div className="max-w-xl mx-auto">
        <Occhiello>Ultimo passo</Occhiello>
        <h2 className="t-h2">Primo mese gratis. Poi vedi tu.</h2>
        <p className="t-lead c-grigio pt-4">
          Lasciami quattro righe e ti richiamo io. Se preferisci scrivere, il pulsante di WhatsApp va bene uguale.
        </p>

        {inviato ? (
          <div className="mt-8 rounded-2xl border b-linea bg-nebbia p-6">
            <h3 className="t-h3">Ricevuto</h3>
            <p className="t-body c-grigio pt-2">
              Ti chiamo entro <Ph>tempi di risposta</Ph>. Se hai fretta scrivimi su WhatsApp adesso, rispondo prima.
            </p>
            <div className="pt-5">
              <Bottone href={WA_LINK} variante="scuro">
                <IconaWA /> Scrivimi su WhatsApp
              </Bottone>
            </div>
          </div>
        ) : (
          <div className="pt-8 space-y-4">
            <div>
              <label htmlFor="f-nome" className="t-small c-grigio">Come ti chiami</label>
              <input id="f-nome" className="campo mt-1" value={dati.nome} onChange={(e) => campo("nome", e.target.value)} placeholder="Nome e cognome" autoComplete="name" />
            </div>
            <div>
              <label htmlFor="f-barberia" className="t-small c-grigio">Nome della barberia</label>
              <input id="f-barberia" className="campo mt-1" value={dati.barberia} onChange={(e) => campo("barberia", e.target.value)} placeholder="Come si chiama il negozio" autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="f-citta" className="t-small c-grigio">Città</label>
              <input id="f-citta" className="campo mt-1" value={dati.citta} onChange={(e) => campo("citta", e.target.value)} placeholder="Dove sei" autoComplete="address-level2" />
            </div>
            <div>
              <label htmlFor="f-tel" className="t-small c-grigio">Telefono</label>
              <input id="f-tel" className="campo mt-1" value={dati.telefono} onChange={(e) => campo("telefono", e.target.value)} placeholder="Numero su cui chiamarti" inputMode="tel" autoComplete="tel" />
            </div>

            {errore ? <p className="t-small c-insegna" role="alert">{errore}</p> : null}

            <div className="pt-2 space-y-3">
              <Bottone onClick={invia} variante="scuro" largo>Attiva la prova gratuita</Bottone>
              <Bottone onClick={suWhatsapp} variante="chiaro" largo>
                <IconaWA /> Mandalo su WhatsApp
              </Bottone>
            </div>

            <p className="t-micro c-grigio pt-2">
              Uso questi dati solo per richiamarti. Niente newsletter, niente liste rivendute. Trattamento dei dati nella{" "}
              <a href="#privacy" className="link-sottile">privacy policy</a>.
            </p>
          </div>
        )}
      </div>
    </Sezione>
  );
}

function Footer() {
  return (
    <footer className="bg-bianco border-t b-linea px-5 sm:px-8 py-12 pb-32 md:pb-12">
      <div className="mx-auto max-w-5xl grid gap-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Marchio misura={30} />
            <p className="logo">comesto<span className="c-insegna">.</span></p>
          </div>
          <p className="t-small c-grigio pt-2 max-w-xs">
            Il taglio se lo vede prima, poi si siede.
          </p>
        </div>

        <div className="t-small c-grigio space-y-1">
          <p className="t-occhiello c-inchiostro pb-2">Azienda</p>
          <p><Ph>ragione sociale</Ph></p>
          <p>Partita IVA <Ph>partita IVA</Ph></p>
          <p><Ph>indirizzo sede</Ph></p>
          <p><a className="link-sottile" href="mailto:info@comesto.it">info@<Ph>dominio</Ph></a></p>
          <p><a className="link-sottile" href={WA_LINK} target="_blank" rel="noreferrer">WhatsApp +39 371 424 0981</a></p>
          <p>Assistenza <Ph>orari assistenza</Ph></p>
        </div>

        <div className="t-small c-grigio space-y-1">
          <p className="t-occhiello c-inchiostro pb-2">Legale</p>
          <p><a className="link-sottile" href="#privacy">Privacy policy</a></p>
          <p><a className="link-sottile" href="#cookie">Cookie policy</a></p>
          <p><a className="link-sottile" href="#termini">Termini e condizioni</a></p>
          <p className="pt-3">Fattura elettronica su ogni pagamento.</p>
        </div>
      </div>
    </footer>
  );
}

function BarraBassa() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bianco-velo backdrop-blur border-t b-linea px-4 py-3">
      <div className="flex gap-3">
        <a href="#attiva" className="btn flex-1 bg-inchiostro c-bianco px-4 py-3 t-body text-center">
          Attiva la prova
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noreferrer"
          aria-label="Scrivi su WhatsApp"
          className="btn px-5 py-3 border b-linea c-inchiostro flex items-center justify-center"
        >
          <IconaWA />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ pagine legali */

const LEGALI = {
  privacy: {
    titolo: "Privacy policy",
    blocchi: [
      ["Chi tratta i tuoi dati", "Il titolare del trattamento è ‹‹ ragione sociale ››, con sede in ‹‹ indirizzo sede ››, partita IVA ‹‹ partita IVA ››. Per qualsiasi richiesta scrivi a ‹‹ email privacy ››."],
      ["Dati del titolare della barberia", "Quando compili il modulo di contatto raccolgo nome, nome del negozio, città e numero di telefono. Li uso solo per richiamarti e per attivare il servizio. Base giuridica: misure precontrattuali su tua richiesta. Li conservo per ‹‹ mesi di conservazione ››, poi li cancello."],
      ["Foto caricate dai clienti finali", "Le immagini caricate nell'applicazione di prova taglio vengono elaborate per generare l'anteprima del taglio e cancellate automaticamente entro ‹‹ tempo di cancellazione ››. Non vengono cedute a terzi, non vengono vendute e non vengono usate per addestrare modelli. Il caricamento avviene su indicazione dell'interessato, che presta il consenso prima dell'invio."],
      ["Fornitori che trattano dati per mio conto", "Per far funzionare il servizio mi appoggio a ‹‹ elenco fornitori: hosting, elaborazione immagini, pagamenti ››. Ognuno è nominato responsabile del trattamento. L'elenco aggiornato è disponibile su richiesta."],
      ["Trasferimenti fuori dall'Unione europea", "‹‹ indicare se esistono trasferimenti extra UE e quali garanzie ››."],
      ["I tuoi diritti", "Puoi chiedere accesso, rettifica, cancellazione, limitazione e portabilità dei dati, e opporti al trattamento. Scrivi a ‹‹ email privacy ››: rispondo entro trenta giorni. Puoi anche presentare reclamo al Garante per la protezione dei dati personali."]
    ]
  },
  cookie: {
    titolo: "Cookie policy",
    blocchi: [
      ["Cosa uso su questo sito", "Questo sito usa solo cookie tecnici necessari a farlo funzionare. Non ci sono cookie di profilazione, non c'è pubblicità comportamentale e non traccio la tua navigazione su altri siti."],
      ["Strumenti di misurazione", "‹‹ indicare se è presente uno strumento di statistiche e se è anonimizzato ››. Se in futuro attivo strumenti non necessari, comparirà un banner con la richiesta di consenso prima di installarli."],
      ["Come cancellarli", "Puoi cancellare o bloccare i cookie dalle impostazioni del tuo browser. Bloccando quelli tecnici alcune parti del sito potrebbero smettere di funzionare."],
      ["Applicazione di prova taglio", "L'applicazione usata dai clienti finali usa ‹‹ elenco cookie o storage tecnici dell'app ››, necessari a mantenere la sessione durante la prova."]
    ]
  },
  termini: {
    titolo: "Termini e condizioni",
    blocchi: [
      ["Oggetto", "‹‹ ragione sociale ›› fornisce in abbonamento un'applicazione web che consente ai clienti di una barberia di visualizzare un'anteprima indicativa di un taglio di capelli su una propria fotografia."],
      ["Prezzi e fatturazione", "L'abbonamento costa " + PREZZO_MESE + " euro al mese oppure " + PREZZO_ANNO + " euro all'anno, IVA esclusa. Il primo mese è gratuito. Su ogni pagamento viene emessa fattura elettronica. Nessun costo di attivazione."],
      ["Durata e disdetta", "L'abbonamento si rinnova automaticamente alla scadenza. Puoi disdire in qualsiasi momento con effetto dalla scadenza del periodo già pagato, senza penali e senza preavviso minimo. Scrivi a ‹‹ email assistenza ›› o sul numero WhatsApp indicato."],
      ["Natura del risultato", "L'anteprima generata è uno strumento di consulenza a scopo indicativo. Non costituisce garanzia del risultato finale del servizio di taglio, che dipende dall'esecuzione del professionista e dalle caratteristiche della persona."],
      ["Obblighi del cliente", "Il titolare della barberia si impegna a informare i propri clienti sull'uso dell'applicazione, a raccogliere il consenso al caricamento della fotografia e a non caricare immagini di terzi senza autorizzazione."],
      ["Disponibilità del servizio", "Il servizio viene erogato con ‹‹ livello di servizio dichiarato ››. Interruzioni per manutenzione programmata vengono comunicate in anticipo."],
      ["Legge e foro", "Il contratto è regolato dalla legge italiana. Foro competente: ‹‹ foro competente ››."]
    ]
  }
};

function PaginaLegale({ chiave }) {
  const p = LEGALI[chiave];
  return (
    <div className="bg-bianco c-inchiostro min-h-screen">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-14 pb-32">
        <a href="#top" className="t-small link-sottile c-grigio">Torna al sito</a>
        <h1 className="t-h2 pt-6">{p.titolo}</h1>
        <p className="t-small c-grigio pt-2">Ultimo aggiornamento: <Ph>data</Ph></p>
        <div className="pt-10 space-y-8">
          {p.blocchi.map((b, i) => (
            <div key={i}>
              <h2 className="t-h3">{b[0]}</h2>
              <p className="t-body c-grigio pt-2">{b[1]}</p>
            </div>
          ))}
        </div>
        <div className="pt-10">
          <Bottone href="#top" variante="chiaro">Torna al sito</Bottone>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- app */

export default function App() {
  const [rotta, setRotta] = useState("");

  useEffect(() => {
    function leggi() {
      const h = (window.location.hash || "").replace("#", "");
      setRotta(LEGALI[h] ? h : "");
      if (LEGALI[h]) window.scrollTo(0, 0);
    }
    leggi();
    window.addEventListener("hashchange", leggi);
    return () => window.removeEventListener("hashchange", leggi);
  }, []);

  useEffect(() => {
    document.title = "comesto - il taglio lo vede prima, poi entra";
  }, []);

  if (rotta) {
    return (
      <div>
        <Stili />
        <PaginaLegale chiave={rotta} />
        <BarraBassa />
      </div>
    );
  }

  return (
    <div className="bg-bianco">
      <Stili />
      <BarraAlta />
      <main>
        <Hero />
        <Problema />
        <ComeFunziona />
        <Demo />
        <Guadagno />
        <TuaApp />
        <Founding />
        <Prezzi />
        <Domande />
        <ChiSiamo />
        <Attiva />
      </main>
      <Footer />
      <BarraBassa />
    </div>
  );
}
