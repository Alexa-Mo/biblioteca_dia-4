import React from 'react';

// Envuelve el componente con forwardRef
const TextField = React.forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  ...props 
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <input
        ref={ref} // Pasa el ref al input
        type={type}
        className={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
});

// Opcional: Agrega displayName para mejor debugging
TextField.displayName = 'TextField';

export default TextField;