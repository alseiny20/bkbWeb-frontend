import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <FeaturedProducts />
      
      {/* Section Catalogue Preview */}
      <section className="catalog-preview">
        <div className="container">
          <div className="catalog-preview-content">
            <h3>Découvrez tout notre catalogue</h3>
            <p>Plus de 20 produits disponibles dans toutes les catégories</p>
            <Link to="/catalog" className="catalog-preview-btn">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;