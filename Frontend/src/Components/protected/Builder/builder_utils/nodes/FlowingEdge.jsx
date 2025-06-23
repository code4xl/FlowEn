import React from 'react';
import { getBezierPath } from '@xyflow/react';

const FlowingEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const isReadOnly = data?.readOnly || false;

  return (
    <>
      {/* Main edge path */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {/* Glowing background */}
      <path
        id={`${id}-glow`}
        style={{
          stroke: 'var(--accent-color)',
          strokeWidth: 6,
          filter: 'blur(4px)',
          opacity: 0.6,
          animation: 'flowingGlow 3s linear infinite',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      
      {/* Animated dashed line */}
      <path
        id={`${id}-flow`}
        style={{
          stroke: 'var(--accent-color)',
          strokeWidth: 2,
          strokeDasharray: '8 4',
          animation: 'flowingDash 1s linear infinite',
          filter: 'brightness(1.2)',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes flowingDash {
          from {
            stroke-dashoffset: 12;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes flowingGlow {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </>
  );
};

export default FlowingEdge;