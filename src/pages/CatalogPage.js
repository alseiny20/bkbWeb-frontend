import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { useCart } from '../context/CartContext';
import './CatalogPage.css';

const CatalogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          ApiService.fetchProducts(),
          ApiService.fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Handle URL parameters for category filtering
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(parseInt(categoryParam));
    }
  }, [location.search]);

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

  const filteredProducts = selectedCategory
    ? products.filter(product => product.categoryId === selectedCategory)
    : products;

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      navigate(`/catalog?category=${categoryId}`);
    } else {
      navigate('/catalog');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="catalog-page">
        <div className="container">
          <div className="loading-container">
            <p>Chargement du catalogue...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-page">
        <div className="container">
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1>Notre Catalogue</h1>
          <p>Découvrez tous nos produits d'électroménager, téléphones et accessoires</p>
        </div>

        <div className="catalog-filters">
          <h3>Filtrer par catégorie</h3>
          <div className="filter-buttons">
            <button 
              className={selectedCategory === null ? 'active' : ''}
              onClick={() => handleCategoryFilter(null)}
            >
              Tous
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={selectedCategory === category.id ? 'active' : ''}
                onClick={() => handleCategoryFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="catalog-card">
              <Link to={`/product/${product.id}`} className="product-image-link">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <span className="product-icon-fallback">
                      {getProductIcon(product.categoryId)}
                    </span>
                  )}
                </div>
              </Link>
              <div className="product-info">
                <h4>{product.name}</h4>
                <div className="price-section">
                  <span className="price">{formatPrice(product.price)}</span>
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
    </div>
  );
};

export default CatalogPage;