import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
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
import {
  Shield,
  Building2,
  ArrowRight,
  Check,
  Plus,
  Minus,
  Sparkles,
  ScanEye,
  Quote,
} from 'lucide-react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   SMOOTH SCROLL (Lenis) + GSAP ScrollTrigger sync
   ============================================================ */
const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      lerp: 0.08,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
};

const HeroBackdrop = () => null;

/* ============================================================
   MOUSE-FOLLOWING GLOW (subtle, white-safe)
   ============================================================ */
const CursorGlow = () => {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });
  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX - 320);
      y.set(e.clientY - 320);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-0 hidden h-[640px] w-[640px] rounded-full opacity-60 mix-blend-multiply blur-[100px] md:block"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(255,69,0,0.13),rgba(22,163,74,0.09)_45%,transparent_72%)]" />
    </motion.div>
  );
};

/* ============================================================
   PARALLAX — scroll-linked depth wrapper
   ============================================================ */
const Parallax = ({ children, offset = 60, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const ySpring = useSpring(yRaw, { stiffness: 80, damping: 24, mass: 0.5 });
  return (
    <motion.div ref={ref} style={{ y: ySpring }} className={className}>
      {children}
    </motion.div>
  );
};

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
const Counter = ({ to, prefix = '', suffix = '', decimals = 0, duration = 1.9 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) =>
    `${prefix}${decimals ? Number(v).toFixed(decimals) : Math.round(v).toLocaleString()}${suffix}`,
  );
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration, ease: 'easeOut' });
    return c.stop;
  }, [inView, to, duration, mv]);
  return <motion.span ref={ref}>{display}</motion.span>;
};

/* ============================================================
   MOTION PRIMITIVES
   ============================================================ */
const EASE = [0.16, 1, 0.3, 1]; // cinematic ease-out-expo-ish
const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};
const card = {
  hidden: { opacity: 0, y: 44, scale: 0.94, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE },
  },
};
const vp = { once: true, amount: 0.2 };

const Reveal = ({ children, className = '', id }) => (
  <motion.section
    id={id}
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={vp}
    variants={fadeUp}
  >
    {children}
  </motion.section>
);

const Eyebrow = ({ children, tone = 'orange' }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] uppercase ${
      tone === 'green'
        ? 'bg-green-soft text-green'
        : 'bg-orange-soft text-orange'
    }`}
  >
    <Sparkles size={12} /> {children}
  </span>
);

const SectionHead = ({ eyebrow, tone, title, sub }) => (
  <div className="mx-auto mb-16 max-w-3xl text-center">
    <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
    <h2 className="font-serif mt-6 text-4xl leading-tight text-ink md:text-[3.25rem]">
      {title}
    </h2>
    {sub && <p className="mt-5 text-lg text-ink/70">{sub}</p>}
  </div>
);

/* ============================================================
   NAVBAR
   ============================================================ */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    ['Solutions', '#solutions'],
    ['Platform', '#platform'],
    ['Pricing', '#pricing'],
    ['Market', '#market'],
    ['FAQ', '#faq'],
  ];
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-ink/15 bg-white/85 px-6 backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? 'py-3 shadow-[0_12px_36px_-14px_rgba(10,10,10,0.28)]'
            : 'py-3.5 shadow-[0_6px_22px_-14px_rgba(10,10,10,0.18)]'
        }`}
      >
        <div className="font-serif text-2xl tracking-tight text-ink">
          Nvision<span className="text-orange">AI</span>
        </div>
        <div className="hidden items-center gap-9 md:flex">
          {links.map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="group relative text-sm font-medium text-ink/75 transition-colors hover:text-ink"
            >
              {l}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-orange to-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(255,69,0,0.7)]"
        >
          Get Early Access
        </motion.button>
      </div>
    </motion.nav>
  );
};

/* ============================================================
   HERO
   ============================================================ */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-white pt-32 pb-24"
    >
      <HeroBackdrop />
      <motion.div
        style={{ y, opacity: fade }}
        className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Eyebrow>Enterprise Computer Vision · Financial Services</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif mt-7 text-5xl leading-[1.05] text-ink md:text-7xl"
          >
            <span className="text-gradient">Vision Intelligence</span>
            <br /> for Insurance &amp; Banking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink/70"
          >
            One AI platform — trained on millions of financial-services images —
            automating claims, fraud detection, security monitoring, and
            collateral verification at enterprise scale.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 rounded-xl bg-orange px-7 py-3.5 font-semibold text-white shadow-[0_18px_40px_-14px_rgba(255,69,0,0.65)]"
            >
              Explore Solutions
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="glass rounded-xl px-7 py-3.5 font-semibold text-ink"
            >
              View Platform
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] tracking-widest text-ink/55"
          >
            {['SOC 2 TYPE II', 'GLBA COMPLIANT', 'PCI DSS', 'FFIEC READY'].map((b) => (
              <span key={b} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green" /> {b}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Floating glass dashboard preview */}
        <Parallax offset={50} className="relative hidden lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotateY: 14 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative"
          style={{ perspective: 1200 }}
        >
          <div className="glass animate-float-slow rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-ink/15 pb-4">
              <div className="flex items-center gap-2 font-mono text-xs text-ink/60">
                <ScanEye size={16} className="text-orange" /> ClaimsVision · live
              </div>
              <span className="rounded-full bg-green-soft px-3 py-1 font-mono text-[10px] tracking-wider text-green">
                ANALYZING
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {[
                ['Fraud score', '0.93', 'text-orange'],
                ['Severity', 'HIGH', 'text-ink'],
                ['Claims/hr', '10,000', 'text-green'],
                ['Auto-FNOL', '✓ Done', 'text-green'],
              ].map(([k, v, c]) => (
                <div key={k} className="rounded-2xl bg-white/70 p-4 ring-1 ring-ink/15">
                  <div className="font-mono text-[10px] tracking-widest text-ink/50 uppercase">{k}</div>
                  <div className={`font-serif mt-1 text-2xl ${c}`}>{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 h-24 overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-ink/15">
              <div className="flex h-full items-end gap-1.5">
                {[40, 65, 48, 80, 58, 92, 70, 100, 76, 88, 62, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.6 }}
                    className="flex-1 rounded-t bg-gradient-to-t from-orange to-green"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="glass absolute -bottom-8 -left-10 w-48 rounded-2xl p-4">
            <div className="font-mono text-[10px] tracking-widest text-ink/50 uppercase">Accuracy</div>
            <div className="font-serif text-3xl text-orange">95%+</div>
          </div>
        </motion.div>
        </Parallax>
      </motion.div>
    </section>
  );
};

/* ============================================================
   MARQUEE (integrations)
   ============================================================ */

/* ============================================================
   MAIN PAGE
   ============================================================ */
const NvisionAI = () => {
  useLenis();
  const [activeTab, setActiveTab] = useState('insurance');
  const [openFaq, setOpenFaq] = useState(0);
  const [activePlatform, setActivePlatform] = useState(0);

  // GSAP scroll-progress bar
  const barRef = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      });
    });
    return () => ctx.revert();
  }, []);

  const solutions = {
    insurance: {
      icon: <Shield size={22} />,
      title: 'Insurance',
      subtitle: 'Claims · Property · Fleet · Workers Comp',
      mainTitle: 'Insurance Vision Intelligence',
      mainDesc:
        'Automate claims processing, fraud detection, and property inspection across every line of business.',
      items: [
        { t: 'Auto Claims (ClaimsVision)', c: 'Accident detection, severity classification, staged fraud identification, and automated FNOL processing.', m: 'Process 10,000 claims/hour · 95% fraud detection rate', core: true },
        { t: 'Property Inspection (PropertyInspect AI)', c: 'Drone and photo analysis for roof damage, hail, water, fire, and storm damage assessment from imagery.', m: 'Inspect 100 roofs/day vs 8-10 manual · 80% cost reduction' },
        { t: 'Workers Compensation (SafetyWatch AI)', c: 'Workplace accident detection, PPE compliance monitoring, injury severity classification from facility cameras.', m: 'Reduce fraudulent claims by 30% · Real-time alerts' },
        { t: 'Commercial Fleet (FleetProtect AI)', c: 'Real-time driver behavior monitoring — distracted driving, following distance, load security for cargo insurance.', m: 'Telematics-integrated · Samsara, Lytx, Geotab ready' },
      ],
      integrations: ['Guidewire', 'Duck Creek', 'Mitchell', 'CCC Intelligent', 'Snapsheet', 'Majesco'],
    },
    banking: {
      icon: <Building2 size={22} />,
      title: 'Banking',
      subtitle: 'Security · Fraud · Collateral · Branch Ops',
      mainTitle: 'Banking Vision Intelligence',
      mainDesc:
        'Enhance physical security, detect ATM fraud, and monitor high-value collateral automatically.',
      items: [
        { t: 'ATM & Branch Security', c: 'Detect loitering, card skimmers, and suspicious behavior at 24/7 self-service terminals.', m: '99% uptime on security monitoring · Global deployment' },
        { t: 'KYC & Document Fraud', c: 'Automated verification of physical identity documents and deepfake detection for remote onboarding.', m: 'Sub-2 second verification · Compliance ready' },
        { t: 'Collateral Verification', c: 'Remote monitoring of inventory, real-estate assets, and construction progress for risk mitigation.', m: 'Real-time asset tracking · 40% faster appraisals' },
        { t: 'Vault & Cash Operations', c: 'Secure monitoring of cash-in-transit and vault access with multi-factor visual authentication.', m: 'Audit-ready logs · Zero breach history' },
      ],
      integrations: ['Jack Henry', 'FIS', 'Fiserv', 'nCino', 'Salesforce', 'Infor'],
    },
  };

  const platformItems = [
    { title: 'ClaimsVision', type: 'INSURANCE', desc: 'Auto accident detection and claims automation, positioned for enterprise insurance.', list: ['Accident detection & classification', 'Severity assessment scoring', 'Staged fraud identification', 'Automated FNOL generation'] },
    { title: 'PropertyInspect', type: 'INSURANCE', desc: 'Drone and aerial imagery analysis for P&C property claims assessment.', list: ['Roof damage detection', 'Hail & storm damage scoring', 'Water & fire classification', 'Pre/post loss comparison'] },
    { title: 'SafetyWatch', type: 'INSURANCE', desc: 'Workplace safety monitoring for workers compensation and PPE compliance.', list: ['Accident detection from CCTV', 'PPE compliance monitoring', 'Injury severity scoring', 'Ergonomic risk assessment'] },
    { title: 'BankGuard', type: 'BANKING', desc: 'ATM and branch perimeter security with real-time behavioral detection.', list: ['Skimming device detection', 'Loitering & threat behavior', 'Cash-in-transit monitoring', 'Evidence auto-compilation'] },
    { title: 'DocuVerify', type: 'BANKING', desc: 'AI-powered document fraud detection for check processing and KYC.', list: ['Check forgery detection', 'ID document verification', 'Signature matching AI', 'Fraud ring pattern analysis'] },
    { title: 'AssetMonitor', type: 'BANKING', desc: 'Collateral and construction loan monitoring via drone and on-site imagery.', list: ['Construction draw verification', 'Equipment lease tracking', 'Property condition scoring', 'Agricultural asset monitoring'] },
  ];

  // auto-rotate the platform highlight every ~5.5s
  useEffect(() => {
    const id = setInterval(
      () => setActivePlatform((p) => (p + 1) % platformItems.length),
      5500,
    );
    return () => clearInterval(id);
  }, [platformItems.length]);

  const insurancePlans = [
    { name: 'STARTER', price: '$2,500', desc: '500 claims/month. Best for small insurers and MGAs getting started.', features: ['500 claims per month', 'Email support', 'ClaimsVision (auto)', 'Standard dashboard'], btn: 'Get Started' },
    { name: 'PROFESSIONAL', price: '$7,500', popular: true, desc: '2,000 claims/month with phone support and API integration for regional carriers.', features: ['2,000 claims per month', 'Phone + email support', 'Full API access', '+PropertyInspect add-on', '+SafetyWatch add-on'], btn: 'Get Started' },
    { name: 'ENTERPRISE', price: '$25K+', desc: 'Unlimited claims, dedicated CSM, and custom ML model training for national carriers.', features: ['Unlimited claims', 'Dedicated CSM', 'Custom ML training', 'All modules included', 'SLA-guaranteed uptime'], btn: 'Contact Sales' },
  ];

  const testimonials = [
    { q: 'NvisionAI cut our auto-claims cycle time by 70% in the first quarter. The fraud detection alone paid for the platform.', n: 'VP Claims, Regional P&C Carrier', t: 'INSURANCE' },
    { q: 'We deployed BankGuard across 240 ATMs. Skimmer detection that used to take days now takes seconds.', n: 'Head of Physical Security, Regional Bank', t: 'BANKING' },
    { q: 'PropertyInspect lets two adjusters cover what previously took a full team. The ROI was obvious in the pilot.', n: 'Director of Field Ops, MGA', t: 'INSURANCE' },
  ];

  const faqs = [
    ['How fast is deployment?', 'Insurance pilots run a 90-day trial processing 500–1,000 claims with full ROI tracking. Banking deployments start with a 30-day audit on 10–20 ATMs/branches before multi-location rollout.'],
    ['Does it integrate with our existing systems?', 'Yes. We are API-first with native connectors for Guidewire, Duck Creek, Mitchell, CCC, Jack Henry, FIS, Fiserv, nCino, Salesforce and more.'],
    ['How are the models trained?', 'On 10M+ financial-services-specific images — not generic computer vision. Enterprise tiers include custom ML model training on your own data.'],
    ['Is it compliant?', 'NvisionAI is SOC 2 Type II, GLBA, PCI DSS and FFIEC ready, with audit-ready logging across every module.'],
    ['What does pricing look like?', 'Insurance uses a SaaS subscription model by claim volume. Banking uses a per-location hybrid model. Enterprise pricing is custom.'],
  ];

  return (
    <div className="relative bg-white">
      {/* scroll progress */}
      <div className="fixed inset-x-0 top-0 z-[60] h-1 origin-left">
        <div
          ref={barRef}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-orange via-orange to-green"
        />
      </div>

      <CursorGlow />
      <Navbar />

      <main className="relative z-10">
        <Hero />

        {/* STATS */}
        <Reveal className="mx-auto max-w-6xl px-6 py-14">
          <div className="glass grid grid-cols-2 divide-x divide-y divide-ink/15 overflow-hidden rounded-2xl md:grid-cols-4 md:divide-y-0">
            {[
              { v: <Counter to={95} suffix="%+" />, l: 'Fraud Detection Accuracy' },
              { v: <Counter to={10000} />, l: 'Claims / Hour Processed' },
              { v: <Counter to={70} suffix="%" />, l: 'Reduction in Manual Review' },
              { v: <Counter to={134} prefix="$" suffix="M+" />, l: 'Total Addressable Opportunity' },
            ].map((s, i) => (
              <div key={i} className="px-6 py-7 text-center">
                <div className="font-serif text-3xl text-orange md:text-4xl">{s.v}</div>
                <div className="mt-1.5 text-xs font-medium text-ink/65 md:text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* SOLUTIONS */}
        <Reveal id="solutions" className="mx-auto max-w-6xl px-6 py-16">
          <SectionHead
            eyebrow="Industry Solutions"
            title="Purpose-built for Financial Services"
          />
          <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
            <div className="flex flex-col gap-3">
              {Object.keys(solutions).map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-300 ${
                    activeTab === id
                      ? 'border-orange/40 bg-white shadow-[0_14px_30px_-18px_rgba(255,69,0,0.4)]'
                      : 'border-ink/15 bg-white hover:border-orange/30'
                  }`}
                >
                  <span
                    className={`rounded-lg p-2.5 ${
                      activeTab === id ? 'bg-orange text-white' : 'bg-orange-soft text-orange'
                    }`}
                  >
                    {solutions[id].icon}
                  </span>
                  <span>
                    <span className="font-serif block text-lg text-ink">{solutions[id].title}</span>
                    <span className="font-mono text-[10px] tracking-wide text-ink/55">
                      {solutions[id].subtitle}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="glass rounded-2xl p-6 md:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-serif text-2xl text-ink">{solutions[activeTab].mainTitle}</h3>
                  <p className="mt-2 text-sm text-ink/65">{solutions[activeTab].mainDesc}</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {solutions[activeTab].items.map((item) => (
                      <div
                        key={item.t}
                        className="rounded-xl border border-ink/15 bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-ink">{item.t}</span>
                          {item.core && (
                            <span className="shrink-0 rounded-full bg-orange px-2 py-0.5 font-mono text-[9px] tracking-widest text-white">
                              CORE
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-ink/65">{item.c}</p>
                        <p className="mt-2.5 font-mono text-[11px] text-green">{item.m}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink/15 pt-4">
                    <span className="font-mono text-[10px] tracking-widest text-ink/50 uppercase">
                      Integrations
                    </span>
                    {solutions[activeTab].integrations.map((int) => (
                      <span
                        key={int}
                        className="rounded-full bg-orange-soft px-2.5 py-0.5 text-[11px] font-medium text-orange"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* PLATFORM — CIRCULAR SELECTOR */}
        <Reveal id="platform" className="mx-auto max-w-6xl px-6 py-28">
          <SectionHead
            eyebrow="NeuzenAI Vision Platform"
            tone="green"
            title="One platform. Six specialized solutions."
            sub="Select a module — explore what each one does."
          />
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Circular orbit selector */}
            <div className="relative mx-auto aspect-square w-full max-w-[460px]">
              <div className="absolute inset-[14%] rounded-full border border-ink/15" />
              <div className="absolute inset-[2%] rounded-full border border-dashed border-ink/15" />
              {/* center hub */}
              <div className="glass absolute top-1/2 left-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center">
                <span className="font-serif text-xl text-ink">Nvision</span>
                <span className="font-serif -mt-1 text-xl text-orange">AI</span>
                <span className="mt-1 font-mono text-[9px] tracking-widest text-ink/50">
                  6 MODULES
                </span>
              </div>
              {platformItems.map((item, i) => {
                const angle = (i / platformItems.length) * 2 * Math.PI - Math.PI / 2;
                const r = 42; // % radius
                const left = 50 + r * Math.cos(angle);
                const top = 50 + r * Math.sin(angle);
                const active = activePlatform === i;
                const green = item.type === 'BANKING';
                return (
                  <button
                    key={item.title}
                    onClick={() => setActivePlatform(i)}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className={`absolute z-10 flex h-[108px] w-[108px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full px-2 text-center transition-all duration-300 ${
                      active
                        ? `scale-105 ${green ? 'bg-green' : 'bg-orange'} text-white shadow-[0_16px_36px_-12px_rgba(255,69,0,0.55)]`
                        : 'glass text-ink hover:scale-105'
                    }`}
                  >
                    <span className="text-[11px] leading-[1.15] font-semibold break-words">
                      {item.title}
                    </span>
                    <span
                      className={`mt-1 font-mono text-[8px] tracking-widest ${
                        active ? 'text-white/75' : green ? 'text-green' : 'text-orange'
                      }`}
                    >
                      {item.type}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="glass min-h-[360px] rounded-3xl p-8 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePlatform}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <span
                    className={`font-mono text-[11px] tracking-widest ${
                      platformItems[activePlatform].type === 'BANKING'
                        ? 'text-green'
                        : 'text-orange'
                    }`}
                  >
                    {platformItems[activePlatform].type}
                  </span>
                  <h3 className="font-serif mt-3 text-4xl text-ink">
                    {platformItems[activePlatform].title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-ink/70">
                    {platformItems[activePlatform].desc}
                  </p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {platformItems[activePlatform].list.map((li) => (
                      <li
                        key={li}
                        className="flex items-start gap-2.5 rounded-2xl bg-white/60 p-3.5 text-sm ring-1 ring-ink/15"
                      >
                        <Check
                          size={16}
                          className={`mt-0.5 shrink-0 ${
                            platformItems[activePlatform].type === 'BANKING'
                              ? 'text-green'
                              : 'text-orange'
                          }`}
                        />
                        <span className="text-ink/75">{li}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="glass mt-14 rounded-3xl p-10 text-center"
          >
            <h3 className="font-serif text-2xl text-ink">Unified Value Proposition</h3>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-ink/70">
              "One AI platform, trained on 10M+ financial-services images, reducing
              manual review by 70% across claims, security, and compliance use cases."
            </p>
          </motion.div>
        </Reveal>

        {/* TESTIMONIALS */}
        <Reveal className="mx-auto max-w-6xl px-6 py-28">
          <SectionHead eyebrow="Trusted in production" tone="green" title="What teams are saying" />
          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {testimonials.map((tm) => (
              <motion.div
                key={tm.n}
                variants={card}
                whileHover={{ y: -6 }}
                className="glass flex flex-col rounded-3xl p-8"
              >
                <Quote size={28} className="text-orange/40" />
                <p className="mt-4 flex-1 text-lg leading-relaxed text-ink/80">{tm.q}</p>
                <div className="mt-6 border-t border-ink/15 pt-5">
                  <span
                    className={`font-mono text-[10px] tracking-widest ${
                      tm.t === 'BANKING' ? 'text-green' : 'text-orange'
                    }`}
                  >
                    {tm.t}
                  </span>
                  <div className="mt-1 font-medium text-ink">{tm.n}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* PRICING */}
        <Reveal id="pricing" className="mx-auto max-w-6xl px-6 py-28">
          <SectionHead
            eyebrow="Pricing"
            title="Transparent, scalable pricing"
            sub="Insurance: SaaS subscription. Banking: per-location hybrid model."
          />
          <motion.div
            className="grid gap-6 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {insurancePlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={card}
                whileHover={{ y: -10 }}
                className={`relative flex flex-col rounded-3xl p-8 ${
                  plan.popular
                    ? 'glass-dark text-white ring-2 ring-orange'
                    : 'glass'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange px-4 py-1 font-mono text-[10px] tracking-widest text-white">
                    MOST POPULAR
                  </span>
                )}
                <div className={`font-mono text-xs tracking-widest ${plan.popular ? 'text-orange' : 'text-ink/55'}`}>
                  {plan.name}
                </div>
                <div className={`font-serif mt-4 text-5xl ${plan.popular ? 'text-white' : 'text-ink'}`}>
                  {plan.price}
                </div>
                <div className={`mt-1 text-sm ${plan.popular ? 'text-white/60' : 'text-ink/55'}`}>per month</div>
                <p className={`mt-5 text-sm ${plan.popular ? 'text-white/70' : 'text-ink/65'}`}>{plan.desc}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check size={16} className="text-green" />
                      <span className={plan.popular ? 'text-white/85' : 'text-ink/75'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`mt-8 rounded-xl px-6 py-3.5 font-semibold ${
                    plan.popular
                      ? 'bg-orange text-white shadow-[0_18px_40px_-14px_rgba(255,69,0,0.7)]'
                      : 'bg-orange-soft text-orange'
                  }`}
                >
                  {plan.btn}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* MARKET / TAM */}
        <Reveal id="market" className="mx-auto max-w-6xl px-6 py-28">
          <SectionHead
            eyebrow="Market Opportunity"
            tone="green"
            title="$134M+ combined revenue potential"
            sub="At minimal market share across both verticals."
          />
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {[
              {
                icon: <Shield size={20} />, title: 'Insurance Opportunities', tam: 'TAM: $83B',
                rows: [['Auto Claims Processing', '$35M'], ['P&C Inspection', '$16M'], ['Workers Compensation', '$15M'], ['Fleet Insurance', '$25M']],
                sum: <Counter to={91} suffix="M" />, tone: 'orange',
              },
              {
                icon: <Building2 size={20} />, title: 'Banking Opportunities', tam: 'TAM: $16B',
                rows: [['ATM & Branch Security', '$14M'], ['Fraud Detection', '$17M'], ['Construction Monitoring', '$9.6M'], ['Collateral Verification', '$3M']],
                sum: <Counter to={43.6} decimals={1} suffix="M" />, tone: 'green',
              },
            ].map((c) => (
              <motion.div key={c.title} variants={card} className="glass overflow-hidden rounded-3xl">
                <div className="glass-dark flex items-center gap-4 p-7 text-white">
                  <span className={`rounded-xl p-3 ${c.tone === 'green' ? 'bg-green' : 'bg-orange'}`}>
                    {c.icon}
                  </span>
                  <div>
                    <div className="font-serif text-xl">{c.title}</div>
                    <div className="font-mono text-[11px] tracking-wide text-white/55">{c.tam}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 p-7">
                  {c.rows.map(([l, v]) => (
                    <div
                      key={l}
                      className={`rounded-2xl p-4 ${
                        c.tone === 'green' ? 'bg-green-soft' : 'bg-orange-soft'
                      }`}
                    >
                      <div className="text-xs font-medium text-ink/65">{l}</div>
                      <div className={`font-serif mt-1 text-xl ${c.tone === 'green' ? 'text-green' : 'text-orange'}`}>
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className={`flex items-center justify-between border-t-4 px-7 py-5 ${
                    c.tone === 'green' ? 'border-green' : 'border-orange'
                  }`}
                >
                  <span className="font-mono text-xs tracking-widest text-ink/55">SUM</span>
                  <span className={`font-serif text-2xl ${c.tone === 'green' ? 'text-green' : 'text-orange'}`}>
                    ${c.sum}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* FAQ */}
        <Reveal id="faq" className="mx-auto max-w-3xl px-6 py-28">
          <SectionHead eyebrow="FAQ" title="Questions, answered" />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="glass divide-y divide-ink/15 overflow-hidden rounded-3xl"
          >
            {faqs.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <motion.div key={q} variants={card}>
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="group flex w-full items-center gap-5 px-7 py-6 text-left transition-colors hover:bg-white/40"
                  >
                    <span
                      className={`font-mono text-xs transition-colors ${
                        open ? 'text-orange' : 'text-ink/35'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 font-serif text-lg transition-colors ${
                        open ? 'text-orange' : 'text-ink group-hover:text-orange'
                      }`}
                    >
                      {q}
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        open
                          ? 'rotate-180 bg-orange text-white'
                          : 'bg-orange-soft text-orange group-hover:scale-110'
                      }`}
                    >
                      {open ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="pr-7 pb-7 pl-[3.75rem] leading-relaxed text-ink/65">
                          {a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </Reveal>

        {/* COMPETITIVE LANDSCAPE */}
        <Reveal className="mx-auto max-w-6xl px-6 py-16">
          <SectionHead
            eyebrow="Competitive Landscape"
            title="Where NvisionAI wins"
            sub="Purpose-built for financial services vs. generic incumbents."
          />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="overflow-hidden rounded-2xl border border-ink/15 bg-white shadow-[0_30px_70px_-40px_rgba(10,10,10,0.35)]"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] table-fixed border-collapse text-left">
                <colgroup>
                  <col style={{ width: '64px' }} />
                  <col style={{ width: '17%' }} />
                  <col style={{ width: '140px' }} />
                  <col style={{ width: '24%' }} />
                  <col />
                  <col style={{ width: '108px' }} />
                </colgroup>
                <thead>
                  <tr>
                    {[
                      ['No', 'border-black'],
                      ['Competitor', 'border-black'],
                      ['Vertical', 'border-orange'],
                      ['Their Weakness', 'border-black'],
                      ['NvisionAI Advantage', 'border-green'],
                      ['Status', 'border-green'],
                    ].map(([h, b]) => (
                      <th
                        key={h}
                        className={`border-b-[3px] px-6 pt-7 pb-4 font-mono text-[11px] font-semibold tracking-[0.16em] text-ink/55 uppercase ${b}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: '01', name: 'Tractable', v: 'Auto Damage AI', weak: 'UK-based, expensive, slow US integration', adv: 'US-based, faster deployment, better pricing' },
                    { n: '02', name: 'Snapsheet', v: 'Mobile Claims', weak: 'Limited AI depth, workflow-only focus', adv: 'Deeper AI analysis + fraud detection' },
                    { n: '03', name: 'Mitchell / CCC', v: 'Auto Valuation', weak: 'Legacy systems, not AI-native', adv: 'Modern API-first, AI-native platform' },
                    { n: '04', name: 'NICE', v: 'Surveillance', weak: 'General purpose, expensive, complex', adv: 'Banking-specific, simpler, faster ROI' },
                    { n: '05', name: 'Feedzai', v: 'Banking Fraud', weak: 'Payment fraud only, no physical security', adv: 'Combined physical + document fraud' },
                    { n: '06', name: 'Verafin', v: 'AML / Fraud', weak: 'No computer vision capability', adv: 'Video/image analysis = new fraud vectors' },
                  ].map((c, i) => (
                    <tr
                      key={c.n}
                      className={`group border-t border-ink/10 transition-colors duration-200 hover:bg-orange-soft/50 ${
                        i % 2 ? 'bg-orange-soft/20' : 'bg-white'
                      }`}
                    >
                      <td className="px-6 py-6 align-middle">
                        <span className="font-serif text-2xl text-orange tabular-nums">
                          {c.n}
                        </span>
                      </td>
                      <td className="px-6 py-6 align-middle">
                        <span className="font-serif text-lg font-semibold whitespace-nowrap text-ink">
                          {c.name}
                        </span>
                      </td>
                      <td className="px-6 py-6 align-middle">
                        <span className="inline-block rounded-full bg-orange-soft px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap text-orange uppercase">
                          {c.v}
                        </span>
                      </td>
                      <td className="px-6 py-6 align-middle text-sm leading-relaxed text-ink/75">
                        {c.weak}
                      </td>
                      <td className="px-6 py-6 align-middle">
                        <span className="flex items-start gap-2.5 border-l-2 border-green pl-3 text-sm font-semibold text-green">
                          <Check size={16} className="mt-0.5 shrink-0" />
                          {c.adv}
                        </span>
                      </td>
                      <td className="px-6 py-6 align-middle">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-green uppercase ring-1 ring-green/25">
                          <Check size={12} className="shrink-0" />
                          Win
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </Reveal>

        {/* GO-TO-MARKET */}
        <Reveal className="mx-auto max-w-6xl px-6 py-12">
          <SectionHead
            eyebrow="Go-to-Market"
            tone="green"
            title="Sales playbook by vertical"
          />
          <motion.div
            className="grid gap-6 lg:grid-cols-2"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {[
              {
                tag: 'INSURANCE', tone: 'orange', title: 'Insurance GTM',
                sub: 'Strongest play — 3-6 month cycles',
                steps: [
                  ['Entry Point', "'Free accident analysis for your top 10 disputed claims' — show value in days, not months."],
                  ['Pilot', '90-day trial processing 500-1,000 claims with full ROI tracking and reporting.'],
                  ['Expansion', 'Full platform API integration + upsell PropertyInspect and SafetyWatch modules.'],
                  ['Target Segments', 'Regional/mid-market insurers ($500M-$5B premiums), MGAs/TPAs, fleet insurance specialists.'],
                ],
              },
              {
                tag: 'BANKING', tone: 'green', title: 'Banking GTM',
                sub: 'Higher barrier, higher value',
                steps: [
                  ['Entry Point', "'Free security audit of 1 month of ATM footage' — prove detection capability before commitment."],
                  ['Pilot', '30-day trial on 10-20 ATMs/branches with documented incident detection vs. manual.'],
                  ['Expansion', 'Multi-location rollout + add DocuVerify for fraud and AssetMonitor for construction loans.'],
                  ['Target Segments', 'Regional banks ($1B-$50B assets), credit unions, fintech construction/equipment lenders.'],
                ],
              },
            ].map((g) => {
              const accent = g.tone === 'green' ? 'text-green' : 'text-orange';
              return (
                <motion.div
                  key={g.tag}
                  variants={card}
                  className="glass rounded-2xl p-6"
                >
                  <span
                    className={`inline-block rounded-full px-3 py-1 font-mono text-[10px] tracking-widest ${
                      g.tone === 'green'
                        ? 'bg-green-soft text-green'
                        : 'bg-orange-soft text-orange'
                    }`}
                  >
                    {g.tag}
                  </span>
                  <h3 className="font-serif mt-4 text-3xl text-ink">
                    {g.title.split(' ')[0]}{' '}
                    <span className={accent}>{g.title.split(' ')[1]}</span>
                  </h3>
                  <p className={`mt-1 font-mono text-[11px] tracking-widest uppercase ${accent}`}>
                    {g.sub}
                  </p>
                  <div className="mt-5 divide-y divide-ink/10 border-t border-ink/10">
                    {g.steps.map(([t, d], i) => (
                      <div key={t} className="flex gap-3.5 py-3.5">
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono text-[11px] font-bold ${
                            g.tone === 'green'
                              ? 'bg-green-soft text-green'
                              : 'bg-orange-soft text-orange'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-ink">{t}</div>
                          <div className="mt-0.5 text-[13px] leading-snug text-ink">{d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </Reveal>

      </main>

      {/* FOOTER */}
      <footer className="bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-20">
          {/* CTA band */}
          <Reveal>
            <div className="glass relative overflow-hidden rounded-[2rem] px-8 py-14 md:px-14 md:py-16">
              <div className="absolute right-0 top-0 h-1.5 w-2/3 bg-gradient-to-l from-orange to-green" />
              <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <Eyebrow>Ready when you are</Eyebrow>
                  <h2 className="font-serif mt-5 text-3xl leading-tight text-ink md:text-5xl">
                    Turn what your cameras see into{' '}
                    <span className="text-gradient">decisions</span>.
                  </h2>
                  <p className="mt-4 max-w-lg text-ink/65">
                    Book a 30-minute demo tailored to your vertical — insurance or
                    banking. See a live pilot on your own data within weeks.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-7 py-4 font-semibold text-white shadow-[0_18px_40px_-14px_rgba(255,69,0,0.7)]"
                  >
                    Book a Demo
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl bg-white px-7 py-4 font-semibold text-ink ring-1 ring-ink/15 transition-colors hover:ring-orange/40"
                  >
                    Talk to Sales
                  </motion.button>
                  <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-widest text-ink/50">
                    {['SOC 2 TYPE II', 'GLBA', 'PCI DSS'].map((b) => (
                      <span key={b} className="flex items-center gap-1.5">
                        <Check size={12} className="text-green" /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* link grid */}
          <div className="mt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <div className="font-serif text-2xl text-ink">
                Nvision<span className="text-orange">AI</span>
                <span className="ml-2 text-sm font-semibold text-ink/55">· by NeuzenAI</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
                Enterprise computer vision for financial services — one platform
                for claims, fraud, security and collateral intelligence.
              </p>
              <div className="mt-6 flex gap-3">
                {['in', 'X', 'GH'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xs font-bold text-ink ring-1 ring-ink/15 transition-all hover:-translate-y-0.5 hover:text-orange hover:ring-orange/40"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {[
              ['Platform', ['ClaimsVision', 'PropertyInspect', 'SafetyWatch', 'BankGuard', 'DocuVerify']],
              ['Company', ['Solutions', 'Market', 'Pricing', 'About NeuzenAI', 'Careers']],
              ['Resources', ['Documentation', 'Case Studies', 'Security', 'API Reference', 'Contact']],
            ].map(([title, items]) => (
              <div key={title}>
                <div className="font-mono text-[11px] tracking-widest text-ink/45 uppercase">
                  {title}
                </div>
                <ul className="mt-5 space-y-3">
                  {items.map((it) => (
                    <li key={it}>
                      <a
                        href="#"
                        className="text-sm text-ink/65 transition-colors hover:text-orange"
                      >
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* bottom bar */}
          <div className="mt-16 flex flex-col gap-4 border-t border-ink/15 pt-8 text-sm text-ink/55 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span>India +91 88852 57422</span>
              <span>USA +1 972 372 9983</span>
              <a href="mailto:contact@neuzenai.com" className="font-medium text-orange">
                contact@neuzenai.com
              </a>
            </div>
            <div className="text-ink/45">
              © 2025 NeuzenAI · T-Hub Phase 2, Hyderabad, India
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NvisionAI;
