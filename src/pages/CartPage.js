import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price).replace(/\s/g, '.') + ' GNF';
  };

  const getProductIcon = (categoryId) => {
    switch(categoryId) {
      case 1: return "📱"; // Téléphone
      case 2: return "💻"; // Électronique
      case 3: return "❄️"; // Électroménager
      default: return "🛍️";
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1>Mon Panier</h1>
          </div>
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h2>Votre panier est vide</h2>
            <p>Découvrez nos produits et ajoutez-les à votre panier</p>
            <Link to="/catalog" className="continue-shopping-btn">
              Voir le catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Mon Panier ({cartItems.length} {cartItems.length > 1 ? 'articles' : 'article'})</h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            Vider le panier
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-top">
                  <Link to={`/product/${item.id}`} className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span className="product-icon-fallback">
                        {getProductIcon(item.categoryId)}
                      </span>
                    )}
                  </Link>

                  <div className="cart-item-header">
                    <Link to={`/product/${item.id}`} className="cart-item-name">
                      {item.name}
                    </Link>

                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="cart-item-description">{item.description}</p>
                </div>

                <div className="cart-item-bottom">
                  <div className="cart-item-price">
                    {formatPrice(item.price)} × {item.quantity}
                  </div>

                  <div className="cart-item-total-bottom">
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Retirer du panier"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Résumé de la commande</h3>

            <div className="summary-line">
              <span>Sous-total</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-line total">
              <span>Total</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>

            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Passer la commande
            </button>

            <Link to="/catalog" className="continue-shopping-link">
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
