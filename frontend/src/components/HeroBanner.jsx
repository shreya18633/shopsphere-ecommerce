import React from 'react';
import { Sparkles, ShieldCheck, Box, RefreshCw, Zap } from 'lucide-react';

export default function HeroBanner({ onOpenDevOps }) {
  return (
    <section className="store-hero">
      <div>
        <div className="hero-tag">
          <Sparkles size={13} />
          <span>Full-Stack Cloud Marketplace</span>
        </div>
        <h1 className="hero-title">
          Next-Gen Tech, Gear & Apparel
        </h1>
        <p className="hero-subtitle">
          An enterprise-grade shopping platform with database persistence, orchestrated with <strong>Docker Compose</strong>, tested via <strong>Jenkins CI/CD</strong>, and monitored live using <strong>Prometheus & Grafana</strong>.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <Box size={14} color="#38bdf8" />
            <span>Multi-Container Docker</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <RefreshCw size={14} color="#818cf8" />
            <span>Jenkins Automated Pipeline</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <Zap size={14} color="#fbbf24" />
            <span>Prometheus Metrics Scraper</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'none', minWidth: '220px' }}>
        {/* Decorative badge */}
      </div>
    </section>
  );
}
