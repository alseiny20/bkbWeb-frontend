import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    navigate('/');
    return null;
  }

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

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h1>Commande confirmée !</h1>
          <p className="success-message">
            Merci pour votre commande. Nous vous contacterons bientôt pour la livraison.
          </p>

          <div className="order-number">
            <span>Numéro de commande :</span>
            <strong>#{data.orderNumber}</strong>
          </div>

          <div className="order-details">
            <h2>Détails de la commande</h2>

            <div className="detail-section">
              <h3>Informations de livraison</h3>
              <div className="detail-item">
                <span className="detail-label">Nom :</span>
                <span className="detail-value">{data.customerName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Adresse :</span>
                <span className="detail-value">{data.customerAddress}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Articles commandés</h3>
              <div className="order-items-list">
                {data.items.map((item, index) => (
                  <div key={index} className="order-item-card">
                    <div className="order-item-top">
                      <div className="order-item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span className="product-icon-fallback">
                            {getProductIcon(item.categoryId)}
                          </span>
                        )}
                      </div>
                      <div className="order-item-details">
                        <h4 className="order-item-name">{item.name}</h4>
                        <p className="order-item-quantity">Quantité: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="order-item-bottom">
                      <div className="order-item-price-detail">
                        <span className="price-label">{formatPrice(item.price)} × {item.quantity}</span>
                      </div>
                      <div className="order-item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-total">
              <span>Total</span>
              <span className="total-amount">{formatPrice(data.totalAmount)}</span>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/catalog" className="btn-continue">
              Continuer mes achats
            </Link>
            <Link to="/" className="btn-home">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
