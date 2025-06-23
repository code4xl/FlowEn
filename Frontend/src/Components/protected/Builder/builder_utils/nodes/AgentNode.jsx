import React, { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { Group, Copy, ChevronDown } from "lucide-react";

const AgentNode = ({ id, data, isConnectable, onCopyApiKeyToAllAgents }) => {
  const [showDropdown, setShowDropdown] = useState(null);
  const textareaRef = useRef(null);
  const isReadOnly = data?.readOnly || false;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newData = { [name]: value };

    // Handle model provider change
    if (name === "modelProvider") {
      const modelNameField = data.template?.required?.find(
        (f) => f.name === "modelName"
      );
      if (
        modelNameField?.optionsByProvider &&
        modelNameField.optionsByProvider[value]
      ) {
        newData.modelName = modelNameField.optionsByProvider[value][0] || "";
      }
    }

    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, newData);
    }
  };

  const handleMultiSelectChange = (fieldName, option, isChecked) => {
    const currentValues = data[fieldName] || [];
    let newValues;

    if (isChecked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter((item) => item !== option);
    }

    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { [fieldName]: newValues });
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
    const fieldValue =
      data[field.name] || (field.type === "multi-select" ? [] : "");

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

      case "multi-select":
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
            <div style={{ position: "relative" }}>
              <div
                onClick={() =>
                  setShowDropdown(
                    showDropdown === field.name ? null : field.name
                  )
                }
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color:
                    fieldValue.length > 0
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                  outline: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                className="hover:border-[var(--accent-color)] transition-colors"
              >
                <span>
                  {fieldValue.length > 0
                    ? `${fieldValue.length} selected`
                    : `Select ${field.label}`}
                </span>
                <ChevronDown size={16} />
              </div>

              {showDropdown === field.name && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.375rem",
                    boxShadow: "var(--shadow-color) 0 4px 12px",
                    zIndex: 1000,
                    maxHeight: "150px",
                    overflowY: "auto",
                    marginTop: "2px",
                  }}
                >
                  {(field.options || []).map((option) => (
                    <div
                      key={option}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                      className="hover:bg-[var(--highlight-color)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        const isChecked = !fieldValue.includes(option);
                        handleMultiSelectChange(field.name, option, isChecked);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={fieldValue.includes(option)}
                        readOnly
                        style={{ margin: 0 }}
                      />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Show selected items */}
            {fieldValue.length > 0 && (
              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.25rem",
                }}
              >
                {fieldValue.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.25rem 0.5rem",
                      background: "var(--accent-color)",
                      color: "white",
                      borderRadius: "9999px",
                      fontSize: "0.7rem",
                    }}
                  >
                    {item}
                    <button
                      onClick={() =>
                        handleMultiSelectChange(field.name, item, false)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: 0,
                        lineHeight: 1,
                        fontSize: "0.8rem",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              rows={1}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-primary)",
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                borderRadius: "0.375rem",
                outline: "none",
                resize: "none",
                overflow: "hidden",
                minHeight: 40,
                maxHeight: 120,
                transition: "height 0.2s",
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
                onCopyApiKeyToAllAgents &&
                (field.name === "llmApiKey" || field.name === "toolApiKey") && (
                  <button
                    type="button"
                    title={`Copy ${field.label} to all Agent Nodes`}
                    style={{
                      padding: "0.5rem",
                      background: "var(--highlight-color)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      color: "var(--text-primary)",
                    }}
                    className="hover:bg-[var(--accent-color)] hover:text-white transition-colors"
                    onClick={() =>
                      onCopyApiKeyToAllAgents(fieldValue, field.name)
                    }
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
        border: "1px solid var(--border-color)",
        borderRadius: "0.5rem",
        boxShadow: "var(--shadow-color) 0 4px 24px -1px",
        width: data.width || 320,
        maxWidth: 400,
        color: "var(--text-primary)",
        fontSize: "0.85rem",
        minHeight: 300,
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
          <Group
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
              value={data.label || "Agent Node"}
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
        {/* Group fields into sections for better organization */}
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "var(--accent-color)",
              marginBottom: "0.5rem",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "0.25rem",
            }}
          >
            LLM Configuration
          </div>
          {data.template?.required
            ?.filter((field) =>
              [
                "modelProvider",
                "modelName",
                "systemPrompt",
                "llmApiKey",
              ].includes(field.name)
            )
            ?.map((field, index) => renderField(field, index))}
        </div>

        <div>
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "var(--accent-color)",
              marginBottom: "0.5rem",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "0.25rem",
            }}
          >
            Tool Configuration
          </div>
          {data.template?.required
            ?.filter((field) =>
              ["toolActions", "toolApiKey"].includes(field.name)
            )
            ?.map((field, index) => renderField(field, index))}
        </div>
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

export default memo(AgentNode);
