import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ApiService from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est obligatoire';
    } else {
      // Enlever les espaces et les caractères spéciaux pour la validation
      const cleanPhone = formData.phone.replace(/[\s()-]/g, '');

      // Accepter format avec +224 (ex: +224612345678) ou sans (ex: 612345678)
      const phoneRegex = /^(\+224)?[0-9]{9,10}$/;

      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Format invalide. Utilisez +224XXXXXXXXX ou XXXXXXXXX';
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse de livraison est obligatoire';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || null,
        customerAddress: formData.address,
        items: cartItems,
        totalAmount: getCartTotal()
      };

      // Envoyer la commande au backend
      const response = await ApiService.createOrder(orderData);

      if (response.success) {
        // Créer une copie des items avant de vider le panier
        const itemsCopy = [...cartItems];

        // Vider le panier
        clearCart();

        // Rediriger vers la page de confirmation avec les infos de la commande
        navigate('/order-success', {
          state: {
            orderNumber: response.order.orderNumber,
            customerName: response.order.customerName,
            totalAmount: response.order.totalAmount,
            items: itemsCopy,
            customerAddress: formData.address
          }
        });
      } else {
        throw new Error('Erreur lors de la création de la commande');
      }

    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      alert('Une erreur est survenue lors de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-empty">
            <h2>Votre panier est vide</h2>
            <p>Ajoutez des produits avant de passer commande</p>
            <button onClick={() => navigate('/catalog')} className="btn-catalog">
              Voir le catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Finaliser ma commande</h1>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Informations de livraison</h2>

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">
                  Nom complet <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Entrez votre nom complet"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Numéro de téléphone <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+224 612 34 56 78 ou 612 34 56 78"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="optional">(optionnel)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="exemple@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Adresse de livraison <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Entrez votre adresse complète"
                  rows="3"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <button
                type="submit"
                className="btn-submit-order"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h2>Récapitulatif</h2>

            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-icon">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="summary-item-image" />
                    ) : (
                      getProductIcon(item.categoryId)
                    )}
                  </div>
                  <div className="summary-item-details">
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-qty">Quantité: {item.quantity}</p>
                  </div>
                  <div className="summary-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total à payer</span>
              <span className="total-amount">{formatPrice(getCartTotal())}</span>
            </div>

            <div className="summary-info">
              <p>📦 Livraison gratuite</p>
              <p>💳 Paiement à la livraison</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
