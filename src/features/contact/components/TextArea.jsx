// src/features/contact/components/TextArea.jsx
import React, { useState, useEffect } from 'react';
import '../styles/contact.css';

export const TextArea = React.forwardRef(({
  label,
  error,
  description,
  maxLength = 2000,
  ...props
}, ref) => {
  const [charCount, setCharCount] = useState(props.value?.length || 0);

  useEffect(() => {
    setCharCount(props.value?.length || 0);
  }, [props.value]);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    props.onChange?.(e);
  };

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={props.id} className="form-label">
          {label}
          {props.required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        {...props}
        onChange={handleChange}
        className={`form-textarea ${error ? 'form-input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      
      <div className="textarea-footer">
        {description && !error && (
          <div className="form-description">{description}</div>
        )}
        
        <div className="char-count">
          {charCount}/{maxLength}
        </div>
      </div>
      
      {error && (
        <div id={`${props.id}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';