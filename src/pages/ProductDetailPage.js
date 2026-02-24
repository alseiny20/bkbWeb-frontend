import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await ApiService.fetchProductById(id);
        setProduct(productData);

        // Charger les produits de la même catégorie
        const allProducts = await ApiService.fetchProducts();
        const similar = allProducts
          .filter(p => p.categoryId === productData.categoryId && p.id !== productData.id && p.image)
          .slice(0, 10);

        setSimilarProducts(similar);
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

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
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-container">
            <p>Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-container">
            <p>Produit non trouvé</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          <div className="product-image-column">
            <div className="product-image-section">
              <div className="product-image-large">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <span className="product-icon-fallback">
                    {getProductIcon(product.categoryId)}
                  </span>
                )}
              </div>
            </div>

            {similarProducts.length > 0 && (
              <div className="similar-products-carousel">
                <div className="carousel-label">Produits similaires</div>
                <div className="carousel-track-wrapper">
                  <div className="carousel-track">
                    {[...similarProducts, ...similarProducts].map((product, index) => (
                      <div
                        key={`${product.id}-${index}`}
                        className="carousel-product"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <img src={product.image} alt={product.name} />
                        <div className="carousel-product-name">{product.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="product-info-section">
            <div className="product-breadcrumb">
              <span>{product.Category?.name}</span>
            </div>
            
            <h1>{product.name}</h1>
            
            <div className="product-price">
              <span className="price">{formatPrice(product.price)}</span>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-stock">
              <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
              </span>
            </div>

            <div className="product-actions">
              <button
                className="add-to-cart-btn"
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
              >
                Ajouter au panier
              </button>
              <button className="back-btn" onClick={() => window.history.back()}>
                Retour au catalogue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;