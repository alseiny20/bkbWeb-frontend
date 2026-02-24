import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';
import { useCart } from '../context/CartContext';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const data = await ApiService.fetchFeaturedProducts();
        // Mélanger aléatoirement les produits
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' GNF';
  };

  const getProductIcon = (categoryId) => {
    switch(categoryId) {
      case 1: return "📱"; // Téléphone
      case 2: return "💻"; // Électronique
      case 3: return "❄️"; // Électroménager
      default: return "🛍️";
    }
  };

  if (loading) {
    return (
      <section className="featured-products">
        <div className="container">
          <h3>Produits en Vedette</h3>
          <div className="loading-container">
            <p>Chargement des produits...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-products">
        <div className="container">
          <h3>Produits en Vedette</h3>
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <section className="featured-products">
      <div className="container">
        <h3>Produits en Vedette</h3>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <span className="product-icon-fallback">
                    {getProductIcon(product.categoryId)}
                  </span>
                )}
              </div>

              <div className="product-info-block">
                <div className="product-name-banner">
                  <div className="scrolling-name">
                    <span className="name-item">{product.name}</span>
                    <span className="name-item">{product.name}</span>
                  </div>
                </div>

                <div className="floating-tags">
                  <div className="tag tag-price">
                    <span>{formatPrice(product.price)}</span>
                  </div>
                  <div className={`tag tag-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    <span>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture'}
                    </span>
                  </div>
                </div>

                <div className="product-actions">
                  <Link to={`/product/${product.id}`} className="btn-details">
                    Voir détails
                  </Link>
                  <button
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;