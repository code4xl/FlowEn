import React, { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { Copy, ArrowRightCircle } from "lucide-react";

const OutputNode = ({ id, data, isConnectable }) => {
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);
  const isReadOnly = data?.readOnly || false;

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.style.height = "auto";
      outputRef.current.style.height = outputRef.current.scrollHeight + "px";
    }
  }, [data.agentOutput]);

  const handleCopy = () => {
    if (data.agentOutput) {
      navigator.clipboard.writeText(data.agentOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleOutputClick = (e) => {
    e.stopPropagation();
  };

  const handleOutputMouseDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "0.5rem",
        boxShadow: "var(--shadow-color) 0 4px 24px -1px",
        width: data.width || 400,
        maxWidth: 500,
        color: "var(--text-primary)",
        fontSize: "0.85rem",
        minHeight: 120,
      }}
    >
      <div
        className="drag"
        style={{
          padding: "0.75rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "move",
          background: "var(--highlight-color)",
          borderRadius: "0.5rem 0.5rem 0 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ArrowRightCircle
            size={16}
            style={{ color: "var(--accent-color)" }}
          />
          <span style={{ fontWeight: 600 }}>{data.label || "Output Node"}</span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: "0.25rem",
            borderRadius: "0.25rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
          className="hover:bg-[var(--highlight-color)] transition-colors"
          title="Copy output"
        >
          <Copy size={15} />
        </button>
      </div>
      <div
        onClick={handleOutputClick}
        onMouseDown={handleOutputMouseDown}
        className="nodrag nowheel"
        style={{
          padding: "0.75rem",
          minHeight: 60,
          maxHeight: 250,
          overflowY: "auto",
          background: "var(--input-bg)",
          userSelect: "text",
          cursor: "text",
          borderRadius: "0 0 0.5rem 0.5rem",
        }}
        ref={outputRef}
      >
        {data.agentOutput ? (
          <div
            className="nodrag nowheel"
            style={{
              color: "var(--text-primary)",
              fontSize: "0.8rem",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {data.agentOutput}
          </div>
        ) : (
          <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
            {isReadOnly
              ? "No output generated yet"
              : data.template?.required?.find((f) => f.name === "agentOutput")
                  ?.placeholder || "Workflow output will appear here..."}
          </span>
        )}
        {copied && (
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--accent-color)",
            }}
          >
            Copied!
          </span>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        isConnectable={isConnectable}
        style={{
          background: "var(--accent-color)",
          width: "0.75rem",
          height: "0.75rem",
          border: "2px solid var(--card-bg)",
        }}
      />
    </div>
  );
};

export default memo(OutputNode);
