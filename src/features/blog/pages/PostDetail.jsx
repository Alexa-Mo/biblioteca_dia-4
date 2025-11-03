// src/features/blog/pages/PostDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { blogApi } from '../api/blogApi';
import { Loader } from '../components/Loader';
import { ErrorMsg } from '../components/ErrorMsg';
import '../styles/post-detail.css';

export const PostDetail = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadBook = async () => {
    try {
      setLoading(true);
      setError(null);
      const bookData = await blogApi.getPostById(id);
      setBook(bookData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const handleRetry = () => {
    loadBook();
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!book && !loading) {
    return (
      <div className="post-detail-container">
        <ErrorMsg message="Libro no encontrado" onRetry={handleRetry} />
      </div>
    );
  }

  const bookInfo = book?.volumeInfo || {};
  const thumbnail = bookInfo.imageLinks?.thumbnail || '/placeholder-book.jpg';
  const title = bookInfo.title || 'Título no disponible';
  const authors = bookInfo.authors ? bookInfo.authors.join(', ') : 'Autor desconocido';
  const description = bookInfo.description || 'Descripción no disponible';
  const publishedDate = bookInfo.publishedDate || 'Fecha desconocida';
  const pageCount = bookInfo.pageCount || 'N/A';
  const categories = bookInfo.categories ? bookInfo.categories.join(', ') : 'Sin categoría';

  return (
    <div className="post-detail-container">
      {/* Header */}
      <header className="post-detail-header">
        <div className="post-detail-nav">
          <Link to="/blog" className="back-link">
            <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la Biblioteca
          </Link>
          
          <div className="blog-user-info" ref={menuRef}>
            <button onClick={toggleMenu} className="user-menu-button">
              <div className="user-avatar-small">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="user-name-truncated">
                {user?.name || 'Usuario'}
              </span>
              <svg 
                className={`menu-chevron ${isMenuOpen ? 'menu-chevron-open' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menú desplegable */}
            {isMenuOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <div className="user-avatar-medium">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-details">
                      <div className="user-fullname">{user?.name || 'Usuario'}</div>
                      <div className="user-email">{user?.email || ''}</div>
                    </div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Mi Perfil</span>
                </Link>

                <Link 
                  to="/contact" 
                  className="dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contacto</span>
                </Link>

                <div className="dropdown-divider"></div>

                <button 
                  onClick={handleLogout}
                  className="dropdown-item logout-item"
                >
                  <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido del Libro */}
      <main className="post-detail-main">
        {error && (
          <ErrorMsg message={error} onRetry={handleRetry} />
        )}

        {loading ? (
          <Loader />
        ) : book ? (
          <article className="post-article">
            <div className="book-detail-header">
              <div className="book-cover-container">
                <img 
                  src={thumbnail} 
                  alt={title}
                  className="book-cover-large"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjM4NCIgdmlld0JveD0iMCAwIDI1NiAzODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMzg0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04OCAxMTJIMTY4IiBzdHJva2U9IiM4QzkzQUEiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik04OCAxNjhIMTY4IiBzdHJva2U9IiM4QzlBOUEiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik04OCAyMjRIMDY4IiBzdHJva2U9IiM4QzkzQUEiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=';
                  }}
                />
              </div>
              
              <div className="book-info">
                <div className="book-meta">
                  <span className="book-published">Publicado: {publishedDate}</span>
                </div>
                
                <h1 className="post-title">{title}</h1>
                
                <div className="book-authors-detail">
                  <strong>Autor(es):</strong> {authors}
                </div>
                
                <div className="book-details-grid">
                  <div className="detail-item">
                    <strong>Páginas:</strong> {pageCount}
                  </div>
                  <div className="detail-item">
                    <strong>Categorías:</strong> {categories}
                  </div>
                </div>
              </div>
            </div>

            <div className="post-content">
              <h3>Descripción</h3>
              <p>{description}</p>
            </div>

            <div className="post-actions">
              <Link to="/blog" className="action-button">
                ← Volver a la Biblioteca
              </Link>
              <button onClick={() => window.scrollTo(0, 0)} className="action-button">
                ↑ Volver arriba
              </button>
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
};