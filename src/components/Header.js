import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { getCartItemsCount, isAnimating } = useCart();
  const dropdownRef = useRef(null);
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await ApiService.fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleCategoryClick = (categoryId) => {
    setShowDropdown(false);
    // Navigate to catalog with category filter using React Router
    navigate(`/catalog?category=${categoryId}`);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span className="logo-mark">
              <img src="/favicon.png" alt="BKB" className="logo-mark-image" />
            </span>
            <div className="logo-text">
              <span className="brand-name">BKB</span>
              <span className="brand-tagline">Commerce & Services</span>
            </div>
          </Link>
        </div>
        <nav className="nav">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Accueil</Link>
          
          <div 
            ref={dropdownRef}
            className="dropdown-container"
            onMouseEnter={() => !isMobile && setShowDropdown(true)}
            onMouseLeave={() => !isMobile && setShowDropdown(false)}
          >
            <button
              type="button"
              className={`dropdown-trigger ${isActive('/catalog') ? 'active' : ''}`}
              onClick={() => {
                if (isMobile) {
                  navigate('/catalog');
                  return;
                }
                setShowDropdown((value) => !value);
              }}
            >
              Produits
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="dropdown-arrow">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <div className="dropdown-content">
                <Link to="/catalog" className="dropdown-item all-products" onClick={() => {
                  setShowDropdown(false);
                }}>
                  <div className="dropdown-item-icon">🛍️</div>
                  <div className="dropdown-item-text">
                    <span className="dropdown-item-title">Tous les produits</span>
                    <span className="dropdown-item-desc">Voir notre catalogue complet</span>
                  </div>
                </Link>
                
                <div className="dropdown-divider"></div>
                
                {categories.map(category => (
                  <button
                    key={category.id}
                    className="dropdown-item"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className="dropdown-item-icon">
                      {category.id === 1 ? '📱' : category.id === 2 ? '💻' : '❄️'}
                    </div>
                    <div className="dropdown-item-text">
                      <span className="dropdown-item-title">{category.name}</span>
                      <span className="dropdown-item-desc">{category.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <a href="#contact">À propos</a>
          <Link to="/cart" className={`cart-link ${isAnimating ? 'cart-animate' : ''}`}>
            Panier
            {getCartItemsCount() > 0 && (
              <span className="cart-badge">{getCartItemsCount()}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
