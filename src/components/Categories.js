import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          ApiService.fetchCategories(),
          ApiService.fetchProducts()
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        setError('Erreur lors du chargement des catégories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="categories">
        <div className="container">
          <h3>Nos Catégories</h3>
          <div className="loading-container">
            <p>Chargement des catégories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="categories">
        <div className="container">
          <h3>Nos Catégories</h3>
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const getCategoryIcon = (categoryId) => {
    switch(categoryId) {
      case 1: return "📱"; // Téléphone
      case 2: return "💻"; // Électronique
      case 3: return "❄️"; // Électroménager
      default: return "🛍️";
    }
  };

  const getCategoryProducts = (categoryId) => {
    // Filtrer les produits par catégorie avec images et randomiser
    const filtered = products.filter(p => p.categoryId === categoryId && p.image);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const categoryProducts = shuffled.slice(0, 10);

    // Si moins de 10 produits, dupliquer pour avoir au moins 10 images
    const targetCount = 10;
    while (categoryProducts.length < targetCount && categoryProducts.length > 0) {
      const remaining = targetCount - categoryProducts.length;
      categoryProducts.push(...categoryProducts.slice(0, Math.min(remaining, categoryProducts.length)));
    }

    return categoryProducts;
  };

  const getCategoryItems = (categoryId) => {
    switch(categoryId) {
      case 1: return [
        "iPhone 15", "Samsung Galaxy S24", "Huawei P60", "Xiaomi 14", "Oppo Find X6",
        "Vivo X90", "OnePlus 11", "Google Pixel 8", "Nokia G60", "Redmi Note 12",
        "Honor Magic 5", "Realme GT 3", "Nothing Phone 2", "Motorola Edge 40",
        "Sony Xperia 1 V", "Asus ROG Phone 7", "Fairphone 5", "Coques", "Chargeurs"
      ];
      case 2: return [
        "Ordinateurs portables", "PC de bureau", "MacBook", "iPad", "Tablettes Samsung",
        "Casques audio", "Écouteurs", "Haut-parleurs", "Webcams", "Souris gaming",
        "Claviers mécaniques", "Moniteurs", "Disques SSD", "Clés USB", "Cartes SD",
        "Câbles HDMI", "Adaptateurs", "Batteries externes", "Accessoires tech"
      ];
      case 3: return [
        "Réfrigérateurs", "Congélateurs", "Micro-ondes", "Fours", "Cuisinières",
        "Lave-vaisselle", "Lave-linge", "Sèche-linge", "Climatiseurs", "Ventilateurs",
        "Aspirateurs", "Robots ménagers", "Mixeurs", "Grille-pain", "Bouilloires",
        "Cafetières", "Machines à laver", "Sèche-cheveux", "Fers à repasser"
      ];
      default: return [
        "Produits électroniques", "Accessoires", "Équipements", "Gadgets",
        "Appareils", "Composants", "Périphériques", "Outils", "Matériels"
      ];
    }
  };

  return (
    <section className="categories">
      <div className="container">
        <h3>Nos Catégories</h3>
        <div className="categories-grid">
          {categories.map(category => {
            const categoryProducts = getCategoryProducts(category.id);
            // Dupliquer les produits pour créer une boucle infinie fluide
            const duplicatedProducts = [...categoryProducts, ...categoryProducts];

            return (
              <Link
                key={category.id}
                to={`/catalog?category=${category.id}`}
                className="category-card"
              >
                <div className="category-content">
                  {categoryProducts.length > 0 ? (
                    <div className="category-carousel">
                      <div className="carousel-track">
                        {duplicatedProducts.map((product, index) => {
                          const isLongName = product.name.length > 15;
                          return (
                            <div
                              key={`${product.id}-${index}`}
                              className="carousel-image"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/product/${product.id}`);
                              }}
                            >
                              <img src={product.image} alt={product.name} />
                              <div className={`carousel-image-name ${isLongName ? 'long-name' : ''}`}>
                                <span>{isLongName ? `${product.name} • ${product.name} • ` : product.name}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="category-icon">{getCategoryIcon(category.id)}</div>
                  )}
                  <h4>{category.name}</h4>
                </div>
                <div className="category-footer">
                  <div className="scrolling-text">
                    {getCategoryItems(category.id).concat(getCategoryItems(category.id)).map((item, index) => (
                      <span key={index} className="scrolling-item">{item}</span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;