import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
        <div className="container">
          <h2>Bienvenue chez BKB</h2>
          <p>Votre partenaire de confiance pour électroménager, téléphones et bien plus</p>
          <Link to="/catalog" className="cta-button">
            Voir nos produits
            <span className="cta-arrow">→</span>
          </Link>
      </div>

    </section>
  );
};

export default Hero;