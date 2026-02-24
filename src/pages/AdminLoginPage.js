import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mot de passe hardcodé (à améliorer avec authentification réelle plus tard)
  const ADMIN_PASSWORD = 'bkb2025';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Stocker l'authentification dans localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');
        // Rediriger vers le dashboard admin
        navigate('/admin/dashboard');
      } else {
        setError('Mot de passe incorrect');
        setIsSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🔐 Admin BKB</h1>
            <p>Connectez-vous pour accéder au panneau d'administration</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe admin"
                className={error ? 'error' : ''}
                autoFocus
                required
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={isSubmitting || !password}
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="login-footer">
            <button onClick={() => navigate('/')} className="btn-back">
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
