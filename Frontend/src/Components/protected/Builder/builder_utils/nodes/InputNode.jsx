import React, { memo, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';

const InputNode = ({ id, data, isConnectable }) => {
  const textareaRef = useRef(null);
  const isReadOnly = data?.readOnly || false;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { [name]: value });
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [data.query]);

  return (
  <div style={{
    background: 'var(--card-bg)',
    border: `1px solid ${isReadOnly ? 'var(--accent-color)' : 'var(--border-color)'}`,
    borderRadius: '0.5rem',
    boxShadow: 'var(--shadow-color) 0 4px 24px -1px',
    width: data.width || 200,
    maxWidth: 300,
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    minHeight: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    opacity: isReadOnly ? 0.9 : 1,
  }}>
    <div style={{
      padding: '0.75rem',
      borderBottom: '1px solid var(--border-color)',
      background: isReadOnly ? 'var(--accent-color)' : 'var(--highlight-color)',
      borderRadius: '0.5rem 0.5rem 0 0',
    }}>
      {isReadOnly ? (
        <span style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: isReadOnly ? 'white' : 'var(--text-primary)',
          padding: '0.25rem',
        }}>
          {data.label || 'Input Node'}
        </span>
      ) : (
        <input
          type="text"
          name="label"
          value={data.label || 'Input Node'}
          onChange={handleInputChange}
          onPaste={(e) => e.stopPropagation()}
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            background: 'transparent',
            outline: 'none',
            border: 'none',
            width: '100%',
            padding: '0.25rem',
          }}
          className="focus:ring-1 focus:ring-[var(--accent-color)] rounded"
          placeholder="Node Label"
        />
      )}
    </div>
    <div style={{ padding: '0.75rem', flex: 1 }}>
      {/* Render fields based on template OR show saved data if readOnly */}
      {isReadOnly ? (
        // Show saved data in readOnly mode
        <div>
          <label style={{ 
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '0.25rem'
          }}>
            User Query
          </label>
          <div style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            borderRadius: '0.375rem',
            minHeight: 40,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {data.query || 'No query specified'}
          </div>
        </div>
      ) : (
        // Original editable fields for builder mode
        data.template?.required?.map((field, index) => (
          <div key={index} style={{ marginBottom: '0.75rem' }}>
            <label 
              htmlFor={`${field.name}-${id}`} 
              style={{ 
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '0.25rem'
              }}
            >
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                ref={field.name === 'query' ? textareaRef : null}
                id={`${field.name}-${id}`}
                name={field.name}
                value={data[field.name] || ''}
                onChange={handleInputChange}
                onPaste={(e) => e.stopPropagation()}
                rows={1}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '0.375rem',
                  outline: 'none',
                  resize: 'none',
                  overflow: 'hidden',
                  minHeight: 40,
                  maxHeight: 120,
                  transition: 'height 0.2s',
                }}
                className="focus:ring-1 focus:ring-[var(--accent-color)]"
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
              />
            ) : (
              <input
                id={`${field.name}-${id}`}
                type={field.type === 'password' ? 'password' : 'text'}
                name={field.name}
                value={data[field.name] || ''}
                onChange={handleInputChange}
                onPaste={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '0.375rem',
                  outline: 'none',
                }}
                className="focus:ring-1 focus:ring-[var(--accent-color)]"
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))
      )}
    </div>
    <Handle
      type="source"
      position={Position.Right}
      id="output"
      isConnectable={isConnectable}
      style={{
        background: 'var(--accent-color)',
        width: '0.75rem',
        height: '0.75rem',
        border: '2px solid var(--card-bg)',
      }}
    />
  </div>
);
};

export default memo(InputNode);