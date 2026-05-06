
import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import {
  Shield,
  Building2,
  ArrowRight,
  Check,
  Sparkle,
} from 'lucide-react';
import './NvisionAI.css';

/* ---------------- Animated counter ---------------- */
const Counter = ({
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.8,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => {
    const num = decimals
      ? Number(v).toFixed(decimals)
      : Math.round(v).toLocaleString();
    return `${prefix}${num}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [inView, to, duration, mv]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

/* ---------------- Reusable motion variants ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } },
};
const sectionViewport = { once: true, amount: 0.15 };

/* ---------------- Section wrapper ---------------- */
const Section = ({ as = 'section', className, id, children }) => (
  <motion.section
    id={id}
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={sectionViewport}
    variants={fadeUp}
  >
    {children}
  </motion.section>
);

const NvisionAI = () => {
  const [activeTab, setActiveTab] = useState('insurance');

  const solutions = {
    insurance: {
      icon: <Shield size={24} />,
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
      icon: <Building2 size={24} />,
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
    { title: 'ClaimsVision', type: 'INSURANCE', desc: 'Auto accident detection and claims automation. Your current Percept AI, rebranded and positioned for enterprise insurance.', list: ['Accident detection & classification', 'Severity assessment scoring', 'Staged fraud identification', 'Automated FNOL generation', 'Subrogation fault determination'] },
    { title: 'PropertyInspect', type: 'INSURANCE', desc: 'Drone and aerial imagery analysis for P&C property claims assessment and damage documentation.', list: ['Roof damage detection', 'Hail & storm damage scoring', 'Water & fire damage classification', 'Pre/post loss comparison'] },
    { title: 'SafetyWatch', type: 'INSURANCE', desc: 'Workplace safety monitoring for workers compensation — incident reconstruction and PPE compliance.', list: ['Accident detection from CCTV', 'PPE compliance monitoring', 'Injury severity classification', 'Ergonomic risk assessment'] },
    { title: 'BankGuard', type: 'BANKING', desc: 'ATM and branch perimeter security with real-time behavioral detection and automatic incident alerting.', list: ['Skimming device detection', 'Loitering & threat behavior', 'Cash-in-transit monitoring', 'Evidence auto-compilation'] },
    { title: 'DocuVerify', type: 'BANKING', desc: 'AI-powered document fraud detection for check processing, KYC, and mobile deposit workflows.', list: ['Check forgery detection', 'ID document verification', 'Signature matching AI', 'Fraud ring pattern analysis'] },
    { title: 'AssetMonitor', type: 'BANKING', desc: 'Collateral and construction loan monitoring via drone imagery and on-site photo analysis.', list: ['Construction draw verification', 'Equipment lease tracking', 'Property condition scoring', 'Agricultural asset monitoring'] },
  ];

  const insurancePlans = [
    { name: 'STARTER', price: '$2,500', desc: '500 claims/month. Best for small insurers and MGAs getting started.', features: ['500 claims per month', 'Email support', 'ClaimsVision (auto)', 'Standard dashboard'], btn: 'Get Started' },
    { name: 'PROFESSIONAL', price: '$7,500', popular: true, desc: '2,000 claims/month with phone support and API integration for regional carriers.', features: ['2,000 claims per month', 'Phone + email support', 'Full API access', '+PropertyInspect add-on', '+SafetyWatch add-on'], btn: 'Get Started' },
    { name: 'ENTERPRISE', price: '$25K+', desc: 'Unlimited claims, dedicated CSM, and custom ML model training for national carriers.', features: ['Unlimited claims', 'Dedicated CSM', 'Custom ML training', 'All modules included', 'SLA-guaranteed uptime'], btn: 'Contact Sales' },
  ];

  const bankingPlans = [
    { name: 'BANKGUARD', price: '$150', cycle: '/ATM/mo', desc: 'or $500/branch/mo · Min. 10 locations', dark: true },
    { name: 'DOCUVERIFY', price: '$0.10', cycle: '/document', desc: 'Min. 5,000 docs/mo · Volume discounts', dark: true },
    { name: 'ASSETMONITOR', price: '$50', cycle: '/asset/yr', desc: 'Min. 20 assets · Enterprise custom pricing', dark: true },
  ];

  return (
    <div className="nvision-wrapper">
      <motion.nav
        className="navbar"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="logo serif">Nvision<span className="gold">AI</span></div>
        <div className="nav-links">
          <a href="#solutions">Solutions</a>
          <a href="#platform">Platform</a>
          <a href="#pricing">Pricing</a>
          <a href="#market">Market</a>
          <a href="#gtm">GTM</a>
        </div>
        <div className="nav-actions">
          <button className="btn-nav">Get Early Access</button>
        </div>
      </motion.nav>

      <main className="main-content">
        <section className="hero">
          <div className="hero-eyebrow">
            <span className="eyebrow-a">Enterprise Computer Vision</span>
            <span className="eyebrow-dot"> · </span>
            <span className="eyebrow-b">Financial Services</span>
          </div>
          <h1 className="hero-title">
            <span className="gold serif">Vision Intelligence</span> <br /> for Insurance &amp; Banking
          </h1>
          <p className="hero-sub">
            One AI platform — trained on millions of financial services images — automating claims, fraud detection, security monitoring, and collateral verification at scale.
          </p>
          <div className="hero-btns">
            <button className="btn-gold sparkle-btn">
              <Sparkle size={14} className="sparkle s1" />
              <Sparkle size={9} className="sparkle s2" />
              <Sparkle size={7} className="sparkle s3" />
              <Sparkle size={6} className="sparkle s4" />
              <span className="btn-label">Explore Solutions</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn-outline">View Platform</button>
          </div>

          <div className="hero-badges">
            <div className="badge-item">SOC 2 TYPE II</div>
            <div className="badge-item">GLBA COMPLIANT</div>
            <div className="badge-item">PCI DSS</div>
            <div className="badge-item">FFIEC READY</div>
          </div>
        </section>
      </main>

      {/* STATS BAR */}
      <motion.section
        className="stats-bar"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={sectionViewport}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="stat-item">
          <div className="stat-val"><Counter to={95} suffix="%+" /></div>
          <div className="stat-lab">Fraud Detection Accuracy</div>
        </div>
        <div className="stat-item">
          <div className="stat-val"><Counter to={10000} /></div>
          <div className="stat-lab">Claims/Hour Processed</div>
        </div>
        <div className="stat-item">
          <div className="stat-val"><Counter to={70} suffix="%" /></div>
          <div className="stat-lab">Reduction in Manual Review</div>
        </div>
        <div className="stat-item last">
          <div className="stat-val"><Counter to={134} prefix="$" suffix="M+" /></div>
          <div className="stat-lab">Total Addressable Opportunity</div>
        </div>
      </motion.section>

      {/* SOLUTIONS */}
      <Section id="solutions" className="solutions-section">
        <div className="sol-eyebrow">Industry Solutions</div>
        <h2 className="sol-title">Purpose-built <span className="title-accent">for Financial Services</span></h2>
        <p className="sol-sub">Specialized AI models trained on industry-specific data, not generic computer vision.</p>
        <div className="tabs-box">
          <div className="tabs-aside">
            {Object.keys(solutions).map(id => (
              <button
                key={id}
                className={`tab-btn ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <div className="tab-icon">{solutions[id].icon}</div>
                <div className="tab-label-group">
                  <div className="tab-label serif">{solutions[id].title}</div>
                  <div className="tab-sub-labels">{solutions[id].subtitle}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="tabs-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <h3 className="panel-title serif">{solutions[activeTab].mainTitle}</h3>
                <p className="panel-sub">{solutions[activeTab].mainDesc}</p>

                <motion.div
                  className="panel-grid"
                  variants={staggerParent}
                  initial="hidden"
                  animate="visible"
                >
                  {solutions[activeTab].items.map((item, idx) => (
                    <motion.div key={idx} className="uc-card" variants={cardItem}>
                      <div className="uc-title-row">
                        <span className="uc-title-text">{item.t}</span>
                        {item.core && <span className="uc-core-badge">CORE</span>}
                      </div>
                      <div className="uc-content">{item.c}</div>
                      <div className="uc-metric">{item.m}</div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="integrations-row">
                  <span className="int-label">Integrations</span>
                  <div className="int-pills">
                    {solutions[activeTab].integrations.map(int => (
                      <span key={int} className="int-pill">{int}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Section>

      {/* PLATFORM */}
      <Section id="platform" className="platform-section">
        <div className="plat-eyebrow">NeuzenAI Vision Platform</div>
        <h2 className="plat-title serif">One platform. <span className="title-accent">Six specialized solutions.</span></h2>
        <p className="plat-sub">"Enterprise Computer Vision for Financial Services"</p>

        <motion.div
          className="plat-grid"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          {platformItems.map(item => {
            // Split CamelCase title into two parts for two-tone styling
            const split = item.title.match(/^([A-Z][a-z]+)([A-Z].*)$/);
            const titleA = split ? split[1] : item.title;
            const titleB = split ? split[2] : '';
            return (
              <motion.div key={item.title} className="plat-card" variants={cardItem}>
                <span className="plat-tag">{item.type}</span>
                <h3 className="plat-card-title serif">
                  <span className="title-a">{titleA}</span>
                  <span className="title-b">{titleB}</span>
                </h3>
                <p className="plat-card-desc">{item.desc}</p>
                <ul className="plat-card-list">
                  {item.list.map(li => <li key={li} className="plat-card-li">{li}</li>)}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="unified-value"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={sectionViewport}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h3 className="uv-title serif">Unified <span className="uv-accent">Value Proposition</span></h3>
          <p className="uv-desc">"One AI platform, trained on 10M+ financial services images, reducing manual review by 70% across claims, security, and compliance use cases."</p>
        </motion.div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" className="pricing-section">
        <div className="price-eyebrow">Pricing</div>
        <h2 className="price-title">Transparent, <span className="title-accent">scalable pricing</span></h2>
        <p className="price-sub">Insurance: SaaS subscription model. Banking: per-location hybrid model.</p>

        <div className="price-context">INSURANCE — CLAIMSVISION</div>

        <motion.div
          className="price-grid"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          {insurancePlans.map(plan => (
            <motion.div
              key={plan.name}
              className={`price-card ${plan.popular ? 'popular' : ''}`}
              variants={cardItem}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price serif">{plan.price}</div>
              <div className="plan-cycle">per month</div>
              <p className="plan-desc">{plan.desc}</p>
              <ul className="plan-features">
                {plan.features.map(f => (
                  <li key={f} className="feature-item">
                    <Check size={16} className="check-icon" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`plan-btn ${plan.popular ? 'btn-filled' : 'btn-light'}`}>{plan.btn}</button>
            </motion.div>
          ))}
        </motion.div>

        <div className="price-context banking">BANKING — PER-LOCATION MODEL</div>

        <motion.div
          className="price-grid"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          {bankingPlans.map(plan => (
            <motion.div
              key={plan.name}
              className={`price-card ${plan.dark ? 'dark' : ''}`}
              variants={cardItem}
            >
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price-row">
                <span className="plan-price serif">{plan.price}</span>
                <span className="plan-cycle-inline">{plan.cycle}</span>
              </div>
              <p className="plan-desc">{plan.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* MARKET / TAM */}
      <Section id="market" className="market-section">
        <div className="price-eyebrow">Market Opportunity</div>
        <h2 className="price-title">$134M+ combined revenue potential</h2>
        <p className="price-sub">At minimal market share across both verticals.</p>

        <motion.div
          className="market-grid"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          <motion.div className="tam-card" variants={cardItem}>
            <div className="tam-header">
              <div className="tam-icon-box insurance"><Shield size={18} /></div>
              <div className="tam-tl-title">INSURANCE</div>
              <div className="tam-total">$<Counter to={91} suffix="M" /></div>
            </div>
            <div className="tam-timeline">
              <div className="tam-item">
                <div className="tam-dot"></div>
                <div className="tam-name">Auto Claims Processing</div>
                <div className="tam-amt">$35M</div>
              </div>
              <div className="tam-item">
                <div className="tam-dot"></div>
                <div className="tam-name">P&amp;C Inspection</div>
                <div className="tam-amt">$16M</div>
              </div>
              <div className="tam-item">
                <div className="tam-dot"></div>
                <div className="tam-name">Workers Compensation</div>
                <div className="tam-amt">$15M</div>
              </div>
              <div className="tam-item">
                <div className="tam-dot"></div>
                <div className="tam-name">Fleet Insurance</div>
                <div className="tam-amt">$25M</div>
              </div>
            </div>
          </motion.div>

          <motion.div className="tam-card" variants={cardItem}>
            <div className="tam-header">
              <div className="tam-icon-box banking"><Building2 size={18} /></div>
              <div className="tam-tl-title">BANKING</div>
              <div className="tam-total">$<Counter to={43.6} decimals={1} suffix="M" /></div>
            </div>
            <div className="tam-timeline">
              <div className="tam-item">
                <div className="tam-dot"></div>
                <div className="tam-name">ATM &amp; Branch Security</div>
                <div className="tam-amt">$14M</div>
              </div>
              <div className="tam-item">
                <div className="tam-dot"></div>
                <div className="tam-name">Fraud Detection</div>
                <div className="tam-amt">$17M</div>
              </div>
              <div className="tam-item">
                <div className="tam-dot"></div>
                <div className="tam-name">Construction Monitoring</div>
                <div className="tam-amt">$9.6M</div>
              </div>
              <div className="tam-item">
                <div className="tam-dot"></div>
                <div className="tam-name">Collateral Verification</div>
                <div className="tam-amt">$3M</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* COMPETITION — card-row board */}
      <Section className="comp-section">
        <div className="price-eyebrow">Competitive Landscape</div>
        <h2 className="price-title">Where <span className="title-accent">NvisionAI wins</span></h2>
        <p className="price-sub">Purpose-built for financial services vs. generic incumbents.</p>

        <div className="comp-board">
          <div className="comp-board-head">
            <div className="ch-no">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 5h10M3 11h10M6 2L4 14M12 2L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>No</span>
            </div>
            <div className="ch-name">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Competitor</span>
            </div>
            <div className="ch-vert">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 7l5-5 7 7-5 5-7-7zM5 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Vertical</span>
            </div>
            <div className="ch-weak">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Their Weakness</span>
            </div>
            <div className="ch-adv">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 5h10v3a5 5 0 01-10 0V5zM6 13h4M8 11v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>NvisionAI Advantage</span>
            </div>
            <div className="ch-status">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Status</span>
            </div>
          </div>

          <motion.div
            className="comp-rows"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
          >
            {[
              { name: 'Tractable',       vert: 'Auto damage AI',   weak: 'UK-based, expensive, slow US integration', adv: 'US-based, faster deployment, better pricing' },
              { name: 'Snapsheet',       vert: 'Mobile claims',    weak: 'Limited AI depth, workflow-only focus',     adv: 'Deeper AI analysis + fraud detection' },
              { name: 'Mitchell / CCC',  vert: 'Auto valuation',   weak: 'Legacy systems, not AI-native',             adv: 'Modern API-first, AI-native platform' },
              { name: 'NICE',            vert: 'Surveillance',     weak: 'General purpose, expensive, complex',        adv: 'Banking-specific, simpler, faster ROI' },
              { name: 'Feedzai',         vert: 'Banking fraud',    weak: 'Payment fraud only, no physical security',   adv: 'Combined physical + document fraud' },
              { name: 'Verafin',         vert: 'AML/Fraud',        weak: 'No computer vision capability',              adv: 'Video/image analysis = new fraud vectors' },
            ].map((r, idx) => (
              <motion.div key={r.name} className="comp-row" variants={cardItem}>
                <div className="comp-row-glow" aria-hidden="true"></div>
                <div className="cr-num">{String(idx + 1).padStart(2, '0')}</div>
                <div className="cr-name">{r.name}</div>
                <div className="cr-vert"><span className="vert-pill">{r.vert}</span></div>
                <div className="cr-weak">{r.weak}</div>
                <div className="cr-adv">
                  <span className="adv-pill">
                    <span className="adv-check">✓</span>
                    {r.adv}
                  </span>
                </div>
                <div className="cr-status">
                  <span className="status-pill status-win">Win</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* GTM */}
      <Section id="gtm" className="gtm-section">
        <div className="price-eyebrow">Go-to-Market</div>
        <h2 className="price-title">Sales <span className="title-accent">playbook by vertical</span></h2>
        <motion.div
          className="gtm-grid"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
        >
          <motion.div className="gtm-card" variants={cardItem}>
            <span className="gtm-tag">INSURANCE</span>
            <h3 className="gtm-card-title serif">
              <span className="title-a">Insurance</span>
              <span className="title-b">GTM</span>
            </h3>
            <p>Strongest play — 3-6 month cycles</p>
            <div className="gtm-steps">
              {[
                { num: '01', title: 'Entry Point', desc: "'Free accident analysis for your top 10 disputed claims' — show value in days, not months." },
                { num: '02', title: 'Pilot', desc: '90-day trial processing 500-1,000 claims with full ROI tracking and reporting.' },
                { num: '03', title: 'Expansion', desc: 'Full platform API integration + upsell PropertyInspect and SafetyWatch modules.' },
                { num: '04', title: 'Target Segments', desc: 'Regional/mid-market insurers ($500M-$5B premiums), MGAs/TPAs, fleet insurance specialists.' },
              ].map(s => (
                <div key={s.num} className="gtm-step">
                  <div className="step-num">{s.num}</div>
                  <div className="step-content"><div className="step-title serif">{s.title}</div><div className="step-desc">{s.desc}</div></div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="gtm-card" variants={cardItem}>
            <span className="gtm-tag">BANKING</span>
            <h3 className="gtm-card-title serif">
              <span className="title-a">Banking</span>
              <span className="title-b">GTM</span>
            </h3>
            <p>Higher barrier, higher value</p>
            <div className="gtm-steps">
              {[
                { num: '01', title: 'Entry Point', desc: "'Free security audit of 1 month of ATM footage' — prove detection capability before commitment." },
                { num: '02', title: 'Pilot', desc: '30-day trial on 10-20 ATMs/branches with documented incident detection vs. manual.' },
                { num: '03', title: 'Expansion', desc: 'Multi-location rollout + add DocuVerify for fraud and AssetMonitor for construction loans.' },
                { num: '04', title: 'Target Segments', desc: 'Regional banks ($1B-$50B assets), credit unions, fintech construction/equipment lenders.' },
              ].map(s => (
                <div key={s.num} className="gtm-step">
                  <div className="step-num">{s.num}</div>
                  <div className="step-content"><div className="step-title serif">{s.title}</div><div className="step-desc">{s.desc}</div></div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* COMBINED FINAL CTA + FOOTER */}
      <motion.section
        className="final-combined"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={sectionViewport}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <div className="cta-block text-center">
          <div className="hero-eyebrow" style={{ justifyContent: 'center' }}>Ready to get started?</div>
          <h2 className="cta-headline serif">See NvisionAI in action</h2>
          <p className="cta-sub">Book a 30-minute demo tailored to your vertical — insurance or banking.</p>
          <div className="hero-btns" style={{ justifyContent: 'center' }}>
            <button className="btn-gold sparkle-btn">
              <Sparkle size={14} className="sparkle s1" />
              <Sparkle size={9} className="sparkle s2" />
              <Sparkle size={7} className="sparkle s3" />
              <Sparkle size={6} className="sparkle s4" />
              <span className="btn-label">Book a Demo</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn-outline">Talk to Sales</button>
          </div>
        </div>

        <div className="cta-divider"></div>

        <div className="footer-block">
          <div className="footer-left">
            <div className="logo serif" style={{ marginBottom: '0.75rem' }}>Nvision<span className="gold">AI</span> <span style={{ color: '#000000', fontSize: '1rem', fontWeight: 'bold' }}>· by NeuzenAI</span></div>
            <div className="footer-subtext">Enterprise Computer Vision for Financial Services</div>
          </div>
          <div className="footer-right">
            <div className="contact-info">
              <div>IN India: +91 88852 57422</div>
              <div>us USA: +1 972 372 9983</div>
              <div className="gold-email">contact@neuzenai.com</div>
              <div className="copyright">© 2025 NeuzenAI. T-Hub Phase 2, Hyderabad, India.</div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default NvisionAI;
