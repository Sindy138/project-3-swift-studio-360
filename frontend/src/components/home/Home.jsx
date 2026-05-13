import React from "react";
import HeroSection from "./HeroSection";
import SocialProof from "./SocialProof";
import ServiceGrid from "./ServiceGrid";
import EngineSection from "./EngineSection";
import SEOAuthority from "./SEOAuthority";
import SECTOR_CONFIG from "../../config/content";
import "./styles/Home.css";

/**
 * HOME - Página de inicio completa
 * Ensambla todos los módulos en el orden correcto
 * Data-driven: Todo viene de SECTOR_CONFIG
 * Escalable: Cambiar config = cambiar sector (Ej. Inmobiliaria)
 */
const Home = () => {
  return (
    <main className="home-page" itemScope itemType="https://schema.org/WebPage">
      {/* Meta Description para SEO */}
      <meta
        itemProp="description"
        content={SECTOR_CONFIG.hero.valueProp.headline}
      />

      {/* 1. Hero Section - Propuesta de Valor + CTA */}
      <HeroSection config={SECTOR_CONFIG.hero} />

      {/* 2. Social Proof - Logos + Testimonios */}
      <SocialProof config={SECTOR_CONFIG.socialProof} />

      {/* 3. Service Grid - The Core (5 Pilares) */}
      <ServiceGrid config={SECTOR_CONFIG.services} />

      {/* 4. Engine Section - Diferenciación Tecnológica */}
      <EngineSection config={SECTOR_CONFIG.engine} />

      {/* 5. SEO Authority - Autoridad + Structured Data */}
      <SEOAuthority config={SECTOR_CONFIG.seoAuthority} />
    </main>
  );
};

export default Home;
