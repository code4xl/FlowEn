import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ArrowDownCircle, Expand } from 'lucide-react';

const PatternMetaNode = ({ id, data, isConnectable }) => {
    const isReadOnly = data?.readOnly || false;
  return (
    <div style={{
    //   background: 'var(--card-bg)',
      border: '2px solid var(--accent-color)',
      borderRadius: '0.75rem',
      boxShadow: 'var(--shadow-color) 0 8px 32px -4px',
      width: '240px',
      color: 'var(--text-primary)',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      background: `linear-gradient(135deg, var(--card-bg) 0%, var(--highlight-color) 100%)`,
    }}>
      {/* Pattern indicator */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        background: 'var(--accent-color)',
        color: 'white',
        borderRadius: '0.25rem',
        padding: '0.25rem 0.5rem',
        fontSize: '0.7rem',
        fontWeight: '600',
      }}>
        PATTERN
      </div>

      <div className="flex items-center gap-2 mb-3">
        <ArrowDownCircle size={24} style={{ color: 'var(--accent-color)' }} />
        <span className="font-bold text-lg text-center" style={{ color: 'var(--text-primary)' }}>
          {data.label}
        </span>
      </div>
      
      <div className="text-sm text-center mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        {data.description}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => data.onExpand && data.onExpand(id)}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'all 0.2s',
          }}
          className="hover:bg-[var(--button-hover)] hover:scale-105"
        >
          <Expand size={14} />
          Expand
        </button>
        
        {data.onCollapse && (
          <button
            onClick={() => data.onCollapse && data.onCollapse(id)}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="hover:bg-[var(--highlight-color)] hover:text-[var(--text-primary)]"
          >
            Collapse
          </button>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="input"
        isConnectable={isConnectable}
        style={{
          background: 'var(--accent-color)',
          width: '0.75rem',
          height: '0.75rem',
          border: '2px solid var(--card-bg)',
        }}
      />
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

export default PatternMetaNode;