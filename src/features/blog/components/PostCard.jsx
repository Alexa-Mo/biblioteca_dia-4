// src/features/blog/components/PostCard.jsx (Actualizado)
import { Link } from 'react-router-dom';
import '../styles/components.css';

export const PostCard = ({ book, index }) => {
  const bookInfo = book.volumeInfo;
  const thumbnail = bookInfo.imageLinks?.thumbnail || '/placeholder-book.jpg';
  const title = bookInfo.title || 'Título no disponible';
  const authors = bookInfo.authors ? bookInfo.authors.join(', ') : 'Autor desconocido';
  const description = bookInfo.description 
    ? bookInfo.description.substring(0, 120) + '...' 
    : 'Descripción no disponible';

  return (
    <Link to={`/blog/book/${book.id}`} className="post-card-link">
      <div 
        className="post-card"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="book-image-container">
          <img 
            src={thumbnail} 
            alt={title}
            className="book-image"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDEyOCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00NCA1Nkg4NCIgc3Ryb2tlPSIjOEM5M0FBIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNNDQgODRIODQiIHN0cm9rZT0iIzhDOUE5QSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTQ0IDExMkg4NCIgc3Ryb2tlPSIjOEM5M0FBIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
            }}
          />
        </div>
        
        <div className="post-card-header">
          <h2 className="post-card-title">{title}</h2>
          <span className="post-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
        </div>

        <div className="book-authors">
          <span className="author-label">Por: </span>
          {authors}
        </div>

        <p className="post-card-body">{description}</p>

        <div className="post-card-footer">
          <span className="read-more">
            Ver detalles 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};