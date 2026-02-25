import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Appel à l'API backend pour vérifier le mot de passe
      const response = await fetch(`${API_URL}/admin/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Stocker le token d'authentification dans localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdminAuthenticated', 'true');
        // Rediriger vers le dashboard admin
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Mot de passe incorrect');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error);
      setError('Erreur de connexion au serveur');
      setIsSubmitting(false);
    }
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
