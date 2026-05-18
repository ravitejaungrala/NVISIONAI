import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring,
  animate,
} from 'framer-motion';
import { Check, Plus, Minus, ScanEye, Shield, Building2 } from 'lucide-react';
import Lenis from 'lenis';

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
};

/* ============================================================
   COUNTER
   ============================================================ */
const Counter = ({ to, prefix = '', suffix = '', decimals = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) =>
    `${prefix}${decimals ? Number(v).toFixed(decimals) : Math.round(v).toLocaleString()}${suffix}`,
  );
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: 2, ease: [0.16, 1, 0.3, 1] });
    return c.stop;
  }, [inView, to, mv]);
  return <motion.span ref={ref}>{display}</motion.span>;
};

/* ============================================================
   MOTION — gravity-weighted, ease-based
   ============================================================ */
/* Motion: cinematic but calm — soft rise + faint scale, gravity ease */
const EASE = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 34, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: EASE } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};
const vp = { once: true, amount: 0.2 };

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div className="scrollbar-progress" style={{ scaleX: sx }} />;
};

const Section = ({ id, tone = 'fog', className = '', children, full = false }) => (
  <section id={id} className={tone === 'white' ? 'bg-snow' : 'bg-fog'}>
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={vp}
      variants={fadeUp}
      className={
        full
          ? className
          : `mx-auto max-w-[1200px] px-6 py-14 md:py-20 ${className}`
      }
    >
      {children}
    </motion.div>
  </section>
);

const Kicker = ({ children }) => (
  <span className="text-[20px] font-semibold tracking-[-0.01em] text-orange">
    {children}
  </span>
);

const Head = ({ kicker, title, sub, center = false, light = false }) => (
  <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
    {kicker && <Kicker>{kicker}</Kicker>}
    <h2
      className={`font-serif mt-3 text-[40px] leading-[1.08] font-bold tracking-[-0.02em] md:text-[56px] ${
        light ? 'text-white' : 'text-ink'
      }`}
    >
      {title}
    </h2>
    {sub && (
      <p
        className={`mt-5 max-w-xl text-[20px] leading-[1.4] font-light tracking-[-0.01em] ${
          center ? 'mx-auto' : ''
        } ${light ? 'text-white/70' : 'text-muted'}`}
      >
        {sub}
      </p>
    )}
  </div>
);

const BuyPill = ({ children = 'Book a demo', dark = false, className = '' }) => (
  <a
    href="#cta"
    className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-[17px] font-normal transition-opacity duration-150 hover:opacity-85 ${
      dark ? 'bg-obsidian text-white' : 'bg-orange text-white'
    } ${className}`}
  >
    {children}
  </a>
);

/* ============================================================
   NAVIGATION — global bar + sticky product sub-nav
   ============================================================ */
const Nav = () => {
  const links = [
    ['Solutions', '#solutions'],
    ['Platform', '#platform'],
    ['Pricing', '#pricing'],
    ['Market', '#market'],
  ];
  return (
    <div className="fixed inset-x-0 top-0 z-50 nav-pill">
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-6 md:px-8">
        <span className="font-serif text-[21px] font-bold tracking-[-0.02em] text-ink">
          Nvision<span className="text-orange">AI</span>
        </span>
        <div className="hidden items-center gap-9 md:flex">
          {links.map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="text-[15px] font-medium text-ink/80 transition-colors hover:text-orange"
            >
              {l}
            </a>
          ))}
        </div>
        <a
          href="#cta"
          className="group inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(255,69,0,0.6)] transition-all duration-200 hover:-translate-y-0.5"
        >
          Get early access
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            ›
          </span>
        </a>
      </div>
    </div>
  );
};

/* ============================================================
   HERO
   ============================================================ */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  return (
    <section
      ref={ref}
      id="top"
      className="mesh-bg relative overflow-hidden px-6 pt-32 pb-24"
    >
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[1.02fr_1.18fr]">
        {/* left — narrative */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-steel bg-snow/70 px-4 py-1.5 text-[12px] font-semibold tracking-[0.14em] text-orange uppercase backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            Enterprise Computer Vision
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.85, ease: EASE }}
            className="font-serif mt-6 text-[12vw] leading-[1.02] font-bold tracking-[-0.022em] text-ink md:text-[68px]"
          >
            <span className="text-gradient">Vision Intelligence</span>
            <br />
            for Insurance &amp; Banking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
            className="mt-6 max-w-xl text-[19px] leading-[1.5] text-muted"
          >
            One AI platform — trained on millions of financial-services images —
            automating claims, fraud detection, security monitoring, and
            collateral verification at scale.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.34, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#solutions"
              className="group inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-[16px] font-semibold text-white shadow-[0_16px_36px_-14px_rgba(255,69,0,0.55)] transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore Solutions
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <a
              href="#platform"
              className="glass rounded-full px-7 py-3.5 text-[16px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              View Platform
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.48, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-semibold tracking-[0.08em] text-muted uppercase"
          >
            {['SOC 2 Type II', 'GLBA', 'PCI DSS', 'FFIEC Ready'].map((b, i) => (
              <span key={b} className="flex items-center gap-3">
                {i > 0 && <span className="h-3 w-px bg-steel" />}
                {b}
              </span>
            ))}
          </motion.div>
        </div>

        {/* right — live evidence panel (dominant media) */}
        <motion.div
          style={{ y: imgY, scale: imgScale }}
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: EASE }}
        >
          <LiveVisionPanel />
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================================
   LIVE VISION PANEL — simulated computer-vision analysis,
   mirrors the product: claims · fraud · security · collateral
   ============================================================ */
const ART = {
  car: (
    <g>
      <path d="M30 150 L62 110 Q70 100 84 98 L150 90 Q165 89 178 99 L210 124 L300 138 Q314 140 314 154 L314 168 Q314 174 308 174 L34 174 Q26 174 26 166 L26 156 Q26 151 30 150 Z" fill="#e9e9ef" stroke="#c2c2cb" strokeWidth="3" />
      <path d="M86 104 L146 98 L150 128 L74 128 Z" fill="#fff" stroke="#c2c2cb" strokeWidth="2.5" />
      <path d="M156 99 L196 104 L214 128 L156 128 Z" fill="#fff" stroke="#c2c2cb" strokeWidth="2.5" />
      <circle cx="98" cy="176" r="24" fill="#fff" stroke="#1d1d1f" strokeWidth="4" />
      <circle cx="98" cy="176" r="9" fill="#c8c8d0" />
      <circle cx="256" cy="176" r="24" fill="#fff" stroke="#1d1d1f" strokeWidth="4" />
      <circle cx="256" cy="176" r="9" fill="#c8c8d0" />
      <path d="M292 128 l16 -12 -6 18 18 -6 -12 16 16 4 -18 8" fill="none" stroke="#ff4500" strokeWidth="4" strokeLinejoin="round" />
    </g>
  ),
  house: (
    <g>
      <path d="M40 124 L150 50 L260 124 Z" fill="#e9e9ef" stroke="#c2c2cb" strokeWidth="3" />
      <rect x="66" y="124" width="168" height="96" fill="#fff" stroke="#c2c2cb" strokeWidth="3" />
      <rect x="130" y="166" width="40" height="54" fill="#e9e9ef" stroke="#c2c2cb" strokeWidth="2.5" />
      <rect x="90" y="146" width="30" height="28" fill="#eef" stroke="#c2c2cb" strokeWidth="2.5" />
      <rect x="180" y="146" width="30" height="28" fill="#eef" stroke="#c2c2cb" strokeWidth="2.5" />
      <rect x="196" y="70" width="20" height="34" fill="#e9e9ef" stroke="#c2c2cb" strokeWidth="2.5" />
      {[[108, 92], [150, 78], [196, 100]].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="6" fill="#ff4500" />
      ))}
    </g>
  ),
  worker: (
    <g>
      <circle cx="120" cy="58" r="22" fill="#fff" stroke="#1d1d1f" strokeWidth="3" />
      <path d="M120 80 L120 96 L150 110 L150 176 Q150 184 142 184 L98 184 Q90 184 90 176 L90 110 L120 96" fill="#ff4500" opacity="0.92" />
      <path d="M150 118 L176 150 M90 118 L64 150" stroke="#1d1d1f" strokeWidth="9" strokeLinecap="round" />
      <path d="M104 184 L100 224 M136 184 L140 224" stroke="#1d1d1f" strokeWidth="9" strokeLinecap="round" />
      <path d="M96 44 Q120 18 144 44" fill="none" stroke="#ff4500" strokeWidth="3.5" strokeDasharray="6 6" />
    </g>
  ),
  truck: (
    <g>
      <rect x="24" y="78" width="150" height="96" rx="6" fill="#e9e9ef" stroke="#c2c2cb" strokeWidth="3" />
      <path d="M174 104 L222 104 L262 140 L262 174 L174 174 Z" fill="#fff" stroke="#c2c2cb" strokeWidth="3" />
      <path d="M222 110 L252 138 L222 138 Z" fill="#eef" stroke="#c2c2cb" strokeWidth="2.5" />
      <circle cx="78" cy="180" r="22" fill="#fff" stroke="#1d1d1f" strokeWidth="4" />
      <circle cx="78" cy="180" r="8" fill="#c8c8d0" />
      <circle cx="222" cy="180" r="22" fill="#fff" stroke="#1d1d1f" strokeWidth="4" />
      <circle cx="222" cy="180" r="8" fill="#c8c8d0" />
      <path d="M40 60 L40 40 M60 60 L60 30 M80 60 L80 44" stroke="#ff4500" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  atm: (
    <g>
      <rect x="66" y="26" width="108" height="188" rx="12" fill="#e9e9ef" stroke="#c2c2cb" strokeWidth="3" />
      <rect x="84" y="44" width="72" height="52" rx="5" fill="#1d1d1f" />
      <rect x="92" y="54" width="40" height="6" rx="3" fill="#fff" opacity="0.6" />
      <rect x="92" y="66" width="56" height="6" rx="3" fill="#fff" opacity="0.35" />
      <rect x="92" y="120" width="56" height="9" rx="3" fill="#fff" stroke="#c2c2cb" strokeWidth="2" />
      <rect x="92" y="140" width="40" height="9" rx="3" fill="#fff" stroke="#c2c2cb" strokeWidth="2" />
      <circle cx="148" cy="178" r="10" fill="#fff" stroke="#c2c2cb" strokeWidth="2.5" />
      <rect x="86" y="114" width="68" height="22" rx="4" fill="none" stroke="#16a34a" strokeWidth="4" />
    </g>
  ),
  doc: (
    <g>
      <path d="M64 20 L160 20 L196 56 L196 220 L64 220 Z" fill="#fff" stroke="#c2c2cb" strokeWidth="3" />
      <path d="M160 20 L160 56 L196 56" fill="#e9e9ef" stroke="#c2c2cb" strokeWidth="3" />
      <path d="M84 88 L176 88 M84 110 L176 110 M84 132 L150 132" stroke="#cdcdd5" strokeWidth="6" strokeLinecap="round" />
      <path d="M86 178 q16 -22 30 0 t30 -2 q10 -8 18 2" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  asset: (
    <g>
      <path d="M30 96 L150 38 L270 96 L270 110 L30 110 Z" fill="#e9e9ef" stroke="#c2c2cb" strokeWidth="3" />
      <rect x="44" y="110" width="212" height="108" fill="#fff" stroke="#c2c2cb" strokeWidth="3" />
      <rect x="70" y="138" width="58" height="80" fill="#eef" stroke="#c2c2cb" strokeWidth="2.5" />
      <rect x="148" y="138" width="58" height="80" fill="#eef" stroke="#c2c2cb" strokeWidth="2.5" />
      <circle cx="226" cy="78" r="24" fill="#16a34a" />
      <path d="M214 78 l8 9 16 -18" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  vault: (
    <g>
      <rect x="48" y="34" width="194" height="180" rx="14" fill="#e9e9ef" stroke="#c2c2cb" strokeWidth="3" />
      <circle cx="145" cy="124" r="62" fill="#fff" stroke="#c2c2cb" strokeWidth="3" />
      <circle cx="145" cy="124" r="44" fill="none" stroke="#cdcdd5" strokeWidth="3" />
      <circle cx="145" cy="124" r="14" fill="#c8c8d0" />
      <path d="M145 62 L145 44 M145 204 L145 186 M83 124 L65 124 M225 124 L207 124" stroke="#1d1d1f" strokeWidth="6" strokeLinecap="round" />
      <circle cx="210" cy="62" r="20" fill="#16a34a" />
      <path d="M200 62 l7 8 14 -16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
};

const SceneArt = ({ kind }) => (
  <svg
    viewBox="0 0 300 240"
    className="h-full w-full"
    preserveAspectRatio="xMidYMid meet"
  >
    {ART[kind]}
  </svg>
);

const ORANGE = '#ff4500';
const GREEN = '#16a34a';
const SCENES = [
  // ── INSURANCE ──
  {
    vertical: 'Insurance', module: 'ClaimsVision', label: 'Vehicle damage',
    conf: '0.93', kind: 'car', color: ORANGE,
    box: { l: '14%', t: '30%', w: '42%', h: '46%' },
    metrics: { fraud: '0.93', sev: 'High', claims: '10,000', fnol: 'Done' },
  },
  {
    vertical: 'Insurance', module: 'PropertyInspect', label: 'Roof / hail damage',
    conf: '0.84', kind: 'house', color: ORANGE,
    box: { l: '20%', t: '22%', w: '54%', h: '52%' },
    metrics: { fraud: '0.18', sev: 'Low', claims: '10,240', fnol: 'Done' },
  },
  {
    vertical: 'Insurance', module: 'SafetyWatch', label: 'PPE missing',
    conf: '0.88', kind: 'worker', color: ORANGE,
    box: { l: '50%', t: '20%', w: '30%', h: '60%' },
    metrics: { fraud: '0.41', sev: 'Med', claims: '10,470', fnol: 'Review' },
  },
  {
    vertical: 'Insurance', module: 'FleetProtect', label: 'Unsafe following',
    conf: '0.79', kind: 'truck', color: ORANGE,
    box: { l: '12%', t: '32%', w: '70%', h: '46%' },
    metrics: { fraud: '0.27', sev: 'Med', claims: '10,690', fnol: 'Alert' },
  },
  // ── BANKING ──
  {
    vertical: 'Banking', module: 'BankGuard', label: 'Skimmer detected',
    conf: '0.96', kind: 'atm', color: GREEN,
    box: { l: '32%', t: '34%', w: '36%', h: '40%' },
    metrics: { fraud: '0.96', sev: 'High', claims: '10,910', fnol: 'Alert' },
  },
  {
    vertical: 'Banking', module: 'DocuVerify', label: 'Forged signature',
    conf: '0.91', kind: 'doc', color: GREEN,
    box: { l: '30%', t: '14%', w: '42%', h: '72%' },
    metrics: { fraud: '0.91', sev: 'High', claims: '11,120', fnol: 'Flag' },
  },
  {
    vertical: 'Banking', module: 'AssetMonitor', label: 'Collateral verified',
    conf: '0.97', kind: 'asset', color: GREEN,
    box: { l: '14%', t: '22%', w: '70%', h: '56%' },
    metrics: { fraud: '0.08', sev: 'Low', claims: '11,340', fnol: 'Done' },
  },
  {
    vertical: 'Banking', module: 'VaultWatch', label: 'Access authorized',
    conf: '0.99', kind: 'vault', color: GREEN,
    box: { l: '24%', t: '16%', w: '50%', h: '66%' },
    metrics: { fraud: '0.04', sev: 'Low', claims: '11,560', fnol: 'Done' },
  },
];

// alternate Insurance ↔ Banking so both verticals show immediately
const SEQ = [0, 4, 1, 5, 2, 6, 3, 7];

const LiveVisionPanel = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((p) => (p + 1) % SEQ.length), 3200);
    return () => clearInterval(id);
  }, []);
  const i = SEQ[step];
  const s = SCENES[i];
  const metricDefs = [
    ['Fraud score', s.metrics.fraud],
    ['Severity', s.metrics.sev],
    ['Claims / hr', s.metrics.claims],
    ['Auto-FNOL', s.metrics.fnol],
  ];

  return (
    <div className="overflow-hidden rounded-[28px] bg-snow p-6 md:p-10">
      <div className="flex items-center justify-between border-b border-steel pb-5">
        <div className="flex items-center gap-3">
          <ScanEye
            size={18}
            style={{ color: s.color }}
            className="transition-colors duration-300"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.module}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5"
            >
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-[0.12em] text-white uppercase"
                style={{ background: s.color }}
              >
                {s.vertical}
              </span>
              <span className="text-[14px] font-semibold text-ink">
                {s.module}
              </span>
              <span className="text-[13px] text-muted">· live</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-fog px-3 py-1 text-[12px] font-semibold tracking-wide text-ink">
          <motion.span
            className="h-2 w-2 rounded-full"
            style={{ background: s.color }}
            animate={{ opacity: [1, 0.25, 1], scale: [1, 0.8, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          ANALYZING
        </span>
      </div>

      {/* vertical · module stepper */}
      <div className="mt-5 flex items-center gap-6">
        {['Insurance', 'Banking'].map((vName) => {
          const grp = SCENES.map((sc, idx) => [sc, idx]).filter(
            ([sc]) => sc.vertical === vName,
          );
          const accent = vName === 'Banking' ? GREEN : ORANGE;
          return (
            <div key={vName} className="flex items-center gap-2.5">
              <span
                className={`text-[11px] font-bold tracking-[0.12em] uppercase transition-opacity ${
                  s.vertical === vName ? 'opacity-100' : 'opacity-35'
                }`}
                style={{ color: accent }}
              >
                {vName}
              </span>
              <div className="flex gap-1.5">
                {grp.map(([, idx]) => (
                  <span
                    key={idx}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === idx ? 22 : 8,
                      background: i === idx ? accent : '#d8d8dd',
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CV detection viewport */}
      <div className="relative mt-6 h-[230px] overflow-hidden rounded-[18px] border border-steel bg-[linear-gradient(0deg,#fafafa,#fff)]">
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(#eee 1px,transparent 1px),linear-gradient(90deg,#eee 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* scanned subject — centered, framed by the detection box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={s.kind}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute left-1/2 top-1/2 h-[64%] w-[44%] -translate-x-1/2 -translate-y-1/2"
          >
            <SceneArt kind={s.kind} />
          </motion.div>
        </AnimatePresence>
        {/* sweeping scan line */}
        <motion.div
          className="absolute inset-y-0 z-10 w-px bg-orange/70"
          style={{ boxShadow: '0 0 18px 3px rgba(82,102,235,0.35)' }}
          animate={{ left: ['4%', '96%', '4%'] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* HUD corner brackets */}
        {[
          'left-3 top-3 border-l-2 border-t-2',
          'right-3 top-3 border-r-2 border-t-2',
          'left-3 bottom-3 border-l-2 border-b-2',
          'right-3 bottom-3 border-r-2 border-b-2',
        ].map((c) => (
          <span
            key={c}
            className={`absolute h-5 w-5 border-ink/25 ${c}`}
          />
        ))}
        {/* detection box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute left-1/2 top-1/2 h-[74%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-md"
            style={{
              border: `2px solid ${s.color}`,
              boxShadow: `0 0 0 1px ${s.color}22, inset 0 0 24px ${s.color}1a`,
            }}
          >
            <span
              className="absolute -top-[26px] left-0 whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-semibold text-white"
              style={{ background: s.color }}
            >
              {s.label} · {s.conf}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* live metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {metricDefs.map(([k, v]) => (
          <div
            key={k}
            className="rounded-[16px] border border-steel bg-fog p-4"
          >
            <div className="text-[11px] font-medium tracking-wide text-muted uppercase">
              {k}
            </div>
            <div className="mt-1 h-[34px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={v}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="font-serif text-[26px] font-bold tracking-[-0.02em] text-ink"
                >
                  {v}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   PAGE
   ============================================================ */
const NvisionAI = () => {
  useLenis();
  const [activeTab, setActiveTab] = useState('insurance');
  const [openFaq, setOpenFaq] = useState(0);
  const [activePlatform, setActivePlatform] = useState(0);

  // sticky-reveal footer: content scrolls up over a fixed footer
  const footerRef = useRef(null);
  const [footerH, setFooterH] = useState(560);
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const update = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setFooterH(h);
    };
    update();
    const t1 = setTimeout(update, 300);
    const t2 = setTimeout(update, 1200);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('load', update);
    };
  }, []);

  const solutions = {
    insurance: {
      title: 'Insurance',
      mainTitle: 'Insurance Vision Intelligence',
      mainDesc:
        'Automate claims processing, fraud detection, and property inspection across every line of business.',
      items: [
        { t: 'Auto Claims', c: 'Accident detection, severity classification, staged fraud identification, automated FNOL.', m: '10,000 claims/hour · 95% fraud detection' },
        { t: 'Property Inspection', c: 'Drone and photo analysis for roof, hail, water, fire and storm damage.', m: '100 roofs/day vs 8-10 · 80% cost reduction' },
        { t: 'Workers Compensation', c: 'Workplace accident detection, PPE compliance, injury severity classification.', m: 'Fraudulent claims −30% · Real-time alerts' },
        { t: 'Commercial Fleet', c: 'Driver behavior monitoring — distraction, following distance, load security.', m: 'Samsara, Lytx, Geotab ready' },
      ],
      integrations: ['Guidewire', 'Duck Creek', 'Mitchell', 'CCC', 'Snapsheet', 'Majesco'],
    },
    banking: {
      title: 'Banking',
      mainTitle: 'Banking Vision Intelligence',
      mainDesc:
        'Enhance physical security, detect ATM fraud, and monitor high-value collateral automatically.',
      items: [
        { t: 'ATM & Branch Security', c: 'Detect loitering, card skimmers and suspicious behavior at 24/7 terminals.', m: '99% monitoring uptime · Global' },
        { t: 'KYC & Document Fraud', c: 'Automated verification of identity documents and deepfake detection.', m: 'Sub-2s verification · Compliant' },
        { t: 'Collateral Verification', c: 'Remote monitoring of inventory, real-estate assets and construction progress.', m: 'Real-time tracking · 40% faster appraisals' },
        { t: 'Vault & Cash Ops', c: 'Secure monitoring of cash-in-transit and vault access with visual auth.', m: 'Audit-ready logs · Zero breaches' },
      ],
      integrations: ['Jack Henry', 'FIS', 'Fiserv', 'nCino', 'Salesforce', 'Infor'],
    },
  };

  const platformItems = [
    { title: 'ClaimsVision', type: 'Insurance', desc: 'Auto accident detection and claims automation, positioned for enterprise insurance.', list: ['Accident detection & classification', 'Severity assessment scoring', 'Staged fraud identification', 'Automated FNOL generation'] },
    { title: 'PropertyInspect', type: 'Insurance', desc: 'Drone and aerial imagery analysis for P&C property claims assessment.', list: ['Roof damage detection', 'Hail & storm damage scoring', 'Water & fire classification', 'Pre/post loss comparison'] },
    { title: 'SafetyWatch', type: 'Insurance', desc: 'Workplace safety monitoring for workers compensation and PPE compliance.', list: ['Accident detection from CCTV', 'PPE compliance monitoring', 'Injury severity scoring', 'Ergonomic risk assessment'] },
    { title: 'BankGuard', type: 'Banking', desc: 'ATM and branch perimeter security with real-time behavioral detection.', list: ['Skimming device detection', 'Loitering & threat behavior', 'Cash-in-transit monitoring', 'Evidence auto-compilation'] },
    { title: 'DocuVerify', type: 'Banking', desc: 'AI-powered document fraud detection for check processing and KYC.', list: ['Check forgery detection', 'ID document verification', 'Signature matching AI', 'Fraud ring pattern analysis'] },
    { title: 'AssetMonitor', type: 'Banking', desc: 'Collateral and construction loan monitoring via drone and on-site imagery.', list: ['Construction draw verification', 'Equipment lease tracking', 'Property condition scoring', 'Agricultural asset monitoring'] },
  ];

  const insurancePlans = [
    { name: 'Starter', price: '$2,500', desc: '500 claims/month. For small insurers and MGAs getting started.', features: ['500 claims per month', 'Email support', 'ClaimsVision (auto)', 'Standard dashboard'], btn: 'Get started' },
    { name: 'Professional', price: '$7,500', popular: true, desc: '2,000 claims/month with phone support and API for regional carriers.', features: ['2,000 claims per month', 'Phone + email support', 'Full API access', '+PropertyInspect', '+SafetyWatch'], btn: 'Get started' },
    { name: 'Enterprise', price: '$25K+', desc: 'Unlimited claims, dedicated CSM and custom ML training.', features: ['Unlimited claims', 'Dedicated CSM', 'Custom ML training', 'All modules included', 'SLA-guaranteed uptime'], btn: 'Contact sales' },
  ];

  const bankingPlans = [
    { name: 'BankGuard', price: '$150', cycle: '/ATM/mo', desc: 'or $500/branch/mo · Min. 10 locations', tone: 'orange' },
    { name: 'DocuVerify', price: '$0.10', cycle: '/document', desc: 'Min. 5,000 docs/mo · Volume discounts', tone: 'green' },
    { name: 'AssetMonitor', price: '$50', cycle: '/asset/yr', desc: 'Min. 20 assets · Enterprise custom pricing', tone: 'orange' },
  ];

  const testimonials = [
    { q: 'NvisionAI cut our auto-claims cycle time by 70% in the first quarter. The fraud detection alone paid for the platform.', n: 'VP Claims, Regional P&C Carrier', t: 'Insurance' },
    { q: 'We deployed BankGuard across 240 ATMs. Skimmer detection that used to take days now takes seconds.', n: 'Head of Physical Security, Regional Bank', t: 'Banking' },
    { q: 'PropertyInspect lets two adjusters cover what previously took a full team. The ROI was obvious in the pilot.', n: 'Director of Field Ops, MGA', t: 'Insurance' },
  ];

  const gtm = [
    {
      tag: 'Insurance', sub: 'Strongest play — 3-6 month cycles',
      steps: [
        ['Entry Point', "'Free accident analysis for your top 10 disputed claims' — value in days, not months."],
        ['Pilot', '90-day trial processing 500-1,000 claims with full ROI tracking and reporting.'],
        ['Expansion', 'Full platform API integration + upsell PropertyInspect and SafetyWatch.'],
        ['Target Segments', 'Regional/mid-market insurers ($500M-$5B premiums), MGAs/TPAs, fleet specialists.'],
      ],
    },
    {
      tag: 'Banking', sub: 'Higher barrier, higher value',
      steps: [
        ['Entry Point', "'Free security audit of 1 month of ATM footage' — prove detection before commitment."],
        ['Pilot', '30-day trial on 10-20 ATMs/branches with documented incident detection vs. manual.'],
        ['Expansion', 'Multi-location rollout + add DocuVerify and AssetMonitor for construction loans.'],
        ['Target Segments', 'Regional banks ($1B-$50B assets), credit unions, fintech equipment lenders.'],
      ],
    },
  ];

  const tam = [
    {
      icon: <Shield size={18} />, title: 'Insurance Opportunities',
      market: 'Total Addressable Market: $83B', tone: 'orange',
      rows: [['Auto Claims Processing', '$35M'], ['P&C Inspection', '$16M'], ['Workers Compensation', '$15M'], ['Fleet Insurance', '$25M']],
      sum: '$91M',
    },
    {
      icon: <Building2 size={18} />, title: 'Banking Opportunities',
      market: 'Total Addressable Market: $16B', tone: 'green',
      rows: [['ATM & Branch Security', '$14M'], ['Fraud Detection', '$17M'], ['Construction Monitoring', '$9.6M'], ['Collateral Verification', '$3M']],
      sum: '$43.6M',
    },
  ];

  const competitors = [
    { n: '01', name: 'Tractable', v: 'Auto Damage AI', weak: 'UK-based, expensive, slow US integration', adv: 'US-based, faster deployment, better pricing' },
    { n: '02', name: 'Snapsheet', v: 'Mobile Claims', weak: 'Limited AI depth, workflow-only focus', adv: 'Deeper AI analysis + fraud detection' },
    { n: '03', name: 'Mitchell / CCC', v: 'Auto Valuation', weak: 'Legacy systems, not AI-native', adv: 'Modern API-first, AI-native platform' },
    { n: '04', name: 'NICE', v: 'Surveillance', weak: 'General purpose, expensive, complex', adv: 'Banking-specific, simpler, faster ROI' },
    { n: '05', name: 'Feedzai', v: 'Banking Fraud', weak: 'Payment fraud only, no physical security', adv: 'Combined physical + document fraud' },
    { n: '06', name: 'Verafin', v: 'AML / Fraud', weak: 'No computer vision capability', adv: 'Video/image analysis = new fraud vectors' },
  ];

  const faqs = [
    ['How fast is deployment?', 'Insurance pilots run a 90-day trial processing 500–1,000 claims with full ROI tracking. Banking deployments start with a 30-day audit on 10–20 ATMs/branches before multi-location rollout.'],
    ['Does it integrate with our existing systems?', 'Yes. We are API-first with native connectors for Guidewire, Duck Creek, Mitchell, CCC, Jack Henry, FIS, Fiserv, nCino, Salesforce and more.'],
    ['How are the models trained?', 'On 10M+ financial-services-specific images — not generic computer vision. Enterprise tiers include custom ML model training on your own data.'],
    ['Is it compliant?', 'NvisionAI is SOC 2 Type II, GLBA, PCI DSS and FFIEC ready, with audit-ready logging across every module.'],
    ['What does pricing look like?', 'Insurance uses a SaaS subscription model by claim volume. Banking uses a per-location hybrid model. Enterprise pricing is custom.'],
  ];

  const active = platformItems[activePlatform];

  return (
    <div className="relative bg-obsidian">
      <ScrollProgress />
      <Nav />

      {/* page content — scrolls up over the fixed footer */}
      <div
        className="relative z-10 overflow-hidden rounded-b-[40px] bg-fog shadow-[0_40px_60px_-30px_rgba(0,0,0,0.5)]"
        style={{ marginBottom: footerH }}
      >
        <main>
          <Hero />

        {/* STATS — glassy box */}
        <Section tone="white" className="!py-10">
          <div className="glassy grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
            {[
              { v: <Counter to={95} suffix="%" />, l: 'Fraud detection accuracy' },
              { v: <Counter to={10000} />, l: 'Claims processed / hour' },
              { v: <Counter to={70} suffix="%" />, l: 'Less manual review' },
              { v: <Counter to={134} prefix="$" suffix="M+" />, l: 'Addressable opportunity' },
            ].map((s, i) => (
              <div key={i} className="bg-cool/60 px-6 py-7 text-center">
                <div className="font-serif text-[38px] leading-none font-bold tracking-[-0.02em] text-ink md:text-[44px]">
                  {s.v}
                </div>
                <div className="mt-2 text-[13px] text-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* SOLUTIONS — compact, single screen */}
        <Section id="solutions" tone="white">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            {/* sticky narrative */}
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <Kicker>Solutions</Kicker>
              <h2 className="font-serif mt-4 text-[40px] leading-[1.06] font-bold tracking-[-0.02em] text-ink md:text-[52px]">
                Built for your{' '}
                <span className="text-gradient">vertical</span>
              </h2>
              <div className="mt-7 inline-flex rounded-full border border-steel p-1">
                {Object.keys(solutions).map((id) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`rounded-full px-6 py-2 text-[14px] font-semibold transition-colors ${
                      activeTab === id
                        ? 'bg-orange text-white'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {solutions[id].title}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-7 max-w-sm text-[16px] leading-[1.6] text-muted"
                >
                  {solutions[activeTab].mainDesc}
                </motion.p>
              </AnimatePresence>
              <div className="mt-8">
                <div className="text-[11px] font-bold tracking-[0.16em] text-muted uppercase">
                  Integrates with
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[14px] font-medium text-charcoal">
                  {solutions[activeTab].integrations.map((int) => (
                    <span key={int}>{int}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* editorial item list */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.34, ease: EASE }}
                className="border-t border-ink/15"
              >
                {solutions[activeTab].items.map((it, i) => (
                  <div
                    key={it.t}
                    className="group flex items-start gap-5 border-b border-steel py-5"
                  >
                    <span className="font-mono text-[12px] tabular-nums text-muted pt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="font-serif text-[19px] font-bold tracking-[-0.02em] text-ink">
                          {it.t}
                        </h4>
                        <span
                          className={`shrink-0 text-[12px] font-semibold ${
                            activeTab === 'banking' ? 'text-green' : 'text-orange'
                          }`}
                        >
                          {it.m}
                        </span>
                      </div>
                      <p className="mt-1.5 max-w-lg text-[13px] leading-[1.5] text-muted">
                        {it.c}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </Section>

        {/* PLATFORM — compact, single screen */}
        <Section id="platform" tone="fog" className="!py-16">
          <Head
            center
            kicker="The platform"
            title="Six solutions. One platform."
          />
          <div className="mt-14 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            {/* editorial index list */}
            <div className="border-t border-steel">
              {platformItems.map((p, i) => {
                const on = activePlatform === i;
                return (
                  <button
                    key={p.title}
                    onClick={() => setActivePlatform(i)}
                    className="group flex w-full items-center gap-5 border-b border-steel py-4 text-left"
                  >
                    <span
                      className={`font-mono text-[13px] tabular-nums transition-colors ${
                        on ? 'text-ink' : 'text-muted'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-serif flex-1 text-[20px] font-bold tracking-[-0.02em] transition-all duration-300 ${
                        on
                          ? 'translate-x-1 text-ink'
                          : 'text-muted group-hover:text-ink'
                      }`}
                    >
                      {p.title}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                        on
                          ? p.type === 'Banking'
                            ? 'bg-green scale-150'
                            : 'bg-orange scale-150'
                          : 'bg-steel'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* large spotlight */}
            <div className="relative">
              <span className="font-serif pointer-events-none absolute -top-10 right-0 select-none text-[180px] font-bold leading-none text-ink/[0.04]">
                {String(activePlatform + 1).padStart(2, '0')}
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePlatform}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="relative"
                >
                  <span
                    className={`text-[13px] font-semibold tracking-[0.16em] uppercase ${
                      active.type === 'Banking' ? 'text-green' : 'text-orange'
                    }`}
                  >
                    {active.type}
                  </span>
                  <h3 className="font-serif mt-3 text-[44px] leading-[1.05] font-bold tracking-[-0.02em] text-ink md:text-[56px]">
                    {active.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-[18px] leading-[1.55] text-muted">
                    {active.desc}
                  </p>
                  <div className="mt-9 grid gap-x-10 gap-y-px sm:grid-cols-2">
                    {active.list.map((li) => (
                      <div
                        key={li}
                        className="flex items-center gap-3 border-b border-steel py-4 text-[15px] text-ink"
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            active.type === 'Banking' ? 'bg-green' : 'bg-orange'
                          }`}
                        />
                        {li}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {/* Unified Value Proposition */}
          <div className="mt-10 rounded-[28px] border border-steel bg-snow p-9 md:p-12">
            <h3 className="font-serif text-[26px] font-bold tracking-[-0.02em] text-ink">
              Unified Value Proposition
            </h3>
            <p className="mt-4 max-w-3xl text-[18px] leading-[1.5] text-charcoal">
              “One AI platform, trained on 10M+ financial-services images,
              reducing manual review by 70% across claims, security, and
              compliance use cases.”
            </p>
          </div>
        </Section>

        {/* UNIFIED STATEMENT — dark focal band */}
        <section className="bg-fog px-6 py-6">
          <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-night px-8 py-24 md:px-16 md:py-28">
            {/* brand glow */}
            <div
              className="pointer-events-none absolute -top-28 -left-20 h-80 w-80 rounded-full blur-[120px]"
              style={{ background: 'rgba(255,69,0,0.28)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full blur-[130px]"
              style={{ background: 'rgba(22,163,74,0.22)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div>
                <span className="text-[14px] font-semibold tracking-[0.18em] text-orange uppercase">
                  Two verticals · One platform
                </span>
                <h2 className="font-serif mt-5 text-[40px] leading-[1.05] font-bold tracking-[-0.02em] text-white md:text-[64px]">
                  Insurance and banking,{' '}
                  <span className="text-gradient">unified.</span>
                </h2>
                <p className="mt-6 max-w-lg text-[18px] leading-[1.55] text-white/65">
                  One vision platform — trained on 10M+ financial-services
                  images — cutting manual review by 70% across claims, fraud,
                  security and collateral.
                </p>
                <div className="mt-9">
                  <BuyPill dark>Book a demo</BuyPill>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10">
                {[
                  ['10M+', 'Training images'],
                  ['70%', 'Less manual review'],
                  ['8', 'Specialized modules'],
                  ['2', 'Financial verticals'],
                ].map(([v, l]) => (
                  <div key={l} className="bg-white/[0.03] px-7 py-9">
                    <div className="font-serif text-[34px] font-bold tracking-[-0.02em] text-white [font-variant-numeric:tabular-nums]">
                      {v}
                    </div>
                    <div className="mt-1.5 text-[13px] tracking-[0.04em] text-white/55 uppercase">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* PRICING — white band */}
        <Section id="pricing" tone="white">
          <Head
            center
            kicker="Pricing"
            title="Simple, scalable pricing"
            sub="Insurance: SaaS subscription. Banking: per-location hybrid model."
          />
          {/* insurance — editorial tier ledger (hairline columns, no cards) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="mt-12 grid overflow-hidden rounded-2xl border border-steel md:grid-cols-3"
          >
            {insurancePlans.map((p, idx) => (
              <div
                key={p.name}
                className={`flex flex-col p-9 ${
                  idx > 0 ? 'border-t border-steel md:border-t-0 md:border-l' : ''
                } ${p.popular ? 'bg-cool/60' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-[0.14em] text-muted uppercase">
                    {p.name}
                  </span>
                  {p.popular && (
                    <span className="rounded-full bg-orange px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-white uppercase">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="mt-7 flex items-end gap-1.5">
                  <span className="font-serif text-[46px] font-bold leading-none tracking-[-0.02em] text-ink [font-variant-numeric:tabular-nums]">
                    {p.price}
                  </span>
                  <span className="mb-1.5 text-[14px] text-muted">/mo</span>
                </div>
                <p className="mt-4 text-[14px] leading-[1.55] text-muted">
                  {p.desc}
                </p>
                <ul className="mt-7 flex-1 space-y-3.5 border-t border-steel pt-7">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-[14px] text-charcoal"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-orange"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className={`mt-9 inline-flex items-center justify-center rounded-full py-3 text-[15px] font-semibold transition-colors ${
                    p.popular
                      ? 'bg-orange text-white hover:opacity-90'
                      : 'border border-ink/20 text-ink hover:border-ink/50'
                  }`}
                >
                  {p.btn}
                </a>
              </div>
            ))}
          </motion.div>

          {/* banking — per-location, inline hairline row */}
          <div className="mt-16">
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-bold tracking-[0.16em] text-muted uppercase">
                Banking — Per-location model
              </span>
              <span className="h-px flex-1 bg-steel" />
            </div>
            <div className="mt-2 grid md:grid-cols-3">
              {bankingPlans.map((p, idx) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between gap-6 py-7 md:flex-col md:items-start md:gap-3 md:px-8 ${
                    idx > 0
                      ? 'border-t border-steel md:border-t-0 md:border-l'
                      : 'md:pl-0'
                  }`}
                >
                  <div className="text-[12px] font-bold tracking-[0.12em] text-orange uppercase">
                    {p.name}
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="font-serif text-[34px] font-bold leading-none tracking-[-0.02em] text-ink [font-variant-numeric:tabular-nums]">
                      {p.price}
                    </span>
                    <span className="mb-1 text-[14px] text-muted">
                      {p.cycle}
                    </span>
                  </div>
                  <p className="hidden text-[13px] leading-[1.5] text-muted md:block">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* MARKET OPPORTUNITY — white band */}
        <Section id="market" tone="white">
          <Head
            kicker="Market opportunity"
            title="$134M+ combined revenue potential"
            sub="At minimal market share across both verticals."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="mt-10 grid gap-6 lg:grid-cols-2"
          >
            {tam.map((g) => {
              const accent = g.tone === 'green' ? 'text-green' : 'text-orange';
              return (
                <motion.div
                  key={g.title}
                  variants={item}
                  className="glass overflow-hidden p-8 md:p-10"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl text-white ${
                        g.tone === 'green' ? 'bg-green' : 'bg-orange'
                      }`}
                    >
                      {g.icon}
                    </span>
                    <div>
                      <div className="font-serif text-[22px] font-bold tracking-[-0.02em] text-ink">
                        {g.title}
                      </div>
                      <div className="mt-0.5 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">
                        {g.market}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    {(() => {
                      const vals = g.rows.map(([, v]) =>
                        parseFloat(v.replace(/[^0-9.]/g, '')),
                      );
                      const max = Math.max(...vals);
                      return g.rows.map(([l, v], idx) => (
                        <div key={l}>
                          <div className="flex items-baseline justify-between">
                            <span className="text-[13px] tracking-[0.02em] text-charcoal">
                              {l}
                            </span>
                            <span className="font-serif text-[18px] font-bold tracking-[-0.02em] text-ink [font-variant-numeric:tabular-nums]">
                              {v}
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-cool">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{
                                width: `${(vals[idx] / max) * 100}%`,
                              }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.9,
                                delay: 0.1 + idx * 0.08,
                                ease: EASE,
                              }}
                              className={`h-full rounded-full ${
                                g.tone === 'green' ? 'bg-green' : 'bg-orange'
                              }`}
                            />
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                  <div className="mt-7 flex items-end justify-between border-t-2 border-ink/10 pt-6">
                    <span className="text-[12px] font-bold tracking-[0.18em] text-muted uppercase">
                      Total opportunity
                    </span>
                    <span
                      className={`font-serif text-[34px] font-bold leading-none tracking-[-0.02em] [font-variant-numeric:tabular-nums] ${accent}`}
                    >
                      {g.sum}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </Section>

        {/* COMPETITIVE — fog band */}
        <Section tone="fog">
          <Head
            kicker="Competitive landscape"
            title="Where NvisionAI wins"
            sub="Purpose-built for financial services vs. generic incumbents."
          />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="mt-10 border-t border-ink/15"
          >
            {competitors.map((c, i) => {
              const open = openFaq === i;
              return (
                <div key={c.n} className="border-b border-steel">
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="flex w-full items-center gap-5 py-5 text-left"
                  >
                    <span className="font-mono text-[12px] tabular-nums text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-serif flex-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
                      {c.name}
                    </span>
                    <span className="hidden text-[13px] text-muted sm:block">
                      {c.v}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft px-3 py-1 text-[11px] font-bold tracking-[0.06em] text-green uppercase">
                      <Check size={12} /> Win
                    </span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-steel transition-transform duration-300 ${
                        open ? 'rotate-45 border-orange text-orange' : 'text-muted'
                      }`}
                    >
                      <Plus size={14} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 pb-7 pl-8 md:grid-cols-2 md:pl-10">
                          <div>
                            <div className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
                              Their weakness
                            </div>
                            <p className="mt-2 text-[15px] leading-[1.55] text-charcoal">
                              {c.weak}
                            </p>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold tracking-[0.14em] text-orange uppercase">
                              NvisionAI advantage
                            </div>
                            <p className="mt-2 text-[15px] leading-[1.55] font-semibold text-ink">
                              {c.adv}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </Section>

        {/* GO-TO-MARKET — white band */}
        <Section tone="white">
          <Head kicker="Go-to-market" title="A clear path to value" />
          {/* horizontal step matrix */}
          <div className="mt-12 overflow-x-auto">
            <div className="min-w-[860px]">
              {/* step header */}
              <div className="grid grid-cols-[170px_repeat(4,1fr)] border-b-2 border-ink/10">
                <div />
                {['Entry Point', 'Pilot', 'Expansion', 'Target Segments'].map(
                  (s, i) => (
                    <div key={s} className="px-5 pb-4">
                      <span className="font-mono text-[12px] text-muted tabular-nums">
                        0{i + 1}
                      </span>
                      <div className="mt-1 text-[14px] font-semibold tracking-[0.06em] text-ink uppercase">
                        {s}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* lanes */}
              {gtm.map((g) => {
                const accent = g.tone === 'green' ? 'text-green' : 'text-orange';
                return (
                  <motion.div
                    key={g.tag}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="grid grid-cols-[170px_repeat(4,1fr)] border-b border-steel"
                  >
                    <div className="flex flex-col justify-center py-7 pr-5">
                      <span
                        className={`font-serif text-[26px] font-bold tracking-[-0.02em] ${accent}`}
                      >
                        {g.tag}
                      </span>
                      <span className="mt-1 text-[12px] leading-snug text-muted">
                        {g.sub}
                      </span>
                    </div>
                    {g.steps.map(([, d], i) => (
                      <div
                        key={i}
                        className="border-l border-steel px-5 py-7 text-[14px] leading-[1.5] text-charcoal"
                      >
                        {d}
                      </div>
                    ))}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        </main>
      </div>

      {/* sticky-reveal footer — fixed behind, content scrolls up over it */}
      <footer
        ref={footerRef}
        id="cta"
        className="fixed inset-x-0 bottom-0 z-0 overflow-hidden bg-obsidian"
      >
        <div className="relative mx-auto max-w-[1280px]">
          <div>
            <div
              className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[44rem] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
              style={{ background: 'radial-gradient(closest-side,rgba(82,102,235,0.5),transparent)' }}
            />
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative px-6 pt-14 pb-12 text-center"
            >
              <span className="text-[15px] font-semibold tracking-[0.04em] text-ink">
                Get started
              </span>
              <h2 className="font-serif mx-auto mt-2 max-w-xl text-[32px] leading-[1.08] font-bold tracking-[-0.02em] text-white md:text-[42px]">
                See NvisionAI on your own data.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[16px] font-light text-white/65">
                Book a 30-minute demo tailored to your vertical.
              </p>
              <div className="mt-6 flex items-center justify-center gap-5">
                <BuyPill>Book a demo</BuyPill>
                <a href="#" className="text-[15px] font-medium text-white/80 transition-colors hover:text-white">
                  Talk to sales&nbsp;›
                </a>
              </div>
            </motion.div>

            <div className="mx-8 h-px bg-snow/10 md:mx-14" />

            {/* footer — compact single row */}
            <div className="relative flex flex-col gap-6 px-8 py-7 md:flex-row md:items-center md:justify-between md:px-14">
              <div>
                <div className="font-serif text-[20px] font-bold tracking-[-0.02em] text-white">
                  Nvision<span className="text-orange">AI</span>
                </div>
                <p className="mt-1.5 text-[13px] text-white/45">
                  Enterprise computer vision for financial services
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[13px] text-white/50">
                <span>India +91 88852 57422</span>
                <span>USA +1 972 372 9983</span>
                <a href="mailto:contact@neuzenai.com" className="font-medium text-ink hover:opacity-80">
                  contact@neuzenai.com
                </a>
              </div>
              <div className="flex gap-2">
                {['in', 'X', '✦', '@'].map((x) => (
                  <a
                    key={x}
                    href="#"
                    aria-label={x}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-[12px] font-semibold text-white/70 transition-all duration-200 hover:border-steel hover:bg-orange hover:text-white"
                  >
                    {x}
                  </a>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 px-8 py-4 text-center text-[12px] text-white/40 md:px-14">
              © 2025 NeuzenAI · T-Hub Phase 2, Hyderabad, India
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NvisionAI;
