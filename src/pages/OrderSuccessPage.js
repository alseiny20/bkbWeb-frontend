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
          <div className="success-header-block">
            <div className="brand-name">BKB MARKET</div>
            <h1>Nouvelle commande reçue</h1>
            <p className="order-number-title">Commande BKB-{data.orderNumber}</p>
          </div>

          <div className="email-notification">
            📧 Un email de confirmation a été envoyé à votre adresse
          </div>

          <div className="order-info-section">
            <div className="info-row">
              <span className="info-label">Date:</span>
              <span className="info-value">{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Client:</span>
              <span className="info-value">{data.customerName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Téléphone:</span>
              <span className="info-value">{data.customerPhone || 'Non fourni'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{data.customerEmail || 'Non fourni'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Adresse:</span>
              <span className="info-value">{data.customerAddress}</span>
            </div>
          </div>

          <div className="order-table">
            <div className="table-header">
              <div className="col-article">ARTICLE</div>
              <div className="col-qty">QTÉ</div>
              <div className="col-price">PRIX</div>
              <div className="col-total">SOUS-TOTAL</div>
            </div>
            {data.items.map((item, index) => (
              <div key={index} className="table-row">
                <div className="col-article">{item.name}</div>
                <div className="col-qty">{item.quantity}</div>
                <div className="col-price">{formatPrice(item.price)}</div>
                <div className="col-total">{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="order-total-block">
            <span>Total: {formatPrice(data.totalAmount)}</span>
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
