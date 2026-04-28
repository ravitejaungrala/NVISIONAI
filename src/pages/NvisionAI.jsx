
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Building2,
  ArrowRight,
  Check
} from 'lucide-react';
import './NvisionAI.css';

const NvisionAI = () => {
  const [activeTab, setActiveTab] = useState('insurance');

  const solutions = {
    insurance: {
      icon: <Shield size={24} />,
      title: "Insurance",
      subtitle: "Claims · Property · Fleet · Workers Comp",
      mainTitle: "Insurance Vision Intelligence",
      mainDesc: "Automate claims processing, fraud detection, and property inspection across every line of business.",
      items: [
        { t: "Auto Claims (ClaimsVision)", c: "Accident detection, severity classification, staged fraud identification, and automated FNOL processing.", m: "Process 10,000 claims/hour · 95% fraud detection rate", core: true },
        { t: "Property Inspection (PropertyInspect AI)", c: "Drone and photo analysis for roof damage, hail, water, fire, and storm damage assessment from imagery.", m: "Inspect 100 roofs/day vs 8-10 manual · 80% cost reduction" },
        { t: "Workers Compensation (SafetyWatch AI)", c: "Workplace accident detection, PPE compliance monitoring, injury severity classification from facility cameras.", m: "Reduce fraudulent claims by 30% · Real-time alerts" },
        { t: "Commercial Fleet (FleetProtect AI)", c: "Real-time driver behavior monitoring — distracted driving, following distance, load security for cargo insurance.", m: "Telematics-integrated · Samsara, Lytx, Geotab ready" }
      ],
      integrations: ["Guidewire", "Duck Creek", "Mitchell", "CCC Intelligent", "Snapsheet", "Majesco"]
    },
    banking: {
      icon: <Building2 size={24} />,
      title: "Banking",
      subtitle: "Security · Fraud · Collateral · Branch Ops",
      mainTitle: "Banking Vision Intelligence",
      mainDesc: "Enhance physical security, detect ATM fraud, and monitor high-value collateral automatically.",
      items: [
        { t: "ATM & Branch Security", c: "Detect loitering, card skimmers, and suspicious behavior at 24/7 self-service terminals.", m: "99% uptime on security monitoring · Global deployment" },
        { t: "KYC & Document Fraud", c: "Automated verification of physical identity documents and deepfake detection for remote onboarding.", m: "Sub-2 second verification · Compliance ready" },
        { t: "Collateral Verification", c: "Remote monitoring of inventory, real-estate assets, and construction progress for risk mitigation.", m: "Real-time asset tracking · 40% faster appraisals" },
        { t: "Vault & Cash Operations", c: "Secure monitoring of cash-in-transit and vault access with multi-factor visual authentication.", m: "Audit-ready logs · Zero breach history" }
      ],
      integrations: ["Jack Henry", "FIS", "Fiserv", "nCino", "Salesforce", "Infor"]
    }
  };

  return (
    <div className="nvision-wrapper">
      <nav className="navbar">
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
      </nav>

      <main className="main-content">
        <section className="hero">
          <div className="hero-eyebrow">Enterprise Computer Vision · Financial Services</div>
          <h1 className="hero-title">
            <span className="gold serif">Vision Intelligence</span> <br /> for Insurance & Banking
          </h1>
          <p className="hero-sub">
            One AI platform — trained on millions of financial services images — automating claims, fraud detection, security monitoring, and collateral verification at scale.
          </p>
          <div className="hero-btns">
            <button className="btn-gold">Explore Solutions <ArrowRight size={18} /></button>
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

      <section className="stats-bar">
        <div className="stat-item"><div className="stat-val">95%+</div><div className="stat-lab">Fraud Detection Accuracy</div></div>
        <div className="stat-item"><div className="stat-val">10,000</div><div className="stat-lab">Claims/Hour Processed</div></div>
        <div className="stat-item"><div className="stat-val">70%</div><div className="stat-lab">Reduction in Manual Review</div></div>
        <div className="stat-item last"><div className="stat-val">$134M+</div><div className="stat-lab">Total Addressable Opportunity</div></div>
      </section>

      <section id="solutions" className="solutions-section">
        <div className="sol-eyebrow">Industry Solutions</div>
        <h2 className="sol-title">Purpose-built for Financial Services</h2>
        <p className="sol-sub">Specialized AI models trained on industry-specific data, not generic computer vision.</p>
        <div className="tabs-box">
          <div className="tabs-aside">
            {Object.keys(solutions).map(id => (
              <button key={id} className={`tab-btn ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
                <div className="tab-icon">{solutions[id].icon}</div>
                <div className="tab-label-group">
                  <div className="tab-label serif">{solutions[id].title}</div>
                  <div className="tab-sub-labels">{solutions[id].subtitle}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="tabs-panel">
            <h3 className="panel-title serif">{solutions[activeTab].mainTitle}</h3>
            <p className="panel-sub">{solutions[activeTab].mainDesc}</p>
            <div className="panel-grid">
              {solutions[activeTab].items.map((item, idx) => (
                <div key={idx} className="uc-card">
                  <div className="uc-title-row">
                    <span className="uc-title-text">{item.t}</span>
                    {item.core && <span className="uc-core-badge">CORE</span>}
                  </div>
                  <div className="uc-content">{item.c}</div>
                  <div className="uc-metric">{item.m}</div>
                </div>
              ))}
            </div>
            <div className="integrations-row">
              <span className="int-label">Integrations</span>
              <div className="int-pills">
                {solutions[activeTab].integrations.map(int => (
                  <span key={int} className="int-pill">{int}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="platform-section">
        <div className="plat-eyebrow">NeuzenAI Vision Platform</div>
        <h2 className="plat-title serif">One platform. Six specialized solutions.</h2>
        <p className="plat-sub">"Enterprise Computer Vision for Financial Services"</p>
        <div className="plat-grid">
          {[
            { title: "ClaimsVision", type: "INSURANCE", desc: "Auto accident detection and claims automation. Your current Percept AI, rebranded and positioned for enterprise insurance.", list: ["Accident detection & classification", "Severity assessment scoring", "Staged fraud identification", "Automated FNOL generation", "Subrogation fault determination"] },
            { title: "PropertyInspect", type: "INSURANCE", desc: "Drone and aerial imagery analysis for P&C property claims assessment and damage documentation.", list: ["Roof damage detection", "Hail & storm damage scoring", "Water & fire damage classification", "Pre/post loss comparison"] },
            { title: "SafetyWatch", type: "INSURANCE", desc: "Workplace safety monitoring for workers compensation — incident reconstruction and PPE compliance.", list: ["Accident detection from CCTV", "PPE compliance monitoring", "Injury severity classification", "Ergonomic risk assessment"] },
            { title: "BankGuard", type: "BANKING", desc: "ATM and branch perimeter security with real-time behavioral detection and automatic incident alerting.", list: ["Skimming device detection", "Loitering & threat behavior", "Cash-in-transit monitoring", "Evidence auto-compilation"] },
            { title: "DocuVerify", type: "BANKING", desc: "AI-powered document fraud detection for check processing, KYC, and mobile deposit workflows.", list: ["Check forgery detection", "ID document verification", "Signature matching AI", "Fraud ring pattern analysis"] },
            { title: "AssetMonitor", type: "BANKING", desc: "Collateral and construction loan monitoring via drone imagery and on-site photo analysis.", list: ["Construction draw verification", "Equipment lease tracking", "Property condition scoring", "Agricultural asset monitoring"] },
          ].map(item => (
            <div key={item.title} className="plat-card">
              <span className="plat-tag">{item.type}</span>
              <h3 className="plat-card-title serif">{item.title}</h3>
              <p className="plat-card-desc">{item.desc}</p>
              <ul className="plat-card-list">
                {item.list.map(li => <li key={li} className="plat-card-li">{li}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="unified-value">
          <h3 className="uv-title serif">Unified Value Proposition</h3>
          <p className="uv-desc">"One AI platform, trained on 10M+ financial services images, reducing manual review by 70% across claims, security, and compliance use cases."</p>
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <div className="price-eyebrow">Pricing</div>
        <h2 className="price-title">Transparent, scalable pricing</h2>
        <p className="price-sub">Insurance: SaaS subscription model. Banking: per-location hybrid model.</p>
        
        <div className="price-context">INSURANCE — CLAIMSVISION</div>
        
        <div className="price-grid">
          {[
            { 
              name: "STARTER", 
              price: "$2,500", 
              desc: "500 claims/month. Best for small insurers and MGAs getting started.",
              features: ["500 claims per month", "Email support", "ClaimsVision (auto)", "Standard dashboard"],
              btn: "Get Started"
            },
            { 
              name: "PROFESSIONAL", 
              price: "$7,500", 
              popular: true,
              desc: "2,000 claims/month with phone support and API integration for regional carriers.",
              features: ["2,000 claims per month", "Phone + email support", "Full API access", "+PropertyInspect add-on", "+SafetyWatch add-on"],
              btn: "Get Started"
            },
            { 
              name: "ENTERPRISE", 
              price: "$25K+", 
              desc: "Unlimited claims, dedicated CSM, and custom ML model training for national carriers.",
              features: ["Unlimited claims", "Dedicated CSM", "Custom ML training", "All modules included", "SLA-guaranteed uptime"],
              btn: "Contact Sales"
            }
          ].map(plan => (
            <div key={plan.name} className={`price-card ${plan.popular ? 'popular' : ''}`}>
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
            </div>
          ))}
        </div>

        <div className="price-context banking">BANKING — PER-LOCATION MODEL</div>
        
        <div className="price-grid">
          {[
            { 
              name: "BANKGUARD", 
              price: "$150", 
              cycle: "/ATM/mo",
              desc: "or $500/branch/mo · Min. 10 locations",
              dark: true
            },
            { 
              name: "DOCUVERIFY", 
              price: "$0.10", 
              cycle: "/document",
              desc: "Min. 5,000 docs/mo · Volume discounts",
              dark: true
            },
            { 
              name: "ASSETMONITOR", 
              price: "$50", 
              cycle: "/asset/yr",
              desc: "Min. 20 assets · Enterprise custom pricing",
              dark: true
            }
          ].map(plan => (
            <div key={plan.name} className={`price-card ${plan.dark ? 'dark' : ''}`}>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price-row">
                <span className="plan-price serif">{plan.price}</span>
                <span className="plan-cycle-inline">{plan.cycle}</span>
              </div>
              <p className="plan-desc">{plan.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="market" className="market-section">
        <div className="price-eyebrow">Market Opportunity</div>
        <h2 className="price-title">$134M+ combined revenue potential</h2>
        <p className="price-sub">At minimal market share across both verticals.</p>
        <div className="market-grid">
          <div className="tam-card">
            <div className="tam-header">
              <div className="tam-icon-box insurance"><Shield size={24} /></div>
              <div className="tam-header-text">
                <div className="tam-title serif">Insurance TAM</div>
                <div className="tam-sub">Total Addressable Market: $83B</div>
              </div>
            </div>
            <div className="tam-rows">
              <div className="tam-row"><span>Auto Claims Processing</span><span className="val">$35M potential</span></div>
              <div className="tam-row"><span>P&C Inspection</span><span className="val">$16M potential</span></div>
              <div className="tam-row"><span>Workers Compensation</span><span className="val">$15M potential</span></div>
              <div className="tam-row"><span>Fleet Insurance</span><span className="val">$25M potential</span></div>
            </div>
            <div className="tam-footer">
              <span className="footer-label">Total Insurance Opportunity</span>
              <span className="footer-val serif">$91M</span>
            </div>
          </div>
          <div className="tam-card">
            <div className="tam-header">
              <div className="tam-icon-box banking"><Building2 size={24} /></div>
              <div className="tam-header-text">
                <div className="tam-title serif">Banking TAM</div>
                <div className="tam-sub">Total Addressable Market: $16B</div>
              </div>
            </div>
            <div className="tam-rows">
              <div className="tam-row"><span>ATM & Branch Security</span><span className="val">$14M potential</span></div>
              <div className="tam-row"><span>Fraud Detection</span><span className="val">$17M potential</span></div>
              <div className="tam-row"><span>Construction Monitoring</span><span className="val">$9.6M potential</span></div>
              <div className="tam-row"><span>Collateral Verification</span><span className="val">$3M potential</span></div>
            </div>
            <div className="tam-footer">
              <span className="footer-label">Total Banking Opportunity</span>
              <span className="footer-val serif">$43.6M</span>
            </div>
          </div>
        </div>
      </section>

      <section className="comp-section">
        <div className="price-eyebrow">Competitive Landscape</div>
        <h2 className="price-title">Where NvisionAI wins</h2>
        <p className="price-sub">Purpose-built for financial services vs. generic incumbents.</p>
        <div className="comp-table-box">
          <table className="comp-table">
            <thead>
              <tr><th>Competitor</th><th>Vertical</th><th>Their Weakness</th><th>NvisionAI Advantage</th></tr>
            </thead>
            <tbody>
              <tr><td>Tractable</td><td>Auto damage AI</td><td>UK-based, expensive, slow US integration</td><td><span className="adv">US-based, faster deployment, better pricing</span></td></tr>
              <tr><td>Snapsheet</td><td>Mobile claims</td><td>Limited AI depth, workflow-only focus</td><td><span className="adv">Deeper AI analysis + fraud detection</span></td></tr>
              <tr><td>Mitchell / CCC</td><td>Auto valuation</td><td>Legacy systems, not AI-native</td><td><span className="adv">Modern API-first, AI-native platform</span></td></tr>
              <tr><td>NICE</td><td>Surveillance</td><td>General purpose, expensive, complex</td><td><span className="adv">Banking-specific, simpler, faster ROI</span></td></tr>
              <tr><td>Feedzai</td><td>Banking fraud</td><td>Payment fraud only, no physical security</td><td><span className="adv">Combined physical + document fraud</span></td></tr>
              <tr><td>Verafin</td><td>AML/Fraud</td><td>No computer vision capability</td><td><span className="adv">Video/image analysis = new fraud vectors</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="gtm" className="gtm-section">
        <div className="price-eyebrow">Go-to-Market</div>
        <h2 className="price-title">Sales playbook by vertical</h2>
        <div className="gtm-grid">
          <div className="gtm-card">
            <h3 className="serif">Insurance GTM</h3>
            <p>Strongest play — 3-6 month cycles</p>
            <div className="gtm-steps">
              {[
                { num: "01", title: "Entry Point", desc: "'Free accident analysis for your top 10 disputed claims' — show value in days, not months." },
                { num: "02", title: "Pilot", desc: "90-day trial processing 500-1,000 claims with full ROI tracking and reporting." },
                { num: "03", title: "Expansion", desc: "Full platform API integration + upsell PropertyInspect and SafetyWatch modules." },
                { num: "04", title: "Target Segments", desc: "Regional/mid-market insurers ($500M-$5B premiums), MGAs/TPAs, fleet insurance specialists." }
              ].map(s => (
                <div key={s.num} className="gtm-step">
                  <div className="step-num">{s.num}</div>
                  <div className="step-content"><div className="step-title serif">{s.title}</div><div className="step-desc">{s.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="gtm-card">
            <h3 className="serif">Banking GTM</h3>
            <p>Higher barrier, higher value</p>
            <div className="gtm-steps">
              {[
                { num: "01", title: "Entry Point", desc: "'Free security audit of 1 month of ATM footage' — prove detection capability before commitment." },
                { num: "02", title: "Pilot", desc: "30-day trial on 10-20 ATMs/branches with documented incident detection vs. manual." },
                { num: "03", title: "Expansion", desc: "Multi-location rollout + add DocuVerify for fraud and AssetMonitor for construction loans." },
                { num: "04", title: "Target Segments", desc: "Regional banks ($1B-$50B assets), credit unions, fintech construction/equipment lenders." }
              ].map(s => (
                <div key={s.num} className="gtm-step">
                  <div className="step-num">{s.num}</div>
                  <div className="step-content"><div className="step-title serif">{s.title}</div><div className="step-desc">{s.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMBINED FINAL CTA + FOOTER */}
      <section className="final-combined">
        <div className="cta-block text-center">
          <div className="hero-eyebrow" style={{ justifyContent: 'center' }}>Ready to get started?</div>
          <h2 className="cta-headline serif">See NvisionAI in action</h2>
          <p className="cta-sub">Book a 30-minute demo tailored to your vertical — insurance or banking.</p>
          <div className="hero-btns" style={{ justifyContent: 'center' }}>
            <button className="btn-gold">Book a Demo <ArrowRight size={18} /></button>
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
      </section>
    </div>
  );
};

export default NvisionAI;
