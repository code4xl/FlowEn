import React, { memo, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { BrainCircuit, Copy } from "lucide-react";

const LLMNode = ({ id, data, isConnectable, onCopyApiKeyToAllLLMs }) => {
  const textareaRef = useRef(null);
  const isReadOnly = data?.readOnly || false;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newData = { [name]: value };

    // Handle model provider change
    if (name === "modelProvider") {
      const providerOptions = data.template?.required?.find(
        (f) => f.name === "modelName"
      )?.optionsByProvider;
      if (providerOptions && providerOptions[value]) {
        newData.modelName = providerOptions[value][0] || "";
      }
    }

    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, newData);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [data.systemPrompt]);

  const renderField = (field, index) => {
    const fieldValue = data[field.name] || "";

    switch (field.type) {
      case "dropdown":
        let options = field.options || [];

        // Handle dynamic options based on provider
        if (
          field.name === "modelName" &&
          field.optionsByProvider &&
          data.modelProvider
        ) {
          options = field.optionsByProvider[data.modelProvider] || [];
        }

        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              {field.label}
            </label>
            <select
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-primary)",
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                borderRadius: "0.375rem",
                outline: "none",
                cursor: "pointer",
              }}
              className="focus:ring-1 focus:ring-[var(--accent-color)]"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "textarea":
        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              {field.label}
            </label>
            <textarea
              ref={field.name === "systemPrompt" ? textareaRef : null}
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              onPaste={(e) => e.stopPropagation()}
              rows={2}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-primary)",
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                borderRadius: "0.375rem",
                outline: "none",
                resize: "vertical",
                minHeight: 60,
                maxHeight: 120,
              }}
              className="focus:ring-1 focus:ring-[var(--accent-color)]"
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}...`
              }
            />
          </div>
        );

      case "password":
        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              {field.label}
            </label>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              <input
                type="password"
                name={field.name}
                value={fieldValue}
                onChange={handleInputChange}
                onPaste={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                  outline: "none",
                }}
                className="focus:ring-1 focus:ring-[var(--accent-color)]"
                placeholder={
                  field.placeholder || `Enter ${field.label.toLowerCase()}...`
                }
              />
              {fieldValue &&
                onCopyApiKeyToAllLLMs &&
                field.name === "apiKey" && (
                  <button
                    type="button"
                    title="Copy API Key to all LLM Nodes"
                    style={{
                      padding: "0.5rem",
                      background: "var(--highlight-color)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      color: "var(--text-primary)",
                    }}
                    className="hover:bg-[var(--accent-color)] hover:text-white transition-colors"
                    onClick={() => onCopyApiKeyToAllLLMs(fieldValue)}
                  >
                    <Copy size={14} />
                  </button>
                )}
            </div>
          </div>
        );

      default:
        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              onPaste={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-primary)",
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                borderRadius: "0.375rem",
                outline: "none",
              }}
              className="focus:ring-1 focus:ring-[var(--accent-color)]"
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}...`
              }
            />
          </div>
        );
    }
  };

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${
          isReadOnly ? "var(--accent-color)" : "var(--border-color)"
        }`,
        borderRadius: "0.5rem",
        boxShadow: "var(--shadow-color) 0 4px 24px -1px",
        width: data.width || 280,
        maxWidth: 350,
        color: "var(--text-primary)",
        fontSize: "0.85rem",
        minHeight: 200,
        opacity: isReadOnly ? 0.9 : 1,
      }}
    >
      <div
        style={{
          padding: "0.75rem",
          borderBottom: "1px solid var(--border-color)",
          background: isReadOnly
            ? "var(--accent-color)"
            : "var(--highlight-color)",
          borderRadius: "0.5rem 0.5rem 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <BrainCircuit
            size={16}
            style={{ color: isReadOnly ? "white" : "var(--accent-color)" }}
          />
          {isReadOnly ? (
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "white",
                padding: "0.25rem",
              }}
            >
              {data.label || "LLM Node"}
            </span>
          ) : (
            <input
              type="text"
              name="label"
              value={data.label || "LLM Node"}
              onChange={handleInputChange}
              onPaste={(e) => e.stopPropagation()}
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "var(--text-primary)",
                background: "transparent",
                outline: "none",
                border: "none",
                flex: 1,
                padding: "0.25rem",
              }}
              className="focus:ring-1 focus:ring-[var(--accent-color)] rounded"
              placeholder="Node Label"
            />
          )}
        </div>
      </div>
      <div
        style={{
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {isReadOnly ? (
          // Show saved data in readOnly mode
          <>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                Model Provider
              </label>
              <div
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                }}
              >
                {data.modelProvider || "Not specified"}
              </div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                Model Name
              </label>
              <div
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                }}
              >
                {data.modelName || "Not specified"}
              </div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                System Prompt
              </label>
              <div
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                  minHeight: 60,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {data.systemPrompt || "No system prompt specified"}
              </div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                API Key
              </label>
              <div
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                }}
              >
                {data.apiKey ? "••••••••••••••••" : "Not configured"}
              </div>
            </div>
          </>
        ) : (
          // Original editable fields for builder mode
          data.template?.required?.map((field, index) =>
            renderField(field, index)
          )
        )}
      </div>
      {/* Handles remain the same */}
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
      <Handle
        type="source"
        position={Position.Right}
        id="output"
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

export default memo(LLMNode);
