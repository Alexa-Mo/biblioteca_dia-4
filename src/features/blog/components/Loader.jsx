// src/features/blog/components/Loader.jsx
import '../styles/components.css';

export const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="loader-book">
          <div className="book-page"></div>
          <div className="book-page"></div>
          <div className="book-page"></div>
        </div>
        <p className="loader-text">Buscando en la biblioteca...</p>
      </div>
    </div>
  );
};