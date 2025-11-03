// src/features/blog/pages/Posts.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { blogApi } from '../api/blogApi';
import { PostCard } from '../components/PostCard';
import { Loader } from '../components/Loader';
import { ErrorMsg } from '../components/ErrorMsg';
import '../styles/posts.css';

export const Posts = () => {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('javascript');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const booksPerPage = 9;

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

  const loadBooks = async (query = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const booksData = await blogApi.getPosts(query);
      setBooks(booksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleRetry = () => {
    loadBooks();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadBooks(searchTerm);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Paginación local
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = books.slice(startIndex, startIndex + booksPerPage);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="blog-container">
      {/* Header del Blog */}
      <header className="blog-header">
        <div className="blog-header-content">
          <div className="blog-title-section">
            <h1 className="blog-title">Biblioteca Digital</h1>
            <p className="blog-subtitle">
              Explora miles de libros
            </p>
          </div>
          
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

      {/* Barra de búsqueda */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar libros por título, autor o tema..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar
          </button>
        </form>
        <div className="search-examples">
          <span>Ejemplos: </span>
          <button onClick={() => { setSearchTerm('react'); loadBooks('react'); }} className="example-tag">
            React
          </button>
          <button onClick={() => { setSearchTerm('python'); loadBooks('python'); }} className="example-tag">
            Python
          </button>
          <button onClick={() => { setSearchTerm('fiction'); loadBooks('fiction'); }} className="example-tag">
            Ficción
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="blog-main">
        {error && (
          <ErrorMsg message={error} onRetry={handleRetry} />
        )}

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="results-info">
              <h2>Resultados para: "{searchTerm}"</h2>
              <span className="results-count">{books.length} libros encontrados</span>
            </div>

            <div className="posts-grid">
              {paginatedBooks.map(book => (
                <PostCard key={book.id} book={book} />
              ))}
            </div>

            {/* Paginación */}
            {books.length > 0 && (
              <div className="pagination">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  <svg className="pagination-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
                
                <span className="pagination-info">
                  Página {currentPage} de {totalPages}
                </span>
                
                <button 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Siguiente
                  <svg className="pagination-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};