import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // Vérifier l'authentification
    const isAuth = localStorage.getItem('isAdminAuthenticated');
    if (!isAuth) {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData, categoriesData] = await Promise.all([
        ApiService.fetchAllOrders(),
        ApiService.fetchProducts(),
        ApiService.fetchCategories()
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ApiService.updateOrderStatus(orderId, newStatus);
      // Recharger les commandes
      const ordersData = await ApiService.fetchAllOrders();
      setOrders(ordersData);
      alert('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      return;
    }

    try {
      await ApiService.deleteOrder(orderId);
      const ordersData = await ApiService.fetchAllOrders();
      setOrders(ordersData);
      alert('Commande supprimée avec succès');
    } catch (error) {
      console.error('Erreur suppression commande:', error);
      alert('Erreur lors de la suppression de la commande');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      return;
    }

    try {
      await ApiService.deleteProduct(productId);
      const productsData = await ApiService.fetchProducts();
      setProducts(productsData);
      alert('Produit supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression produit:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const openProductModal = (product = null) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setEditingProduct(null);
    setShowProductModal(false);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Mise à jour
        await ApiService.updateProduct(editingProduct.id, productData);
        alert('Produit mis à jour avec succès');
      } else {
        // Création
        await ApiService.createProduct(productData);
        alert('Produit créé avec succès');
      }
      const productsData = await ApiService.fetchProducts();
      setProducts(productsData);
      closeProductModal();
    } catch (error) {
      console.error('Erreur sauvegarde produit:', error);
      alert('Erreur lors de la sauvegarde du produit');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' GNF';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <p>Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>📊 Dashboard Admin BKB</h1>
            <button onClick={handleLogout} className="btn-logout">
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            📦 Commandes ({orders.length})
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            🛍️ Produits ({products.length})
          </button>
        </nav>

        <div className="dashboard-content">
          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="section-header">
                <h2>Gestion des Commandes</h2>
                <p className="section-subtitle">
                  {orders.length} commande{orders.length > 1 ? 's' : ''} au total
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>Aucune commande pour le moment</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>#{order.orderNumber}</h3>
                          <span className="order-date">{formatDate(order.createdAt)}</span>
                        </div>
                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className="order-body">
                        <div className="customer-info">
                          <p><strong>Client :</strong> {order.customerName}</p>
                          <p><strong>Téléphone :</strong> {order.customerPhone}</p>
                          {order.customerEmail && <p><strong>Email :</strong> {order.customerEmail}</p>}
                          <p><strong>Adresse :</strong> {order.customerAddress}</p>
                        </div>

                        <div className="order-items-section">
                          <strong>📦 Articles commandés</strong>
                          <div className="order-items">
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  <span className="order-item-name">{item.name}</span>
                                  <span className="order-item-quantity">x{item.quantity}</span>
                                  <span className="order-item-price">{formatPrice(item.price * item.quantity)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="order-total">
                          <strong>Total : {formatPrice(order.totalAmount)}</strong>
                        </div>
                      </div>

                      <div className="order-actions">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">En attente</option>
                          <option value="processing">En traitement</option>
                          <option value="shipped">Expédié</option>
                          <option value="delivered">Livré</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="btn-delete"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="products-section">
              <div className="section-header">
                <h2>Gestion des Produits</h2>
                <button onClick={() => openProductModal()} className="btn-add-product">
                  ➕ Ajouter un produit
                </button>
              </div>

              {products.length === 0 ? (
                <div className="empty-state">
                  <p>Aucun produit pour le moment</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(product => {
                    const getProductIcon = (categoryId) => {
                      switch(categoryId) {
                        case 1: return "📱";
                        case 2: return "💻";
                        case 3: return "❄️";
                        default: return "🛍️";
                      }
                    };

                    return (
                      <div key={product.id} className="product-card-admin">
                        <div className="product-card-header">
                          <span className="product-id-badge">#{product.id}</span>
                          <span className={`stock-badge ${product.stock > 0 ? 'stock-available' : 'stock-out'}`}>
                            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                          </span>
                        </div>

                        <div className="product-card-image">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <span className="product-card-image-placeholder">
                              {getProductIcon(product.categoryId)}
                            </span>
                          )}
                        </div>

                        <h3 className="product-card-name">{product.name}</h3>

                        <div className="product-card-details">
                          <div className="product-detail-row">
                            <span className="product-detail-label">Catégorie</span>
                            <span className="product-category-badge">
                              {product.Category?.name || 'N/A'}
                            </span>
                          </div>
                          <div className="product-detail-row">
                            <span className="product-detail-label">Prix</span>
                            <span className="product-price-badge">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </div>

                        <div className="product-card-actions">
                          <button
                            onClick={() => openProductModal(product)}
                            className="btn-edit-product"
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-delete-product"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showProductModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={closeProductModal}
        />
      )}
    </div>
  );
};

// Composant Modal pour ajouter/modifier un produit
const ProductModal = ({ product, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    categoryId: product?.categoryId || '',
    image: product?.image || ''
  });
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse (max 5MB)');
        return;
      }

      setSelectedFile(file);

      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', selectedFile);

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const data = await response.json();
      return `http://localhost:3001${data.imageUrl}`;
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Le prix doit être un nombre positif';
    }

    const stock = parseInt(formData.stock);
    if (formData.stock === '' || isNaN(stock) || stock < 0) {
      newErrors.stock = 'Le stock doit être un nombre positif ou zéro';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'La catégorie est obligatoire';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Upload l'image si un fichier est sélectionné
    let imageUrl = formData.image;
    if (selectedFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        return; // L'erreur a déjà été affichée
      }
    }

    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId),
      image: imageUrl
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Nom du produit *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ex: iPhone 14"
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={errors.description ? 'error' : ''}
              placeholder="Description complète du produit..."
              required
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prix (GNF) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1"
                step="1"
                className={errors.price ? 'error' : ''}
                placeholder="100000"
                required
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                step="1"
                className={errors.stock ? 'error' : ''}
                placeholder="10"
                required
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Catégorie *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? 'error' : ''}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
          </div>

          <div className="form-group">
            <label>Image du produit (optionnel)</label>

            {imagePreview ? (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Prévisualisation" className="image-preview" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn-remove-image"
                  title="Supprimer l'image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="file-input-container">
                <label htmlFor="file-input" className="file-input-label">
                  📷 Choisir une image
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input-hidden"
                />
              </div>
            )}

            <small className="field-hint">
              Formats acceptés : JPEG, PNG, GIF, WebP (max 5MB). 
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={uploading}>
              Annuler
            </button>
            <button type="submit" className="btn-save" disabled={uploading}>
              {uploading ? '⏳ Upload en cours...' : (product ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
