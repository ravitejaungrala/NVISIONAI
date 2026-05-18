import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { gsap } from 'gsap/dist/gsap.js';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js';
import Lenis from 'lenis';
import {
  ArrowRight,
  Sparkles,
  Shield,
  Radar,
  Database,
  Layers,
  LineChart,
  Cpu,
  Check,
  ChevronDown,
  Building2,
  Car,
  Truck,
  FileText,
  Lock,
} from 'lucide-react';
import './NvisionAI.css';

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const caseTurnVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 28 : -28, scale: 0.96 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -20 : 20, scale: 0.97 }),
};

const heroCases = [
  { id: 'claims',   vertical: 'INSURANCE', label: 'ClaimsVision',    sublabel: 'Auto Claims AI',          metric: '10,000', unit: 'claims / hour',     conf: 95, bars: [55, 62, 74, 63, 82, 77, 91, 95], color: 'orange', Icon: Car },
  { id: 'property', vertical: 'INSURANCE', label: 'PropertyInspect', sublabel: 'Property Damage AI',       metric: '100',    unit: 'roofs / day',       conf: 89, bars: [38, 50, 62, 70, 75, 80, 85, 89], color: 'orange', Icon: Building2 },
  { id: 'safety',   vertical: 'INSURANCE', label: 'SafetyWatch',     sublabel: 'Workers Comp AI',          metric: '30%',    unit: 'fraud reduction',   conf: 92, bars: [58, 68, 78, 72, 86, 84, 90, 92], color: 'orange', Icon: Shield },
  { id: 'fleet',    vertical: 'INSURANCE', label: 'FleetProtect',    sublabel: 'Commercial Fleet AI',      metric: 'Live',   unit: 'driver scoring',    conf: 87, bars: [50, 60, 68, 76, 72, 81, 84, 87], color: 'orange', Icon: Truck },
  { id: 'atm',      vertical: 'BANKING',   label: 'BankGuard',       sublabel: 'ATM & Branch Security',    metric: '< 2s',   unit: 'detection time',    conf: 97, bars: [68, 78, 82, 86, 90, 88, 94, 97], color: 'green',  Icon: Cpu },
  { id: 'doc',      vertical: 'BANKING',   label: 'DocuVerify',      sublabel: 'Document Fraud AI',        metric: '0.1s',   unit: 'per document',      conf: 98, bars: [72, 80, 84, 88, 92, 90, 95, 98], color: 'green',  Icon: FileText },
  { id: 'asset',    vertical: 'BANKING',   label: 'AssetMonitor',    sublabel: 'Collateral Verification',  metric: '60%',    unit: 'faster audits',     conf: 88, bars: [46, 58, 66, 72, 74, 80, 85, 88], color: 'green',  Icon: Database },
  { id: 'vault',    vertical: 'BANKING',   label: 'VaultOps',        sublabel: 'Vault & Cash AI',          metric: '100%',   unit: 'FFIEC compliant',   conf: 99, bars: [78, 84, 88, 91, 94, 96, 97, 99], color: 'green',  Icon: Lock },
];

const turnVariants = {
  enter: (dir) => ({
    opacity: 0,
    rotateY: dir > 0 ? -18 : 18,
    x: dir > 0 ? 34 : -34,
    transformOrigin: dir > 0 ? 'left center' : 'right center',
  }),
  center: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    transformOrigin: 'center center',
  },
  exit: (dir) => ({
    opacity: 0,
    rotateY: dir > 0 ? 16 : -16,
    x: dir > 0 ? -28 : 28,
    transformOrigin: dir > 0 ? 'right center' : 'left center',
  }),
};

const Counter = ({ to, prefix = '', suffix = '', duration = 1.6 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: 'easeOut' });
    return () => controls.stop();
  }, [duration, inView, mv, to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const DecimalCounter = ({ to, prefix = '', suffix = '', precision = 1, duration = 1.7 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const mv = useMotionValue(0);
  const formatted = useTransform(mv, (v) => `${prefix}${Number(v).toFixed(precision)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: 'easeOut' });
    return () => controls.stop();
  }, [duration, inView, mv, to]);

  return <motion.span ref={ref}>{formatted}</motion.span>;
};

const FLOW_TRACKS = [
  {
    id: 'insurance',
    title: 'Insurance Claim Flow',
    status: 'PROCESSING',
    tone: 'orange',
    source: 'FNOL + Accident Photos',
    ingest: 'Guidewire / Duck Creek Ingestion',
    modules: [
      { name: 'ClaimsVision', detail: 'Damage + severity detection', Icon: Car },
      { name: 'PropertyInspect', detail: 'Roof and storm analysis', Icon: Building2 },
      { name: 'SafetyWatch', detail: 'PPE and incident review', Icon: Shield },
    ],
    outcomes: ['10,000 claims/hour', '95% fraud detection', '70% less manual review'],
    visualCards: [
      { title: 'Source', copy: 'Accident Photos', image: '/flow/insurance-source-car-damage.svg' },
      { title: 'Ingestion', copy: 'Policy + FNOL Data', image: '/flow/insurance-ingestion-docs.svg' },
      { title: 'Core', copy: 'Risk Engine', image: '/flow/insurance-core-engine.svg' },
      { title: 'Output', copy: 'Claim Decision', image: '/flow/insurance-output-decision.svg' },
    ],
    nextSteps: ['Detect damage', 'Score severity', 'Run fraud check', 'Generate FNOL'],
    graphLabel: 'Claim Throughput',
  },
  {
    id: 'banking',
    title: 'Banking Security Flow',
    status: 'MONITORING',
    tone: 'green',
    source: 'ATM Feeds + KYC Documents',
    ingest: 'Fiserv / FIS Ingestion',
    modules: [
      { name: 'BankGuard', detail: 'ATM and branch threat detection', Icon: Cpu },
      { name: 'DocuVerify', detail: 'Forgery and tamper checks', Icon: FileText },
      { name: 'AssetMonitor', detail: 'Collateral verification', Icon: Database },
    ],
    outcomes: ['Sub-2s incident alerts', '99% monitoring uptime', '60% faster audits'],
    visualCards: [
      { title: 'Source', copy: 'ATM + KYC Feeds', image: '/flow/banking-source-atm.svg' },
      { title: 'Ingestion', copy: 'Core Banking Data', image: '/flow/banking-ingestion-coredata.svg' },
      { title: 'Core', copy: 'Threat Engine', image: '/flow/banking-core-threat.svg' },
      { title: 'Output', copy: 'Security Alert', image: '/flow/banking-output-alert.svg' },
    ],
    nextSteps: ['Detect anomaly', 'Verify document', 'Correlate event', 'Dispatch alert'],
    graphLabel: 'Alert Detection Rate',
  },
];

const VisionAnalyzer = () => {
  const [trackIdx, setTrackIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const track = FLOW_TRACKS[trackIdx];

  useEffect(() => {
    const phaseTimer = window.setInterval(() => {
      setPhase((prev) => (prev + 1) % 6);
    }, 1100);

    const trackTimer = window.setInterval(() => {
      setTrackIdx((prev) => (prev + 1) % FLOW_TRACKS.length);
      setPhase(0);
    }, 6600);

    return () => {
      window.clearInterval(phaseTimer);
      window.clearInterval(trackTimer);
    };
  }, []);

  const progress = Math.round((phase / 5) * 100);

  return (
    <div className="va-wrap">
      <div className="va-hdr">
        <span className={`va-type va-type-${track.tone}`}>{track.title}</span>
        <span className={`va-scanning va-scanning-${track.tone}`}>&#x2B24; {track.status}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          className="va-scene"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          <div className="va-flow-top">
            <div className={`va-flow-node ${phase >= 0 ? 'is-on' : ''}`}>
              <span className="va-node-title">Source</span>
              <span className="va-node-copy">{track.source}</span>
            </div>
            <span className={`va-flow-arrow ${phase >= 1 ? 'is-on' : ''}`}>→</span>
            <div className={`va-flow-node ${phase >= 1 ? 'is-on' : ''}`}>
              <span className="va-node-title">Ingestion</span>
              <span className="va-node-copy">{track.ingest}</span>
            </div>
            <span className={`va-flow-arrow ${phase >= 2 ? 'is-on' : ''}`}>→</span>
            <div className={`va-flow-node va-core ${phase >= 2 ? 'is-on' : ''}`}>
              <span className="va-node-title">NvisionAI Core</span>
              <span className="va-node-copy">Vision intelligence orchestration</span>
            </div>
          </div>

          <div className="va-flow-modules">
            {track.modules.map(({ name, detail, Icon }, idx) => (
              <div key={name} className={`va-module ${phase >= idx + 3 ? 'is-on' : ''}`}>
                <div className="va-module-head">
                  <span className="va-module-icon"><Icon size={14} strokeWidth={2} /></span>
                  <span className="va-module-name">{name}</span>
                  <span className={`va-module-check ${phase >= idx + 3 ? 'is-on' : ''}`}>
                    <Check size={10} strokeWidth={3} />
                  </span>
                </div>
                <div className="va-module-copy">{detail}</div>
              </div>
            ))}
          </div>

          <div className={`va-outcomes ${phase >= 5 ? 'is-on' : ''}`}>
            {track.outcomes.map((out) => (
              <span key={out} className="va-outcome-chip">{out}</span>
            ))}
          </div>

          <div className={`va-flow-bottom ${phase >= 3 ? 'is-on' : ''}`}>
            <div className="va-image-flow">
              {track.visualCards.map(({ title, copy, image }, idx) => (
                <div key={title} className={`va-image-card ${phase >= idx + 1 ? 'is-on' : ''}`}>
                  <div className="va-image-thumb">
                    <img src={image} alt={copy} loading="lazy" />
                  </div>
                  <span className="va-image-title">{title}</span>
                  <span className="va-image-copy">{copy}</span>
                </div>
              ))}
            </div>

            <div className="va-bottom-right">
              <div className="va-mini-steps">
                {track.nextSteps.map((step, idx) => (
                  <div key={step} className={`va-mini-step ${phase >= idx + 2 ? 'is-on' : ''}`}>
                    <span className="va-mini-dot" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="va-mini-graph">
                <div className="va-mini-graph-label">{track.graphLabel}</div>
                <svg viewBox="0 0 240 62" className="va-mini-svg" aria-hidden="true">
                  <polyline points="2,54 34,50 68,44 102,39 136,31 172,24 206,16 238,11" className="va-mini-line-orange" />
                  <polyline points="2,52 34,49 68,47 102,43 136,39 172,34 206,30 238,24" className="va-mini-line-green" />
                </svg>
              </div>
            </div>
          </div>

          <div className="va-progress">
            <div className="va-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const NvisionAI = () => {
  const pageRef = useRef(null);
  const storyRef = useRef(null);
  const [activeSolution, setActiveSolution] = useState(0);
  const [solutionTurnDir, setSolutionTurnDir] = useState(1);
  const [activeCase, setActiveCase] = useState(0);
  const [caseDir, setCaseDir] = useState(1);
  const [orbitIconSetIndex, setOrbitIconSetIndex] = useState(0);
  const faqDefault = useMemo(() => [true, false, false, false], []);
  const [faqOpen, setFaqOpen] = useState(faqDefault);

  const orbitIconSets = useMemo(
    () => [
      [Database, Shield, Building2],
      [Radar, Cpu, Layers],
      [LineChart, Sparkles, Shield],
      [Building2, Database, Cpu],
    ],
    []
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOrbitIconSetIndex((prev) => (prev + 1) % orbitIconSets.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [orbitIconSets.length]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.78,
      smoothWheel: true,
      wheelMultiplier: 1.08,
      touchMultiplier: 1.05,
      infinite: false,
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-chip', {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out',
      });

      gsap.to('.hero-glow-orb', {
        xPercent: 10,
        yPercent: -14,
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      const useLightStoryScroll = window.matchMedia('(max-width: 1100px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (useLightStoryScroll) {
        gsap.set('.story-meter-fill', { height: '100%' });
      } else {
        gsap.timeline({
          scrollTrigger: {
            trigger: storyRef.current,
            start: 'top 72%',
            end: 'bottom 40%',
            scrub: 0.45,
          },
        })
          .fromTo(
            '.story-track',
            { yPercent: 0 },
            { yPercent: -12, ease: 'none' },
            0
          )
          .fromTo(
            '.story-meter-fill',
            { height: '0%' },
            { height: '100%', ease: 'none' },
            0
          );
      }

      gsap.utils.toArray('.reveal-section').forEach((section) => {
        gsap.from(section, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%',
          },
        });
      });

      gsap.utils.toArray('.platform-card').forEach((card, index) => {
        gsap.from(card, {
          y: 44,
          opacity: 0,
          duration: 0.72,
          delay: index * 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
          },
        });

        ScrollTrigger.create({
          trigger: card,
          start: 'top 92%',
          end: 'bottom 8%',
          onEnter: () => card.classList.add('is-live'),
          onEnterBack: () => card.classList.add('is-live'),
          onLeave: () => card.classList.remove('is-live'),
          onLeaveBack: () => card.classList.remove('is-live'),
        });
      });

      gsap.utils.toArray('.market-premium-card, .gtm-premium-card').forEach((card, index) => {
        gsap.from(card, {
          y: 56,
          scale: 0.96,
          opacity: 0,
          duration: 0.86,
          delay: index * 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 86%',
          },
        });

        ScrollTrigger.create({
          trigger: card,
          start: 'top 92%',
          end: 'bottom 8%',
          onEnter: () => card.classList.add('is-live'),
          onEnterBack: () => card.classList.add('is-live'),
          onLeave: () => card.classList.remove('is-live'),
          onLeaveBack: () => card.classList.remove('is-live'),
        });
      });

      gsap.utils.toArray('.market-float, .gtm-float').forEach((blob, index) => {
        gsap.to(blob, {
          yPercent: index % 2 === 0 ? -16 : 14,
          xPercent: index % 2 === 0 ? 10 : -8,
          ease: 'none',
          scrollTrigger: {
            trigger: blob.closest('section'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCaseDir(1);
      setActiveCase((prev) => (prev + 1) % heroCases.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  const solutionTracks = [
    {
      key: 'insurance',
      title: 'Insurance Vision Intelligence',
      subtitle: 'Claims · Property · Fleet · Workers Comp',
      desc: 'Automate claims processing, fraud detection, and property inspection across every line of business.',
      points: [
        {
          title: 'Auto Claims (ClaimsVision)',
          desc: 'Accident detection, severity classification, staged fraud identification, and automated FNOL processing.',
          metric: 'Process 10,000 claims/hour · 95% fraud detection rate',
          badge: 'Core',
        },
        {
          title: 'Property Inspection (PropertyInspect AI)',
          desc: 'Drone and photo analysis for roof damage, hail, water, fire, and storm damage assessment from imagery.',
          metric: 'Inspect 100 roofs/day vs 8-10 manual · 80% cost reduction',
        },
        {
          title: 'Workers Compensation (SafetyWatch AI)',
          desc: 'Workplace accident detection, PPE compliance monitoring, and injury severity classification for facility cameras.',
          metric: 'Reduce fraudulent claims by 30% · Real-time alerts',
        },
        {
          title: 'Commercial Fleet (FleetProtect AI)',
          desc: 'Real-time driver behavior monitoring including distracted driving, following distance, and cargo risk.',
          metric: 'Telematics-integrated · Samsara, Lytx, Geotab ready',
        },
      ],
      label: 'Insurance',
      integrations: ['Guidewire', 'Duck Creek', 'Mitchell', 'CCC Intelligent', 'Snapsheet', 'Majesco'],
    },
    {
      key: 'banking',
      title: 'Banking Vision Intelligence',
      subtitle: 'Security · Fraud · Collateral · Branch Ops',
      desc: 'Enhance physical security, detect ATM fraud, and monitor high-value collateral automatically.',
      points: [
        {
          title: 'ATM & Branch Security (BankGuard)',
          desc: 'Detect loitering, card skimmers, and threat behavior at 24/7 self-service and branch environments.',
          metric: 'Instant incident clipping · Alert dispatch in seconds',
          badge: 'Core',
        },
        {
          title: 'KYC & Document Fraud (DocuVerify)',
          desc: 'Automated verification for checks, IDs, and onboarding documents with tamper and forgery detection.',
          metric: 'Sub-2 second verification · False positives reduced',
        },
        {
          title: 'Collateral Monitoring (AssetMonitor)',
          desc: 'Remote construction and inventory verification for commercial lending and collateral-backed portfolios.',
          metric: 'Cut audit turnaround by 60% · Fewer on-site visits',
        },
        {
          title: 'Vault & Cash Operations',
          desc: 'Secure monitoring of cash logistics and vault access with visual workflows for compliance and review.',
          metric: 'FFIEC-ready monitoring trails · Unified control room view',
        },
      ],
      label: 'Banking',
      integrations: ['Fiserv', 'FIS', 'Jack Henry', 'nCino', 'Temenos', 'Mambu'],
    },
  ];

  const platformItems = [
    {
      title: 'ClaimsVision',
      type: 'INSURANCE',
      desc: 'Auto accident detection and claims automation. Your current Percept AI, rebranded and positioned for enterprise insurance.',
      list: ['Accident detection & classification', 'Severity assessment scoring', 'Staged fraud identification', 'Automated FNOL generation', 'Subrogation fault determination'],
    },
    {
      title: 'PropertyInspect',
      type: 'INSURANCE',
      desc: 'Drone and aerial imagery analysis for P&C property claims assessment and damage documentation.',
      list: ['Roof damage detection', 'Hail & storm damage scoring', 'Water & fire damage classification', 'Pre/post loss comparison'],
    },
    {
      title: 'SafetyWatch',
      type: 'INSURANCE',
      desc: 'Workplace safety monitoring for workers compensation — incident reconstruction and PPE compliance.',
      list: ['Accident detection from CCTV', 'PPE compliance monitoring', 'Injury severity classification', 'Ergonomic risk assessment'],
    },
    {
      title: 'BankGuard',
      type: 'BANKING',
      desc: 'ATM and branch perimeter security with real-time behavioral detection and automatic incident alerting.',
      list: ['Skimming device detection', 'Loitering & threat behavior', 'Cash-in-transit monitoring', 'Evidence auto-compilation'],
    },
    {
      title: 'DocuVerify',
      type: 'BANKING',
      desc: 'AI-powered document fraud detection for check processing, KYC, and mobile deposit workflows.',
      list: ['Check forgery detection', 'ID document verification', 'Signature matching AI', 'Fraud ring pattern analysis'],
    },
    {
      title: 'AssetMonitor',
      type: 'BANKING',
      desc: 'Collateral and construction loan monitoring via drone imagery and on-site photo analysis.',
      list: ['Construction draw verification', 'Equipment lease tracking', 'Property condition scoring', 'Agricultural asset monitoring'],
    },
  ];

  const insurancePlans = [
    { name: 'STARTER', price: '$2,500', desc: '500 claims/month. Best for small insurers and MGAs getting started.', points: ['500 claims per month', 'Email support', 'ClaimsVision (auto)', 'Standard dashboard'], cta: 'Get Started' },
    { name: 'PROFESSIONAL', price: '$7,500', desc: '2,000 claims/month with phone support and API integration for regional carriers.', points: ['2,000 claims per month', 'Phone + email support', 'Full API access', '+PropertyInspect add-on', '+SafetyWatch add-on'], cta: 'Get Started', featured: true },
    { name: 'ENTERPRISE', price: '$25K+', desc: 'Unlimited claims, dedicated CSM, and custom ML model training for national carriers.', points: ['Unlimited claims', 'Dedicated CSM', 'Custom ML training', 'All modules included', 'SLA-guaranteed uptime'], cta: 'Contact Sales' },
  ];

  const bankingPlans = [
    { name: 'BANKGUARD', price: '$150', cycle: '/ATM/mo', desc: 'or $500/branch/mo · Min. 10 locations' },
    { name: 'DOCUVERIFY', price: '$0.10', cycle: '/document', desc: 'Min. 5,000 docs/mo · Volume discounts' },
    { name: 'ASSETMONITOR', price: '$50', cycle: '/asset/yr', desc: 'Min. 20 assets · Enterprise custom pricing' },
  ];

  const tamCards = [
    { title: 'Insurance TAM', value: '$91M', rows: ['Auto Claims Processing — $35M potential', 'P&C Inspection — $16M potential', 'Workers Compensation — $15M potential', 'Fleet Insurance — $25M potential'] },
    { title: 'Banking TAM', value: '$43.6M', rows: ['ATM & Branch Security — $14M potential', 'Fraud Detection — $17M potential', 'Construction Monitoring — $9.6M potential', 'Collateral Verification — $3M potential'] },
  ];

  const competitorRows = [
    { name: 'Tractable', vertical: 'Auto damage AI', weak: 'UK-based, expensive, slow US integration', adv: 'US-based, faster deployment, better pricing' },
    { name: 'Snapsheet', vertical: 'Mobile claims', weak: 'Limited AI depth, workflow-only focus', adv: 'Deeper AI analysis + fraud detection' },
    { name: 'Mitchell / CCC', vertical: 'Auto valuation', weak: 'Legacy systems, not AI-native', adv: 'Modern API-first, AI-native platform' },
    { name: 'NICE', vertical: 'Surveillance', weak: 'General purpose, expensive, complex', adv: 'Banking-specific, simpler, faster ROI' },
    { name: 'Feedzai', vertical: 'Banking fraud', weak: 'Payment fraud only, no physical security', adv: 'Combined physical + document fraud' },
    { name: 'Verafin', vertical: 'AML/Fraud', weak: 'No computer vision capability', adv: 'Video/image analysis = new fraud vectors' },
  ];

  const gtmTracks = [
    {
      title: 'Insurance GTM',
      subtitle: 'Strongest play — 3-6 month cycles',
      steps: [
        'Entry Point: "Free accident analysis for your top 10 disputed claims" — show value in days, not months.',
        'Pilot: 90-day trial processing 500-1,000 claims with full ROI tracking and reporting.',
        'Expansion: Full platform API integration + upsell PropertyInspect and SafetyWatch modules.',
        'Target Segments: Regional/mid-market insurers ($500M-$5B premiums), MGAs/TPAs, fleet insurance specialists.',
      ],
    },
    {
      title: 'Banking GTM',
      subtitle: 'Higher barrier, higher value',
      steps: [
        'Entry Point: "Free security audit of 1 month of ATM footage" — prove detection capability before commitment.',
        'Pilot: 30-day trial on 10-20 ATMs/branches with documented incident detection vs. manual.',
        'Expansion: Multi-location rollout + add DocuVerify for fraud and AssetMonitor for construction loans.',
        'Target Segments: Regional banks ($1B-$50B assets), credit unions, fintech construction/equipment lenders.',
      ],
    },
  ];

  const OrbitIconA = orbitIconSets[orbitIconSetIndex][0];
  const OrbitIconB = orbitIconSets[orbitIconSetIndex][1];
  const OrbitIconC = orbitIconSets[orbitIconSetIndex][2];
  const currentSolution = solutionTracks[activeSolution];

  return (
    <div className="nvision-page" ref={pageRef}>
      <header className="top-nav">
        <div className="brand serif">Nvision<span>AI</span></div>
        <nav className="top-nav-links">
          <a href="#solutions">Solutions</a>
          <a href="#platform">Platform</a>
          <a href="#pricing">Pricing</a>
          <a href="#market">Market</a>
          <a href="#gtm">GTM</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className="btn-primary">Get Early Access</button>
      </header>

      <main>
        <section className="hero-section reveal-section">
          <div className="hero-glow-orb" aria-hidden="true"></div>
          <div className="hero-grid">
            <div>
              <div className="eyebrow">Enterprise Computer Vision · Financial Services</div>
              <h1 className="hero-title">
                <span className="accent serif">Vision Intelligence</span> <br /> for Insurance &amp; Banking
              </h1>
              <p className="hero-sub">
                One AI platform — trained on millions of financial services images — automating claims, fraud detection, security monitoring, and collateral verification at scale.
              </p>
              <div className="hero-actions">
                <button className="btn-primary">Explore Solutions <ArrowRight size={17} /></button>
                <button className="btn-secondary">View Platform</button>
              </div>
              <div className="hero-chip-row">
                {['SOC 2 TYPE II', 'GLBA COMPLIANT', 'PCI DSS', 'FFIEC READY'].map((chip) => (
                  <span key={chip} className="hero-chip">{chip}</span>
                ))}
              </div>
            </div>

            <div className="hero-visual-wrap">
              <div className="hero-three"><VisionAnalyzer /></div>
            </div>
          </div>
        </section>

        <section className="stats-section reveal-section">
          <div className="stats-grid">
            <article className="stat-card"><h3><Counter to={95} suffix="%+" /></h3><p>Fraud Detection Accuracy</p></article>
            <article className="stat-card"><h3><Counter to={10000} /></h3><p>Claims/Hour Processed</p></article>
            <article className="stat-card"><h3><Counter to={70} suffix="%" /></h3><p>Reduction in Manual Review</p></article>
            <article className="stat-card"><h3>$<Counter to={134} suffix="M+" /></h3><p>Total Addressable Opportunity</p></article>
          </div>
        </section>

        <section id="solutions" className="solutions-section reveal-section">
          <div className="section-head">
            <div className="eyebrow">Industry Solutions</div>
            <h2 className="section-title">Purpose-built for Financial Services</h2>
            <p className="section-copy">Specialized AI models trained on industry-specific data, not generic computer vision.</p>
          </div>
          <div className="solutions-shell">
            <aside className="solutions-rail">
              {solutionTracks.map((track, idx) => (
                <button
                  key={track.key}
                  type="button"
                  className={`solutions-rail-item ${idx === activeSolution ? 'active' : ''}`}
                  onClick={() => {
                    if (idx === activeSolution) return;
                    setSolutionTurnDir(idx > activeSolution ? 1 : -1);
                    setActiveSolution(idx);
                  }}
                >
                  <div className="solutions-rail-icon">
                    {track.key === 'insurance' ? <Shield size={16} /> : <Building2 size={16} />}
                  </div>
                  <div className="solutions-rail-title">{track.label}</div>
                  <div className="solutions-rail-subtitle">{track.subtitle}</div>
                </button>
              ))}
            </aside>

            <div className="solutions-main-stage">
              <AnimatePresence mode="wait" initial={false} custom={solutionTurnDir}>
                <motion.article
                  key={currentSolution.key}
                  className="solutions-main"
                  custom={solutionTurnDir}
                  variants={turnVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3>{currentSolution.title}</h3>
                  <p className="solution-desc">{currentSolution.desc}</p>

                  <div className="solutions-main-grid">
                    {currentSolution.points.map((point) => (
                      <div className="solutions-main-card" key={point.title}>
                        <div className="solutions-main-card-head">
                          <h4>{point.title}</h4>
                          {point.badge ? <span className="solutions-core-badge">{point.badge}</span> : null}
                        </div>
                        <p>{point.desc}</p>
                        <div className="solution-metric">{point.metric}</div>
                      </div>
                    ))}
                  </div>

                  <div className="solutions-integrations">
                    <div className="solutions-integrations-label">Integrations</div>
                    <div className="solutions-integrations-row">
                      {currentSolution.integrations.map((item) => (
                        <span key={item} className="solutions-integrations-pill">{item}</span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section id="platform" className="story-shell reveal-section" ref={storyRef}>
          <div className="section-head">
            <div className="eyebrow">NeuzenAI Vision Platform</div>
            <h2 className="section-title">One platform. Six specialized solutions.</h2>
            <p className="section-copy">"Enterprise Computer Vision for Financial Services"</p>
          </div>
          <div className="platform-grid">
            {platformItems.map((item, idx) => (
              <article className="platform-card" key={item.title}>
                <div className="platform-top">
                  <span className="platform-tag">{item.type}</span>
                  <span className="platform-no">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <ul>
                  {item.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <article className="unified-prop">
            <h3>Unified Value Proposition</h3>
            <p>One AI platform, trained on 10M+ financial services images, reducing manual review by 70% across claims, security, and compliance use cases.</p>
          </article>
        </section>

        <section id="pricing" className="pricing-section reveal-section">
          <div className="section-head">
            <div className="eyebrow">Pricing</div>
            <h2 className="section-title">Transparent, scalable pricing</h2>
            <p className="section-copy">Insurance: SaaS subscription model. Banking: per-location hybrid model.</p>
          </div>

          <div className="section-copy" style={{ marginBottom: '0.9rem', fontFamily: 'DM Mono, monospace', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Insurance — ClaimsVision</div>
          <div className="pricing-grid">
            {insurancePlans.map((plan) => (
              <article key={plan.name} className={`price-panel ${plan.featured ? 'featured' : ''}`}>
                <h3>{plan.name}</h3>
                <p className="price-value">{plan.price}</p>
                <p style={{ margin: '-0.35rem 0 0', fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{plan.cycle || 'per month'}</p>
                <p style={{ margin: '0.35rem 0 0', lineHeight: '1.5', fontWeight: 600 }}>{plan.desc}</p>
                <ul>
                  {plan.points.map((point) => (
                    <li key={point}><Check size={14} /> {point}</li>
                  ))}
                </ul>
                <button className={plan.featured ? 'btn-primary' : 'btn-secondary'}>{plan.cta}</button>
              </article>
            ))}
          </div>

          <div className="section-copy" style={{ marginTop: '2rem', marginBottom: '0.9rem', fontFamily: 'DM Mono, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)' }}>Banking — Per-Location Model</div>
          <div className="pricing-grid pricing-grid-banking">
            {bankingPlans.map((plan) => (
              <article key={plan.name} className="price-panel price-panel-banking" style={{ borderColor: 'var(--green-mid)', boxShadow: '0 12px 28px rgba(22, 163, 74, 0.12)' }}>
                <h3>{plan.name}</h3>
                <p className="price-value">{plan.price} <span style={{ fontSize: '1.05rem' }}>{plan.cycle}</span></p>
                <p style={{ margin: '0.35rem 0 0', lineHeight: '1.5', fontWeight: 600 }}>{plan.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="market" className="market-section reveal-section">
          <div className="market-float market-float-a" aria-hidden="true"></div>
          <div className="market-float market-float-b" aria-hidden="true"></div>
          <div className="section-head">
            <div className="eyebrow">Market Opportunity</div>
            <h2 className="section-title"><span className="market-value-inline">$<Counter to={134} suffix="M+" /></span> combined revenue potential</h2>
            <p className="section-copy">At minimal market share across both verticals.</p>
          </div>

          <div className="market-premium-grid">
            {tamCards.map((card, idx) => (
              <article key={card.title} className="tam-card market-premium-card">
                <div className="tam-head">
                  <div className="tam-head-main">
                    <span className="tam-icon-chip">{idx === 0 ? <Shield size={14} /> : <Building2 size={14} />}</span>
                    <h3>{card.title}</h3>
                  </div>
                  <span className="tam-value-live">
                    $
                    {idx === 0 ? (
                      <DecimalCounter to={91} suffix="M" precision={0} />
                    ) : (
                      <DecimalCounter to={43.6} suffix="M" precision={1} />
                    )}
                  </span>
                </div>
                <ul>
                  {card.rows.map((row) => (
                    <li key={row}><span className="tam-bullet"></span><span>{row}</span></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="competition-section reveal-section">
          <div className="section-head">
            <div className="eyebrow">Competitive Landscape</div>
            <h2 className="section-title">Where NvisionAI wins</h2>
            <p className="section-copy">Purpose-built for financial services vs. generic incumbents.</p>
          </div>
          <div className="comp-table">
            <div className="comp-head" aria-hidden="true">
              <div className="comp-head-no">#</div>
              <div>Competitor</div>
              <div>Category</div>
              <div>Current Limitation</div>
              <div>NvisionAI Advantage</div>
            </div>
            {competitorRows.map((row, index) => (
              <article key={row.name} className="comp-row">
                <div className="comp-no">{String(index + 1).padStart(2, '0')}</div>
                <div className="comp-name">
                  <span className="comp-mobile-label">Competitor</span>
                  {row.name}
                </div>
                <div className="comp-vertical">
                  <span className="comp-mobile-label">Category</span>
                  <span className="comp-vertical-pill">{row.vertical}</span>
                </div>
                <div className="comp-weak">
                  <span className="comp-mobile-label">Current Limitation</span>
                  {row.weak}
                </div>
                <div className="comp-adv">
                  <span className="comp-mobile-label">NvisionAI Advantage</span>
                  {row.adv}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="gtm" className="gtm-section reveal-section">
          <div className="gtm-float gtm-float-a" aria-hidden="true"></div>
          <div className="gtm-float gtm-float-b" aria-hidden="true"></div>
          <div className="section-head">
            <div className="eyebrow">Go-To-Market Playbook</div>
            <h2 className="section-title">Sales playbook by vertical</h2>
          </div>

          <div className="gtm-premium-grid">
            {gtmTracks.map((track, trackIdx) => (
              <article key={track.title} className="gtm-card gtm-premium-card">
                <div className="gtm-premium-head">
                  <span className="gtm-icon-chip">{trackIdx === 0 ? <Shield size={14} /> : <Building2 size={14} />}</span>
                  <h3>{track.title}</h3>
                </div>
                <p className="gtm-subline">{track.subtitle}</p>
                <ol>
                  {track.steps.map((step, idx) => (
                    <li key={step}><span className="gtm-step-no">0{idx + 1}</span><span>{step}</span></li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        <section className="final-combined reveal-section">
          <div className="footer-stage">
            <div className="footer-orbit" aria-hidden="true">
              <div className="orbit-arc"></div>
              <div className="orbit-node orbit-node-a"><OrbitIconA size={16} /></div>
              <div className="orbit-node orbit-node-b"><OrbitIconB size={16} /></div>
              <div className="orbit-node orbit-node-c"><OrbitIconC size={16} /></div>
            </div>

            <div className="footer-ticket">
              <span className="ticket-wing ticket-wing-left" aria-hidden="true"></span>
              <span className="ticket-wing ticket-wing-right" aria-hidden="true"></span>

              <div className="ticket-side ticket-side-left">
                <div className="ticket-side-content ticket-side-content-left">
                  <div className="logo serif footer-logo-inline">Nvision<span className="gold">AI</span> <span className="footer-by">· by NeuzenAI</span></div>
                  <div className="footer-subtext">Enterprise Computer Vision for Financial Services</div>
                </div>
              </div>
              <div className="ticket-core">
                <div className="ticket-badge">NV</div>
                <h2 className="cta-headline serif">Your data has the answers. You just can&apos;t reach them yet.</h2>
                <p className="cta-sub">NvisionAI unifies claims intelligence, fraud detection, and risk operations so every decision runs on one trusted visual system.</p>
                <div className="hero-btns">
                  <button className="btn-primary">Book a Demo <ArrowRight size={16} /></button>
                  <button className="btn-secondary">Talk to Sales</button>
                </div>
              </div>
              <div className="ticket-side ticket-side-right">
                <div className="ticket-side-content ticket-side-content-right">
                  <div>IN India: +91 88852 57422</div>
                  <div>US USA: +1 972 372 9983</div>
                  <div className="gold-email">contact@neuzenai.com</div>
                  <div className="copyright">© 2025 NeuzenAI. T-Hub Phase 2, Hyderabad, India.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NvisionAI;
